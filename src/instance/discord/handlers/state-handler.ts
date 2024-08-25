// file: state-handler
// Defines the handler for handling events of the discord bot client or other related events
import assert from 'node:assert'

import EventHandler from '../../../common/event-handler.js'
import type DiscordInstance from '../discord-instance.js'

export default class StateHandler extends EventHandler<DiscordInstance> {
  registerEvents(): void {
    this.clientInstance.client.on('ready', () => {
      this.onReady()
    })
  }

  private onReady(): void {
    assert(this.clientInstance.client.user)
    this.clientInstance.logger.info('Discord client ready, logged in as ' + this.clientInstance.client.user.tag)
  }
}
