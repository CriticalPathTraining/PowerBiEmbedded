export default interface IUser {
  IsAuthenticated: boolean;
  DisplayName?: string;
  login(): void;
  logout(): void;
}