import { ServerConfiguration } from 'kenote-config-helper'
import { loadData } from 'kenote-config-helper/dist/utils.server'

const config: ServerConfiguration = loadData('data/config') as ServerConfiguration

export default config
