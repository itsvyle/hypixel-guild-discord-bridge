import { MinecraftChatContext, MinecraftChatMessage } from '../common/ChatInterface'
import { sufficeToTime } from '../../../util/SharedUtil'
import { ColorScheme } from '../../discord/common/DiscordConfig'
import { EventType, InstanceType, ChannelType } from '../../../common/ApplicationEvent'

export default {
  onChat: function (context: MinecraftChatContext): void {
    const regex =
      /^(?:\[[+A-Z]{1,10}] ){0,3}(\w{3,32}) has muted (?:\[[+A-Z]{1,10}] ){0,3}(the guild chat|\w{3,32}) for (\d)([dhms])/g

    const match = regex.exec(context.message)
    if (match != undefined) {
      const responsible = match[1]
      const target = match[2]
      const muteTime = Number(match[3])
      const muteSuffice = match[4]

      context.application.punishedUsers.mute(target, muteTime * sufficeToTime(muteSuffice))

      context.application.emit('event', {
        localEvent: true,
        instanceName: context.instanceName,
        instanceType: InstanceType.MINECRAFT,
        channelType: ChannelType.OFFICER,
        name: EventType.MUTE,
        username: responsible,
        severity: ColorScheme.BAD,
        message: context.message,
        removeLater: false
      })
    }
  }
} satisfies MinecraftChatMessage
