import { Injectable } from '@nestjs/common';
import { CreateDrawitInput } from './dto/create-drawit.input';
import { UpdateDrawitInput } from './dto/update-drawit.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DrawIt, DrawItDocument } from './schema/drawit.schema';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from 'graphql';
import { StartGameInput } from './dto/start-game.input';
import { SubscriptionService } from './subscription.service';
import { Game } from './game';
import { GameSub } from './entities/gameSub.entity';
import { JoinGameInput } from './dto/join-game.input';
import { AddChatMessageInput } from './dto/add-chat-message.input';

const runningGames = new Map<string, Game>();

@Injectable()
export class DrawitService {
  constructor(
    @InjectModel(DrawIt.name) private drawitModel: Model<DrawItDocument>,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  create(createDrawitInput: CreateDrawitInput) {
    return this.drawitModel.create(createDrawitInput);
  }

  findAll() {
    return this.drawitModel.find();
  }

  findOne(id: number) {
    return this.drawitModel.findOne({ _id: id });
  }

  update(id: number, updateDrawitInput: UpdateDrawitInput) {
    return this.drawitModel.updateOne({ _id: id }, updateDrawitInput);
  }

  remove(id: number) {
    return this.drawitModel.deleteOne({ _id: id });
  }

  async startGame({
    playersCount,
    pointsToWin,
    oneGuessPoints,
    timeLimit,
    KingPlayer,
    customWordlist,
    wordlistId,
    isPrivate,
  }: StartGameInput) {
    let wordlist: string[] = [];
    let language: string;
    let pack: string;
    if (wordlist && customWordlist) {
      throw new GraphQLError('Cannot use both wordlist and custom wordlist');
    }
    if (!wordlist && !customWordlist) {
      try {
        wordlist = (await this.drawitModel.findOne()).wordList;
      } catch (e) {
        throw new GraphQLError('Wordlist not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    }
    if (customWordlist) {
      wordlist = customWordlist.wordlist;
      language = customWordlist.language;
      pack = customWordlist.package;
    }
    if (wordlistId) {
      try {
        const wordlistEl = await this.drawitModel.findById(wordlistId);
        wordlist = wordlistEl.wordList;
        language = wordlistEl.language;
        pack = wordlistEl.title;
      } catch (e) {
        throw new GraphQLError('Wordlist not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    }
    const gameId = uuidv4();
    const game = new Game(
      gameId,
      playersCount,
      pointsToWin,
      oneGuessPoints,
      timeLimit,
      runningGames,
      this.subscriptionService,
      isPrivate,
    );
    game.wordlist = wordlist;
    game.gameLanguage = language;
    game.gamePackage = pack;
    const playerId = game.addPlayer(KingPlayer, true);
    runningGames.set(gameId, game);

    const toPublish: GameSub[] = [];

    runningGames.forEach((game, key) => {
      if (!game.isPrivate) {
        toPublish.push({
          id: key,
          language: game.gameLanguage,
          package: game.gamePackage,
          playersCount: game.playersCount,
          maxPlayersCount: game.maxPlayersCount,
          pointsToWin: game.pointsToWin,
        });
      }
    });
    this.subscriptionService.getPubSub.publish('getGames', {
      getGames: toPublish,
    });

    return {
      id: gameId,
      playerId: playerId,
    };
  }

  joinGame({ gameId, playerId, playerAvatar, playerName }: JoinGameInput) {
    const game = runningGames.get(gameId);

    if (!game) {
      throw new GraphQLError('Game not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (game.playersCount >= game.maxPlayersCount) {
      throw new GraphQLError('Game is full', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (!game.playerIds.includes(playerId)) {
      game.addPlayer(
        { id: playerId, name: playerName, avatarId: playerAvatar },
        false,
      );
    } else {
      game.changePlayerData({
        id: playerId,
        name: playerName,
        avatarId: playerAvatar,
      });
    }

    return {
      players: game.players,
      chat: game.chat,
      guesses: game.guesses,
      currentCanvasState: game.currentCanvasState,
      maxPlayersCount: game.maxPlayersCount,
      pointsToWin: game.pointsToWin,
    };
  }

  isGameExist(gameId: string) {
    return runningGames.has(gameId);
  }

  getGames() {
    const games: GameSub[] = [];
    runningGames.forEach((game, key) => {
      if (!game.isPrivate) {
        games.push({
          id: key,
          language: game.gameLanguage,
          package: game.gamePackage,
          playersCount: game.playersCount,
          maxPlayersCount: game.maxPlayersCount,
          pointsToWin: game.pointsToWin,
        });
      }
    });

    this.subscriptionService.getPubSub.publish('getGames', {
      getGames: games,
    });
    return games;
  }

  addChatMessage({ gameId, message, playerId }: AddChatMessageInput) {
    const game = runningGames.get(gameId);
    if (!game) {
      throw new GraphQLError('Game not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    try {
      game.addChatMessage(message, playerId);
      return true;
    } catch (e) {
      throw new GraphQLError(e.message, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }
}
