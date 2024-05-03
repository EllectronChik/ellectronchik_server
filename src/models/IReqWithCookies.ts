export default interface IReqWithCookies {
  user: {
    username: string;
    sub: string;
    role: string;
    rating: number;
  };

  headers: { cookie: string };
}
