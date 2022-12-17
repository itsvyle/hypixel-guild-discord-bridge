import EventHandler from '../../../common/EventHandler'
import MinecraftInstance from "../MinecraftInstance"

export default class StateHandler extends EventHandler<MinecraftInstance> {

    constructor(clientInstance: MinecraftInstance) {
        super(clientInstance)
    }

    registerEvents() {
        this.clientInstance.client?.on('error', (err: any) => this.onError(err))
    }

    private onError(error: { code: string }) {
        this.clientInstance.logger.error('Minecraft Bot Error: ', error)
        if (error?.code === 'EAI_AGAIN') {
            this.clientInstance.logger.error('Minecraft Bot disconnected duo to internet problems. restarting client in 30 second...')
            setTimeout(() => this.clientInstance.connect(), 30000)
        }
    }
}