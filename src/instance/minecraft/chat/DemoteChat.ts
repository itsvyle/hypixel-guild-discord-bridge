import MinecraftInstance from "../MinecraftInstance"
import {MinecraftChatMessage} from "../common/ChatInterface"
import {LOCATION} from "../../../common/ClientInstance"

const {SCOPE} = require("../../../common/ClientInstance")
const COLOR = require('../../../../config/discord-config.json').events.color

export default <MinecraftChatMessage>{
    onChat: function (clientInstance: MinecraftInstance, message: string): void {
        let regex = /^(?:\[[A-Z+]{1,10}\] )*(\w{3,32}) was demoted from /g

        let match = regex.exec(message)
        if (match != null) {
            let username = match[1]

            clientInstance.app.emit("event", {
                instanceName: clientInstance.instanceName,
                location: LOCATION.MINECRAFT,
                scope: SCOPE.PUBLIC,
                name: "demote",
                username: username,
                severity: COLOR.BAD,
                message: message,
                removeLater: false
            })
        }
    }
}