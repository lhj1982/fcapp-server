import { Schema } from 'mongoose';
import { IUserModel } from './user.model';

export const UserSchema: Schema<IUserModel> = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    age : {type: Number},
	team : {type: String},
	preferFoot : {type: String},
	position : {type: String},
	height : {type: Number},
	weight: {type: Number},
	favoriteTeams : [
		{type: String}
	],
	favoritePlayers : [
		{type: String}
	],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual('developments', {
  ref: 'UserDevelopment',
  localField: '_id',
  foreignField: 'user'
});

