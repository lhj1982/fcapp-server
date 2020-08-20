// import config from '../../config';
import logger from '../../middleware/logger.middleware';
import { pp } from '../../utils/stringUtil';
// import { nowDate } from '../../utils/dateUtil';
import GenericService from './generic.service';
import FileService from './file.service';

import { IUserModel } from '../../data/repositories/user/user.model';
import LoginSessionsRepo from '../../data/repositories/user/loginSessions.repository';
import UsersRepo from '../../data/repositories/user/users.repository';
import UserDevelopmentsRepo from '../../data/repositories/user/userDevelopments.repository';
import { ResourceNotFoundException, WrongCredentialException } from '../../exceptions/custom.exceptions';
import WXBizDataCrypt from '../../utils/WXBizDataCrypt';

class UserService extends GenericService {
  async logSession(session: any): Promise<void> {
    try {
      await LoginSessionsRepo.addNew(session);
    } catch (err) {
      throw err;
    }
  }

  async updateSession(session: any): Promise<void> {
    try {
      await LoginSessionsRepo.updateSession(session);
    } catch (err) {
      throw err;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const user = await UsersRepo.findById(id);
      const {developments} = user;
      const newDevelopments = developments.map(development => {
        const {id: developmentId} = development;
        const tmp = Object.assign(development.toObject(), {url: `http://qfaww9hai.hn-bkt.clouddn.com/${developmentId}.svg`});
        // console.log(tmp);
        return tmp;
      });
      user.developments = newDevelopments;
      return user;
    } catch (err) {
      throw err;
    }
  }
  
  async compareUsers(userId1: string, date1: string, userId2: string, date2: string): Promise<any> {
    const development1 = await UserDevelopmentsRepo.findByUserAndDate(userId1, date1);
    const development2 = await UserDevelopmentsRepo.findByUserAndDate(userId2, date2);
    
  }

  async updateDevelopmentsImages(): Promise<any> {
    const developments = await UserDevelopmentsRepo.findAll();
    // console.log(developments);
    const promises = developments.map(async development => {
      const {id, attributes} = development;
      const imageStr = this.generateImageString(attributes);
      // console.log(imageStr);
      // process.stdout.write(imageStr);
      const base64Str = Buffer.from(imageStr, 'binary').toString('base64');
      const uploadResp = await FileService.uploadFileBase64(`${id}.svg`, base64Str);
      return null;
    });
    return await Promise.all(promises);
  }

  generateImageString(attribute: any): string {
    const radar = require('svg-radar-chart')
    const {defending, physical, speed, attacking, technical, mental} = attribute;
    const defendingInRatio = defending/20;
    const physicalInRatio = physical/20;
    const speedInRatio = speed/20;
    const attackingInRatio = attacking/20;
    const technicalInRatio = technical/20;
    const mentalInRatio = mental/20;
    // console.log(mentalInRatio);
    const chart = radar({
        // columns
        defending: `Defending(${defending})`,
        physical: `Physcial(${physical})`,
        speed: `Speed(${speed})`,
        attacking: `Attacking(${attacking})`,
        technical: `Technical(${technical})`,
        mental: `Mental(${mental})`
    }, [
        // data
        {class: 'iphone', defending: defendingInRatio, physical:  physicalInRatio, speed: speedInRatio, attacking: attackingInRatio, technical: technicalInRatio, mental: mentalInRatio},
        {class: 'iphone', defending: 1, physical:  1, speed: 1, attacking: 1, technical: 1, mental: 1}
    ]);

    const stringify = require('virtual-dom-stringify')

    const svg = `
    <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <style>
            .axis {
                stroke-width: .2;
            }
            .scale {
                stroke-width: .2;
            }
            .shape {
                fill-opacity: .3;
            }
            .shape:hover {
                fill-opacity: .6;
            }
        </style>
        ${stringify(chart)}
    </svg>
    `
    return svg;
  }

}

export default new UserService();
