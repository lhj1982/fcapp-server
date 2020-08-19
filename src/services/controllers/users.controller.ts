import { Route, Path, Example, Get, Post, Put, SuccessResponse, Tags, Body, OperationId, Request, Response, Security } from 'tsoa';
import { IUpdateUserRequest, IAddUserTagRequest, ISubscribeMemberRequest, IRedeemMemberCardRequest } from '../requests';
import { IResponse, IErrorResponse } from '../responses';
import GenericController from './generic.controller';

import { InvalidRequestException, ResourceNotFoundException, AccessDeniedException } from '../../exceptions/custom.exceptions';
import UserService from '../svcs/user.service';

@Route('/users')
export class UsersController extends GenericController {
  // getUsers = async (req: Request, res: Response) => {
  //   try {
  //     const contact = await UsersRepo.find({});
  //     res.json(contact);
  //   } catch (err) {
  //     res.send(err);
  //   }
  // };

  // sendInvitation = (req: Request, res: Response) => {
  //   const { openId } = req.body;
  // };

  // @Get('/access_token/{appName}')
  // @Tags('user')
  // @OperationId('getUserDetailById')
  // @Security('access_token')
  // @Response<IErrorResponse>('400', 'Bad Request')
  // @SuccessResponse('200', 'OK')
  // public async getAccessToken(@Path('appName') appName: string): Promise<IResponse> {
  //   // const { appName } = req.params;
  //   const response = await AuthApi.getAccessToken(appName);
  //   return {code: 'SUCCESS', data: response};
  // };

  @Post('/update-developments-images')
  @Tags('user')
  @OperationId('updateUserDevelopmentsImages')
  @Response<IErrorResponse>('400', 'Bad Request')
  @SuccessResponse('200', 'OK')
  public async updateDevelopmentsImageUrl(): Promise<IResponse> {
    try {
      await UserService.updateDevelopmentsImages();
      return {code: 'SUCCESS', data: null};
    } catch (err) {
      throw err;
    }
  }

  /**
   * Retrieve user information.
   *
   * @summary Retrieve user information
   * @param {[type]} '/{userId}' [description]
   */
  @Get('/{userId}')
  @Tags('user')
  @OperationId('getUserDetailById')
  @Response<IErrorResponse>('400', 'Bad Request')
  @SuccessResponse('200', 'OK')
  public async getUserDetails(@Path('userId') userId: string, @Request() req: any): Promise<IResponse> {

    try {
      const user = await UserService.findById(userId);
      return { code: 'SUCCESS', data: user };
    } catch (err) {
      throw err;
    }
  }


}
