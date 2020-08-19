// import config from '../../config';
import logger from '../../middleware/logger.middleware';
import { pp } from '../../utils/stringUtil';
// import { nowDate } from '../../utils/dateUtil';
import GenericService from './generic.service';

import { IUserModel } from '../../data/repositories/user/user.model';
import LoginSessionsRepo from '../../data/repositories/user/loginSessions.repository';
import UsersRepo from '../../data/repositories/user/users.repository';
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

      return { ...user };
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();
