import { Schema } from 'mongoose';
import { IUserDevelopmentModel } from './userDevelopment.model';

export const UserDevelopmentSchema: Schema<IUserDevelopmentModel> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: {
      type: String,
      required: 'Date is required'
    },
    attributes: {
      defending: {
        type: Number
      },
      physical: {
        type: Number
      },
      speed: {
        type: Number
      },
      attacking: {
        type: Number
      },
      technical: {
        type: Number
      },
      mental: {
        type: Number
      }
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
