import {Client, WebhookClient} from "discord.js-light"

import Application from "../../Application"
import {ClientInstance, LOCATION, SCOPE} from "../../common/ClientInstance"
import {ChatEvent} from "../../common/ApplicationEvent"
import {cleanMessage, escapeDiscord} from "../../util/DiscordMessageUtil"

export default class WebhookInstance extends ClientInstance {
    private readonly discordBot: Client
    private readonly client: WebhookClient | undefined
    private readonly webhookReceiveId: string

    constructor(app: Application, instanceName: string, discordBot: Client, webhookSendUrl: string, webhookReceiveId: string) {
        super(app, instanceName, LOCATION.WEBHOOK)

        this.discordBot = discordBot
        if (webhookSendUrl) this.client = new WebhookClient({url: webhookSendUrl})
        this.webhookReceiveId = webhookReceiveId

        this.app.on("chat", async (event: ChatEvent) => {
            if (event.instanceName === this.instanceName) return
            if (event.scope !== SCOPE.PUBLIC) return

            // TODO: integrate instanceName into webhook messages
            let displayUsername = event.replyUsername ? `${event.username}▸${event.replyUsername}` : event.username

            this.client?.send({
                content: escapeDiscord(event.message),
                username: displayUsername,
                avatarURL: `https://mc-heads.net/avatar/${encodeURIComponent(event.username)}`
            })
        })
    }

    async connect() {
        if (this.webhookReceiveId) {
            this.discordBot.on('messageCreate', message => this.onChatMessage(message))
        }
    }

    private onChatMessage(event: any) {
        if (event?.webhookId !== this.webhookReceiveId) return

        let content = cleanMessage(event)
        if (content.length === 0) return

        if (this.app.punishedUsers.mutedTill(event.member.displayName)) {
            this.logger.debug(`${event.author.username} is muted. ignoring this webhook message.`)
            return
        }

        this.app.emit("chat", <ChatEvent>{
            instanceName: this.instanceName,
            location: LOCATION.WEBHOOK,
            scope: SCOPE.PUBLIC,
            channelId: undefined,
            username: event.author.username,
            replyUsername: undefined,//TODO: find way to get replyUsername for webhooks (if possible at all)
            message: content
        })
    }
}