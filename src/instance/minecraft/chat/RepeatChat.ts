import { LOCATION, SCOPE } from '../../../common/ClientInstance'
import MinecraftInstance from '../MinecraftInstance'
import { MinecraftChatMessage } from '../common/ChatInterface'
import { ColorScheme } from '../../discord/common/DiscordConfig'
import { CommandsManager } from '../CommandsManager'
import { EventType } from '../../../common/ApplicationEvent'

const MESSAGES = [
  "Can't repeat the same message...",
  'I wish I had a way to repeat the same messages over and over again :(',
  'Hypixel blocked this message for repeating... Again! D:',
  "Hold your horses, can't say same message twice!",
  "Twinkle twinkle little star, can't repeat message with big R",
  'No, no, no, NO. no message repetition D:',
  "RIP, can't say same thing twice",
  "Wonder where the message has gone? Yeah... Can't repeat it :P",
  'Message cannot be repeated!',
  'The verdict has been given and will not be repeated!',
  'Not saying it twice, bro!',
  'Oh no, I tried to send same message but Hypixel is annoying and blocked me!',
  "Oni-chan, you are big meanie. Don't block my message even if it's repeated!"
]

let lastWarning: number = 0

export default {
  onChat: function (clientInstance: MinecraftInstance, commandsManager: CommandsManager, message: string): void {
    const regex = /^You cannot say the same message twice!/g

    const match = regex.exec(message)
    if (match != null) {
      const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

      clientInstance.app.emit('event', {
        localEvent: true,
        instanceName: clientInstance.instanceName,
        location: LOCATION.MINECRAFT,
        scope: SCOPE.PUBLIC,
        name: EventType.REPEAT,
        username: undefined,
        severity: ColorScheme.INFO,
        message: randomMessage,
        removeLater: false
      })

      if (lastWarning + 5000 < new Date().getTime()) {
        void clientInstance.send(`/gc @${randomMessage}`)
        lastWarning = new Date().getTime()
      }
    }
  }
} satisfies MinecraftChatMessage
