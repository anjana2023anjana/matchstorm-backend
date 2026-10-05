export interface IUserProfile {
  id: string;
  email: string;
  username: string;
  eloRating: number;
  matchesWon: number;
  matchesLost: number;
}

export interface IAuthPayload {
  token: string;
  user: IUserProfile;
}

export interface ILeaderboardEntry {
  id: string;
  username: string;
  eloRating: number;
  matchesWon: number;
  matchesLost: number;
}