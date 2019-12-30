import { MountController } from 'kenote-express-helper'
import Store from './store'
import Logs from './logs'
import Passport from './passport'

export default MountController( Store, Logs, Passport )
