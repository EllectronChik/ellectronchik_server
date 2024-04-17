export default interface IReqUserContext {
  user: {
    username: string;
    sub: string;
    role: string;
    rating: number;
  };
}
