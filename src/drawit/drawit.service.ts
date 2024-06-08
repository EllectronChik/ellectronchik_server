import { Injectable } from '@nestjs/common';
import { CreateDrawitInput } from './dto/create-drawit.input';
import { UpdateDrawitInput } from './dto/update-drawit.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DrawIt, DrawItDocument } from './schema/drawit.schema';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from 'graphql';
import { StartGameInput, KingPlayerInput } from './dto/start-game.input';
import { SubscriptionService } from './subscription.service';

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
    timeLimit,
    KingPlayer,
    customWordlist,
    wordlistId,
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
      timeLimit,
      this.subscriptionService,
    );
    game.setWordlist = wordlist;
    game.setGameLanguage = language;
    game.setGamePackage = pack;
    const playerId = game.addPlayer(KingPlayer, true);
    runningGames.set(gameId, game);

    const toPublish: any = [];

    runningGames.forEach((game, key) => {
      toPublish.push({
        id: key,
        language: game.getGameLanguage,
        package: game.getGamePackage,
        playersCount: game.getPlayersCount,
        pointsToWin: game.getPointsToWin,
      });
    });
    this.subscriptionService.getPubSub.publish('getGames', {
      getGames: toPublish,
    });

    return {
      id: gameId,
      playerId: playerId,
    };
  }

  getGames() {
    const games = [];
    runningGames.forEach((game, key) => {
      games.push({
        id: key,
        language: game.getGameLanguage,
        package: game.getGamePackage,
        playersCount: game.getPlayersCount,
        pointsToWin: game.getPointsToWin,
      });
    });

    this.subscriptionService.getPubSub.publish('getGames', {
      getGames: games,
    });
    return games;
  }
}

class Game {
  private id: string;
  private playersCount: number;
  private pointsToWin: number;
  private timeLimit: number;
  private chat: string[] = [];
  private guesses: string[] = [];
  private answer: string;
  private gameLanguage: string;
  private gamePackage: string;
  private wordlist: string[] = [];
  private currentCanvasState: string;
  private inactivityTimer: NodeJS.Timeout;
  private subscriptionService: SubscriptionService;
  private players: {
    [key: string]: {
      name: string;
      score: number;
      wins: number;
      isGuessed: boolean;
      isDrawing: boolean;
      isKing: boolean;
    };
  };

  constructor(
    id: string,
    playersCount: number,
    pointsToWin: number,
    timeLimit: number,
    subscriptionService: SubscriptionService,
  ) {
    this.id = id;
    this.playersCount = playersCount;
    this.pointsToWin = pointsToWin;
    this.timeLimit = timeLimit;
    this.players = {};
    this.updateInactivityTimer();
    this.subscriptionService = subscriptionService;
  }

  get getId() {
    return this.id;
  }

  get getChat() {
    return this.chat;
  }

  get getGuesses() {
    return this.guesses;
  }

  get getGameLanguage() {
    return this.gameLanguage;
  }

  get getGamePackage() {
    return this.gamePackage;
  }

  get getPlayersCount() {
    return this.playersCount;
  }

  get getPointsToWin() {
    return this.pointsToWin;
  }

  set addChatMessage(message: string) {
    this.updateInactivityTimer();
    this.chat.push(message);
  }

  set setGameLanguage(language: string) {
    this.gameLanguage = language;
  }

  set setGamePackage(packageName: string) {
    this.gamePackage = packageName;
  }

  set setWordlist(wordlist: string[]) {
    this.wordlist = wordlist;
  }

  set setAnswer(answer: string) {
    this.answer = answer;
  }

  addGuess(guess: string, playerId: string) {
    if (this.players[playerId].isDrawing) {
      throw new GraphQLError('Cannot guess while drawing', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (this.players[playerId].isGuessed) {
      throw new GraphQLError('Cannot guess twice', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (this.answer === guess) {
      this.players[playerId].isGuessed = true;
    }
    this.guesses.push(guess);
    return this.guesses;
  }

  addPlayer({ id, name }: KingPlayerInput, isKing: boolean) {
    if (id in this.players) {
      throw new GraphQLError('Player already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    this.players[id] = {
      name,
      score: 0,
      wins: 0,
      isGuessed: false,
      isDrawing: false,
      isKing,
    };
    return id;
  }

  endGame() {
    console.log('-'.repeat(20) + 'Before endGame' + '-'.repeat(20));

    runningGames.forEach((game, key) => {
      console.log(`${key}: ${game.getId}`);
      console.log('\n\n');
    });

    clearTimeout(this.inactivityTimer);
    runningGames.delete(this.id);
    const toPublish = [];

    runningGames.forEach((game, key) => {
      toPublish.push({
        id: key,
        language: game.getGameLanguage,
        package: game.getGamePackage,
        playersCount: game.getPlayersCount,
        pointsToWin: game.getPointsToWin,
      });
    });

    this.subscriptionService.getPubSub.publish('getGames', {
      getGames: toPublish,
    });
  }

  updateInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.endGame();
    }, this.timeLimit * 1000);
  }

  removePlayer(playerId: string) {
    delete this.players[playerId];
    if (Object.keys(this.players).length === 0) {
      this.endGame();
    }
  }
}
