import { Request, Response, NextFunction } from 'express'
import { Controller, Router, Filter, Path } from 'kenote-express-helper'
import { IResponse } from '@/types/restful'
import { User } from '@/types/user'

export default class Passport extends Controller {

  /**
   * 校验访问令牌
   */
  @Router({ method: 'get', path: '/accesstoken' })
  public async accessToken (req: Request, res: IResponse, next: NextFunction): Promise<Response> {
    let user: User = {
      group: { level: 9000 }
    }
    return res.api(user)
  } 
}
