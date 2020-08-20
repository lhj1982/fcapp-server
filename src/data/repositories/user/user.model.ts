import { Document } from 'mongoose';
import { IUserDevelopmentModel } from './userDevelopment.model';
interface IUser {
  firstName: string;
  lastName: string;
  age: number;
  team: string;
  preferFoot: string;
  position: string;
  height: number;
  weight: number;
  favoriteTeams: string[];
  favoritePlayers: string[];
}

export interface IUserModel extends IUser, Document {
  developments: IUserDevelopmentModel[];
}
