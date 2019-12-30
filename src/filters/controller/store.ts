import { Request, Response, NextFunction } from 'express'
import { Maps } from 'kenote-config-helper'
import { StroeOptions } from 'kenote-store-helper'
import { oc } from 'ts-optchain'
import { IResponse } from '@/types/restful'
import { loadData } from 'kenote-config-helper/dist/utils.server'


class Store {

  public async setting (req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { type } = req.params
    let stores: Maps<StroeOptions> = loadData('data/stores') as Maps<StroeOptions>
    let options: StroeOptions = stores[type || 'default']
    if (!options) {
      return res.notfound()
    }
    return next(options)
  }
}

export default new Store()
