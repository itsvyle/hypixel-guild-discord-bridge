// noinspection JSUnusedGlobalSymbols

import MinecraftInstance from "../MinecraftInstance"
import {LOCATION, SCOPE} from "../../../common/ClientInstance"
import {MinecraftChatMessage} from "../common/ChatInterface"
import {ClientEvent} from "../../../common/ApplicationEvent"

const COLOR = require('../../../../config/discord-config.json').events.color

export default <MinecraftChatMessage>{
    onChat: function (clientInstance: MinecraftInstance, message: string): void {
        let regex = /^We blocked your comment "[\W\w]+" as it is breaking our rules/g

        let match = regex.exec(message)
        if (match != null) {

            clientInstance.app.emit("event", <ClientEvent>{
                instanceName: clientInstance.instanceName,
                location: LOCATION.MINECRAFT,
                scope: SCOPE.PUBLIC,
                name: "block",
                username: undefined,
                severity: COLOR.INFO,
                message: message,
                removeLater: false
            })
        }
    }
}