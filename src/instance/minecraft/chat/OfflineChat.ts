import { MinecraftChatContext, MinecraftChatMessage } from '../common/ChatInterface'
import { ColorScheme } from '../../discord/common/DiscordConfig'
import { EventType, InstanceType, ChannelType } from '../../../common/ApplicationEvent'

export default {
  onChat: function (context: MinecraftChatContext): void {
    const regex = /^Guild > (\w{3,32}) left./g

    const match = regex.exec(context.message)
    if (match != undefined) {
      const username = match[1]

      context.application.emit('event', {
        localEvent: true,
        instanceName: context.instanceName,
        instanceType: InstanceType.MINECRAFT,
        channelType: ChannelType.PUBLIC,
        name: EventType.OFFLINE,
        username,
        severity: ColorScheme.INFO,
        message: context.message,
        removeLater: true
      })
    }
  }
} satisfies MinecraftChatMessage
