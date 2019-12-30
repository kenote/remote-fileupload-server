import { Response } from 'express'
import { IError, IErrorInfo } from 'kenote-config-helper'
import { CancelToken } from 'axios'

/**
 * 自定义 Response
 */
export interface IResponse extends Response {

  /**
   * API 输出
   */
  api          : (data: any, error?: number | IError | IErrorInfo, opts?: string[]) => Response

  /**
   * 指定输出 404 Not Found
   */
  notfound     : () => void

  /**
   * 下载文件
   */
  downloadFile : (file: string, options?: DownloadOptions) => void

}

/**
 * Resuful API 返回结构
 */
export interface resufulInfo {

  /**
   * 返回数据
   */
  data         : any

  /**
   * 错误信息
   */
  Status       : IErrorInfo

}

/**
 * 下载文件选项
 */
export interface DownloadOptions {

  /**
   * 如果是网络图像之类的文件，是否直接下载
   */
  download    ?: boolean
  
}

/**
 * HTTP 请求头部选项
 */
export interface HeaderOptions {

  /**
   * Authorization Token
   */
  token       ?: string

  /**
   * Header Info
   */
  header      ?: object

  /**
   * 上传进度
   */
  upload      ?: (percentage: number) => void

  /**
   * 下载进度
   */
  download    ?: (percentage: number) => void

  /**
   * 
   */
  entry       ?: string

  /**
   * 取消连接
   */
  cancelToken ?: CancelToken
  
}