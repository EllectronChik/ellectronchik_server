import { GraphQLError } from 'graphql';
import { SubscriptionService } from './subscription.service';
import { KingPlayerInput } from './dto/start-game.input';
import { GameSub } from './entities/gameSub.entity';
import { IPlayer } from 'src/models/IPlayer';
import { IChatMessage } from 'src/models/IChatMessage';

export class Game {
  private _id: string;
  private _gameRunning: boolean;
  private _maxPlayersCount: number;
  private _pointsToWin: number;
  private _oneGuessPoints: number;
  private _timeLimit: number;
  private _chat: IChatMessage[] = [];
  private _guesses: string[] = [];
  private _answer: string;
  private _gameLanguage: string;
  private _gamePackage: string;
  private _wordlist: string[] = [];
  private _currentCanvasState: string;
  private _inactivityTimer: NodeJS.Timeout;
  private _gameStartedTimer: NodeJS.Timeout;
  private _subscriptionService: SubscriptionService;
  private _runningGames: Map<string, Game> = new Map();
  private _isPrivate: boolean;
  private _players: {
    [key: string]: IPlayer;
  };

  constructor(
    id: string,
    playersCount: number,
    pointsToWin: number,
    oneGuessPoints: number,
    timeLimit: number,
    runningGames: Map<string, Game>,
    subscriptionService: SubscriptionService,
    isPrivate: boolean,
  ) {
    this._id = id;
    this._maxPlayersCount = playersCount;
    this._pointsToWin = pointsToWin;
    this._oneGuessPoints = oneGuessPoints;
    this._timeLimit = timeLimit;
    this._players = {};
    this._runningGames = runningGames;
    this._subscriptionService = subscriptionService;
    this._isPrivate = isPrivate;
    this._gameRunning = false;
  }

  get id() {
    return this._id;
  }

  get chat() {
    return this._chat;
  }

  get guesses() {
    return this._guesses;
  }

  get gameLanguage() {
    return this._gameLanguage;
  }

  get gamePackage() {
    return this._gamePackage;
  }

  get maxPlayersCount() {
    return this._maxPlayersCount;
  }

  get pointsToWin() {
    return this._pointsToWin;
  }

  get isPrivate() {
    return this._isPrivate;
  }

  get playersCount() {
    return Object.keys(this._players).length;
  }

  get playerIds() {
    return Object.keys(this._players);
  }

  get players() {
    return Object.values(this._players);
  }

  get currentCanvasState() {
    return this._currentCanvasState;
  }

  get gameRunning() {
    return this._gameRunning;
  }

  set gameLanguage(language: string) {
    this._gameLanguage = language;
  }

  set gamePackage(packageName: string) {
    this._gamePackage = packageName;
  }

  set wordlist(wordlist: string[]) {
    this._wordlist = wordlist;
  }

  set answer(answer: string) {
    this._answer = answer;
  }

  addChatMessage(message: string, playerId: string) {
    this.updateInactivityTimer();
    this.chat.push({
      username: this._players[playerId].name,
      message,
      timestamp: Date.now(),
    });

    this._subscriptionService.getPubSub.publish(`${this._id}_commonData`, {
      commonData: {
        gameExist: true,
        gameRunning: this._gameRunning,
        players: this.players,
        chat: this._chat,
        guesses: this._guesses,
      },
    });
  }

  addGuess(guess: string, playerId: string) {
    if (!this._gameRunning) {
      throw new GraphQLError('Game is not running', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
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
    if (this._answer === guess) {
      this.players[playerId].isGuessed = true;

      this.players[playerId].score += this._oneGuessPoints;
      this.guesses.push(`${playerId} guessed the word`);
    } else {
      this.guesses.push(guess);
    }

    this._subscriptionService.getPubSub.publish(`${this._id}_commonData`, {
      commonData: {
        gameExist: true,
        gameRunning: this._gameRunning,
        players: this.players,
        chat: this._chat,
        guesses: this._guesses,
      },
    });
    return this.guesses;
  }

  addPlayer({ id, name, avatarId }: KingPlayerInput, isKing: boolean) {
    if (id in this.playerIds) {
      throw new GraphQLError('Player already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    this._players[id] = {
      id,
      name,
      avatarId,
      score: 0,
      wins: 0,
      isGuessed: false,
      isDrawing: false,
      isKing,
    };

    this.chat.push({
      username: 'System_key_247fcf77-2857-493d-aed8-cba7b73e11f9',
      message: `${name} joined the game`,
      timestamp: Date.now(),
    });
    this._subscriptionService.getPubSub.publish(`${this._id}_commonData`, {
      commonData: {
        gameExist: true,
        gameRunning: this._gameRunning,
        players: this.players,
        chat: this._chat,
        guesses: this._guesses,
      },
    });
    return id;
  }

  changePlayerData({ id, name, avatarId }: KingPlayerInput) {
    if (!this.playerIds.includes(id)) {
      throw new GraphQLError('Player not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    this._players[id].name = name;
    this._players[id].avatarId = avatarId;
    this._subscriptionService.getPubSub.publish(`${this._id}_commonData`, {
      commonData: {
        gameExist: true,
        gameRunning: this._gameRunning,
        players: this.players,
        chat: this._chat,
        guesses: this._guesses,
      },
    });
  }

  endGame() {
    clearTimeout(this._inactivityTimer);
    this._runningGames.delete(this._id);
    const toPublish: GameSub[] = [];

    this._runningGames.forEach((game, key) => {
      toPublish.push({
        id: key,
        language: game._gameLanguage,
        package: game._gamePackage,
        playersCount: game.playersCount,
        maxPlayersCount: game._maxPlayersCount,
        pointsToWin: game._pointsToWin,
      });
    });

    this._subscriptionService.getPubSub.publish('getGames', {
      getGames: toPublish,
    });

    this._subscriptionService.getPubSub.publish(`${this._id}_commonData`, {
      commonData: {
        gameExist: false,
        gameRunning: false,
        players: [],
        chat: [],
        guesses: [],
      },
    });
  }

  updateInactivityTimer() {
    if (this._inactivityTimer) {
      clearTimeout(this._inactivityTimer);
    }
    this._inactivityTimer = setTimeout(() => {
      this.endGame();
    }, this._timeLimit * 1000);
  }

  removePlayer(playerId: string) {
    delete this.players[playerId];
    if (Object.keys(this.players).length === 0) {
      this.endGame();
    } else {
      this._subscriptionService.getPubSub.publish(`${this._id}_commonData`, {
        commonData: {
          gameExist: true,
          gameRunning: this._gameRunning,
          players: this.players,
          chat: this._chat,
          guesses: this._guesses,
        },
      });
    }
  }
}
