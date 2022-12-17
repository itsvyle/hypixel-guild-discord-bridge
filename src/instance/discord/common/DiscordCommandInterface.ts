import {CommandInteraction, SlashCommandBuilder} from "discord.js"
import DiscordInstance from "../DiscordInstance"

export enum Permission {
    ANYONE,
    STAFF,
    ADMIN
}

export interface DiscordCommandInterface {
    commandBuilder: SlashCommandBuilder
    allowInstance: boolean
    permission: Permission
    handler: (discordInstance: DiscordInstance, interaction: CommandInteraction) => Promise<void>
}
