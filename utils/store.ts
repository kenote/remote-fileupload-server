import { Store, Connect, localProxy } from 'kenote-store-helper'
import { loadError } from './error'

const { __ErrorCode } = loadError()

@Connect({
  proxys: {
    local           : new localProxy()
  },
  errors: {
    mimetype        : __ErrorCode.ERROR_UPLOAD_FILE_MIMETYPE,
    limit           : __ErrorCode.ERROR_UPLOAD_FILESIZE_LARGEMAX
  }
})
export class IStore extends Store {}
