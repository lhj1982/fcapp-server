import { Model, model } from 'mongoose';
import { IUserDevelopmentModel } from './userDevelopment.model';
import { UserDevelopmentSchema } from './userDevelopment.schema';

const UserDevelopment: Model<IUserDevelopmentModel> = model<IUserDevelopmentModel>('UserDevelopment', UserDevelopmentSchema, 'userDevelopments');
import { nowDate } from '../../../utils/dateUtil';

class UserDevelopmentsRepo {

async findAll():Promise<IUserDevelopmentModel[]> {
  return await UserDevelopment.find({}).exec();
}
async findByUserAndDate(userId: string, date: string): Promise<IUserDevelopmentModel> {
  return await UserDevelopment.findOne({user: userId ,date}).exec();
}
}

export default new UserDevelopmentsRepo();
