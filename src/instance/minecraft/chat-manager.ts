// file: chat-manager.ts
// Handles minecraft chat operations: registering modules, and catching messages sent by players
import assert from 'node:assert'

import getMinecraftData from 'minecraft-data'
import type { ChatMessage } from 'prismarine-chat'

import { InstanceType } from '../../common/application-event.js'
import EventHandler from '../../common/event-handler.js'

import BlockChat from './chat/block.js'
import DemoteChat from './chat/demote.js'
import JoinChat from './chat/join.js'
import KickChat from './chat/kick.js'
import LeaveChat from './chat/leave.js'
import MuteChat from './chat/mute.js'
import MutedChat from './chat/muted.js'
import OfficerChat from './chat/officer.js'
import OfflineChat from './chat/offline.js'
import OnlineChat from './chat/online.js'
import PrivateChat from './chat/private.js'
import PromoteChat from './chat/promote.js'
import PublicChat from './chat/public.js'
import QuestChat from './chat/quest.js'
import RepeatChat from './chat/repeat.js'
import RequestChat from './chat/request.js'
import UnmuteChat from './chat/unmute.js'
import type { MinecraftChatMessage } from './common/chat-interface.js'
import type MinecraftInstance from './minecraft-instance.js'

export default class ChatManager extends EventHandler<MinecraftInstance> {
  private readonly chatModules: MinecraftChatMessage[]

  constructor(clientInstance: MinecraftInstance) {
    super(clientInstance)
    this.chatModules = [
      BlockChat,
      DemoteChat,
      JoinChat,
      KickChat,
      LeaveChat,
      MuteChat,
      MutedChat,
      OfficerChat,
      OfflineChat,
      OnlineChat,
      PrivateChat,
      PromoteChat,
      QuestChat,
      PublicChat,
      RepeatChat,
      RequestChat,
      UnmuteChat
    ]
  }

  registerEvents(): void {
    assert(this.clientInstance.client)
    assert(this.clientInstance.registry)

    const prismChat = this.clientInstance.prismChat
    const minecraftData = getMinecraftData(this.clientInstance.client.version)

    this.clientInstance.client.on('systemChat', (data) => {
      const chatMessage = prismChat.fromNotch(data.formattedMessage)
      this.onMessage(chatMessage.toString())
    })

    this.clientInstance.client.on('playerChat', (data: object) => {
      const message = (data as { formattedMessage?: string }).formattedMessage
      let resultMessage: ChatMessage & Partial<{ unsigned: ChatMessage }>

      if (minecraftData.supportFeature('clientsideChatFormatting')) {
        const verifiedPacket = data as {
          senderName?: string
          targetName?: string
          plainMessage: string
          unsignedContent?: string
          type: number
        }
        const parameters: { content: object; sender?: object; target?: object } = {
          content: message ? (JSON.parse(message) as object) : { text: verifiedPacket.plainMessage }
        }

        if (verifiedPacket.senderName) {
          Object.assign(parameters, { sender: JSON.parse(verifiedPacket.senderName) as object })
        }
        if (verifiedPacket.targetName) {
          Object.assign(parameters, { target: JSON.parse(verifiedPacket.targetName) as object })
        }
        resultMessage = prismChat.fromNetwork(verifiedPacket.type, parameters as Record<string, object>)

        if (verifiedPacket.unsignedContent) {
          resultMessage.unsigned = prismChat.fromNetwork(verifiedPacket.type, {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sender: parameters.sender!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            target: parameters.target!,
            content: JSON.parse(verifiedPacket.unsignedContent) as object
          })
        }
      } else {
        assert(message) // old packet means message exists
        resultMessage = prismChat.fromNotch(message)
      }

      this.onMessage(resultMessage.toString())
    })
  }

  private onMessage(message: string): void {
    for (const module of this.chatModules) {
      void module.onChat({
        application: this.clientInstance.app,
        clientInstance: this.clientInstance,
        instanceName: this.clientInstance.instanceName,
        message
      })
    }

    this.clientInstance.app.emit('minecraftChat', {
      localEvent: true,
      instanceName: this.clientInstance.instanceName,
      instanceType: InstanceType.MINECRAFT,
      message
    })
  }
}
