
import * as path from 'path'
import { oc } from 'ts-optchain'
import * as http from 'http'
import * as express from 'express'
import * as nunjucks from 'nunjucks'
import * as errorhandler from 'errorhandler'
import * as bodyParser from 'body-parser'
import * as methodOverride from 'method-override'
import * as compress from 'compression'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import * as redis from 'redis'
import * as cors from 'cors'
import logger from '@/utils/logger'
import config from '~/config'
import resuful from '~/middleware/restful'
import controller from '~/controller'
import api_v1 from '~/api/v1'

const { Host, Port, session_secret, redis: redisConfig, options } = config
const RedisStore: connectRedis.RedisStore = connectRedis(session)
const corsOptions: cors.CorsOptions = {
  origin: oc(options).origin('*'),
  optionsSuccessStatus: 200
}

async function start (): Promise<void> {
  let app: express.Application = express()

  // 设置模版
  app.set('view', path.resolve(process.cwd(), 'views'))
  app.set('view engine', 'njk')
  nunjucks.configure('views', { autoescape: true, express: app })

  // 设置 POST
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

  // 让服务器能转发 PUT、DELETE 请求
  app.use(methodOverride())

  // 压缩数据
  app.use(compress())

  // Cookie
  app.use(cookieParser(session_secret))

  if (redisConfig) {
    let sessionStore: session.Store
    try {
      sessionStore = new RedisStore(redisConfig || {})
    } catch (error) {
      let redisClient: redis.RedisClient = redis.createClient(redisConfig)
      sessionStore = new RedisStore({ client: redisClient })
    }

    // Session
    app.use(session({
      secret: session_secret || '',
      store: sessionStore,
      resave: true,
      saveUninitialized: true
    }))
  }

  // 自定义 Restful
  app.use(resuful)
  
  // Routing
  app.use('/', cors(corsOptions), controller)
  // api_v1
  app.use('/api/v1', cors(corsOptions), api_v1)

  // 404 Not Found.
  app.use('*', (req: express.Request, res: express.Response): void => {
    return res.status(404).render('error', { message: 'This page could not be found' })
  })

  // 500 Error
  if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler)
  }
  else {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      logger.error('server 500 error: ', err)
      return res.status(500).render('error', { message: 'This page could internal server error' })
    })
  }

  // Running ...
  http.createServer(app).listen(Port, Host, () => {
    logger.info(`Service running in %s environment, PORT: %d ...`, process.env.NODE_ENV || 'development', Port)
  })
}

start()
