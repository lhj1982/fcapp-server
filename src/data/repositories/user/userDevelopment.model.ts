import { Document } from 'mongoose';
import { IUserModel } from './user.model';

interface IUserDevelopment {
  date: string;
  attributes: {
    defending: number,
    physical: number,
    speed: number,
    attacking: number,
    technical: number,
    mental: number
  }
}

export interface IUserDevelopmentModel extends IUserDevelopment, Document {
  developments: IUserDevelopmentModel;
}
