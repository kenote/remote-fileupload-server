import { Request, Response, NextFunction } from 'express'
import { IResponse, HeaderOptions, resufulInfo } from '@/types/restful'
import { oc } from 'ts-optchain'
import http from '@/utils/http'
import config from '~/config'
import { loadError } from '@/utils/error'

const { language, options } = config
const { CustomError, __ErrorCode } = loadError(language)

export const authenticate = async function (req: Request, res: IResponse, next: NextFunction): Promise<Response | void>  {
  if (!req.headers.origin) {
    return res.notfound()
  }
  let status: number = oc(options).certification.status(200)
  let jw_token: string = oc(req.headers).authorization('')!.replace(/^(Bearer)\s{1}/, '')
  if (!req.headers.authorization) {
    return responseSend(res, __ErrorCode.ERROR_VERIFY_ID_FAILED, status)
  }
  try {
    let headers: HeaderOptions = {
      token: jw_token
    }
    let result: resufulInfo = await http.get(oc(options).certification.url(), null, headers)
    if (result.Status.code === 0 && oc(result).data.group.level(0) >= oc(options).certification.level(9000)) {
      return next()
    }
    else {
      return responseSend(res, __ErrorCode.ERROR_AUTH_FLAG_OPERATE, status)
    }
  } catch (error) {
    if (CustomError(error)) {
      return responseSend(res, error, status)
    }
    return responseSend(res, __ErrorCode.ERROR_VERIFY_ID_FAILED, status)
  }
}

function responseSend (res: IResponse, error: any, status?: number): Response | void {
  if (status === 404) {
    return res.notfound()
  }
  else {
    return res.api(null, error)
  }
}

