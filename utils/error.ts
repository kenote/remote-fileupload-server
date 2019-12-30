import { useError } from 'kenote-config-helper'
import { loadData } from 'kenote-config-helper/dist/utils.server'
import { ErrorCode, ErrorMessage } from '@/types/error'

const __ErrorCode: ErrorCode = <ErrorCode> loadData('data/errors/code')

export function loadError (lang: string = 'zh-cn', start: number = 1000) {
  let __ErrorMessage: ErrorMessage = <ErrorMessage> loadData(`data/errors/message/${lang}`)
  let { CustomError, ErrorInfo } = useError(__ErrorCode, __ErrorMessage, start)
  return { __ErrorCode, __ErrorMessage, CustomError, ErrorInfo }
}
