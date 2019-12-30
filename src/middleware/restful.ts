import { Response, Request } from 'express'
import { isNumber, isError } from 'util'
import { IError, IErrorInfo } from 'kenote-config-helper'
import { Middleware, MiddlewareSetting, RegisterMiddlewareMethod } from 'kenote-express-helper'
import { oc } from 'ts-optchain'
import config from '~/config'
import { resufulInfo, DownloadOptions, IResponse } from '@/types/restful'
import { loadError } from '@/utils/error'
import logger from '@/utils/logger'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as mime from 'mime-types'

const { language, options } = config
const { __ErrorCode, ErrorInfo } = loadError(language)
const preview = oc(options).preview({})

@MiddlewareSetting({
  header: oc(options).headers([])
})
class Restful extends Middleware {

  @RegisterMiddlewareMethod()
  public api (res: Response, req: Request): any {
    return (data: any, error?: number | IError | IErrorInfo, opts?: string[]): Response => {
      error = error || __ErrorCode.ERROR_STATUS_NULL
      let errorCode: number = isNumber(error) ? error : <number> error.code
      let Status: IErrorInfo = isNumber(error) ? <IErrorInfo> ErrorInfo(errorCode, opts, true) : <IErrorInfo> error
      if (isError(error)) {
        Status = { code: <number> error.code, message: error.message }
      }
      let info: resufulInfo = { data, Status }
      logger.info(`Result API -->`, JSON.stringify({
        path: req.originalUrl,
        method: req.method,
        headers: req.headers,
        payload: req.body,
        response: info
      }, null, 2))
      return res.json(info)
    }
  }

  @RegisterMiddlewareMethod()
  public notfound (res: Response): any {
    return (): Response | void => res.status(404).render('error', { message: 'This page could not be found' })
  }

  @RegisterMiddlewareMethod()
  public downloadFile (res: IResponse): any {
    return (file: string, options?: DownloadOptions): Response | void => {
      if (!fs.existsSync(file)) {
        return res.notfound()
      }
      let fileStream: Buffer = fs.readFileSync(file)
      let extname: string = path.extname(file)
      let contentType: string = oc(options).download() ? undefined : preview[extname]
      res.setHeader('Content-Type', contentType || 'application/octet-stream')
      return res.send(fileStream)
    }
  }
}

export default new Restful().hendler()
