import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Maps } from 'kenote-config-helper'
import { HeaderOptions } from '../types/restful'
// import * as FileSaver from 'file-saver'
import * as URL from 'url'
import { CancelToken } from 'axios';

/**
 * HTTP 请求类
 */
class HTTPClient {

  /**
   * GET 请求
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  public get = async (url: string, data: Maps<any> | null, options?: HeaderOptions) => await this.sendData('get', url, data, options)

  /**
   * POST 请求
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  public post = async (url: string, data: Maps<any> | null, options?: HeaderOptions) => await this.sendData('post', url, data, options)

  /**
   * PUT 请求
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  public put = async (url: string, data: Maps<any> | null, options?: HeaderOptions) => await this.sendData('put', url, data, options)

  /**
   * DELETE 请求
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  public delete = async (url: string, data: Maps<any> | null, options?: HeaderOptions) => await this.sendData('delete', url, data, options)

  /**
   * 上传文件
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  public upload = async (url: string, data: Maps<any> | null, options?: HeaderOptions) => await this.post(url, data, { upload: (percentage: number) => {}, ...options })

  /**
   * 下载文件
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  // public async download (url: string, data: Maps<any> | null, options?: HeaderOptions): Promise<any> {
  //   let fileBlob: Blob = await this.get(url, data, { download: (percentage: number) => {}, ...options })
  //   let filename: string = URL.parse(url).pathname || ''
  //   let fileName: string = filename.replace(/.+\/(.+)$/, '$1')
  //   FileSaver.saveAs(fileBlob, fileName)
  // }

  /**
   * 请求数据
   * @param method 'get' | 'post' | 'put' | 'delete'
   * @param url string
   * @param data Maps<any> | null
   * @param options HeaderOptions
   */
  private async sendData (method: 'get' | 'post' | 'put' | 'delete', url: string, data: Maps<any> | null, options?: HeaderOptions): Promise<any> {
    let config: AxiosRequestConfig = {
      method,
      url,
      headers: setHeaders({ ...options }),
      [method === 'get' ? 'params' : 'data']: data
    }
    if (options && options.upload) {
      config.method = 'post'
      config.headers['Content-Type'] = 'multipart/form-data'
      config.transformRequest = [
        function (data: any, headers: any): any {
          return data
        }
      ]
      config.onUploadProgress = function (progressEvent: any): void {
        let percentage: number = Math.round((progressEvent.loaded * 100) / progressEvent.total) || 0
        if (percentage <= 100) {
          options.upload && options.upload(percentage)
        }
      }
    }
    if (options && options.download) {
      config.method = 'get'
      config.responseType = 'blob'
      config.onDownloadProgress = function (progressEvent: any): void {
        let percentage: number = Math.round((progressEvent.loaded * 100) / progressEvent.total) || 0
        if (percentage <= 100) {
          options.download && options.download(percentage)
        }
      }
    }
    if (options && options.cancelToken) {

      // config.cancelToken = new axios.CancelToken(function (c) {

      // })
    }
    return getResponseData(config)
  }
}

export default new HTTPClient()

/**
 * 获取返回数据
 * @param options AxiosRequestConfig
 */
async function getResponseData (options: AxiosRequestConfig): Promise<any> {
  let response: AxiosResponse<any> = await axios(options)
  if (response.status >= 200 && response.status < 300) {
    return response.data || {}
  }
  throw new Error(response.statusText)
}

/**
 * 设置头部信息
 * @param options HeaderOptions
 */
function setHeaders (options: HeaderOptions): Maps<any> {
  let headers: Maps<any> = { ...options.header }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }
  return headers
}
