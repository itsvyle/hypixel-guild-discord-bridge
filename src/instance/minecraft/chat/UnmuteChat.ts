import MinecraftInstance from "../MinecraftInstance"
import {ClientEvent} from "../../../common/ApplicationEvent"
import {MinecraftChatMessage} from "../common/ChatInterface"
import {LOCATION} from "../../../common/ClientInstance"

import {SCOPE} from "../../../common/ClientInstance"

const COLOR = require('../../../../config/discord-config.json').events.color

export default <MinecraftChatMessage>{
    onChat: function (clientInstance: MinecraftInstance, message: string): void {
        let regex = /^(?:\[[A-Z+]{1,10}\] ){0,3}\w{3,32} has unmuted (?:\[[A-Z+]{1,10}\] ){0,3}(\w{3,32})/g

        let match = regex.exec(message)
        if (match != null) {
            let username = match[1]

            clientInstance.app.punishedUsers.unmute(username)

            clientInstance.app.emit("event", <ClientEvent>{
                instanceName: clientInstance.instanceName,
                location: LOCATION.MINECRAFT,
                scope: SCOPE.OFFICER,
                name: "unmute",
                username: username,
                severity: COLOR.INFO,
                message: message,
                removeLater: false
            })
        }
    }
}