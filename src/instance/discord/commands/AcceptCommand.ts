// noinspection JSUnusedGlobalSymbols

import {CommandInteraction, SlashCommandBuilder} from "discord.js"
import {DiscordCommandInterface, Permission} from "../common/DiscordCommandInterface"
import DiscordInstance from "../DiscordInstance"

export default <DiscordCommandInterface>{
    commandBuilder: new SlashCommandBuilder()
        .setName('accept')
        .setDescription('accept a player to the guild if they have a join request in-game')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username of the player')
                .setRequired(true)),
    allowInstance: true,
    permission: Permission.STAFF,

    handler: async function (clientInstance: DiscordInstance, interaction: CommandInteraction) {
        await interaction.deferReply()

        let username = interaction.options.get("username")
        let command = `/g accept ${username}`

        // @ts-ignore
        let instance = interaction.options.getString("instance")
        if (instance) {
            clientInstance.app.clusterHelper.sendCommandToMinecraft(instance, command)
        } else {
            clientInstance.app.clusterHelper.sendCommandToAllMinecraft(command)
        }

        await interaction.editReply(`Command sent to accept ${username}!`)
    }
}
