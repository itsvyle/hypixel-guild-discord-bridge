import type { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'

import type { CommandInterface } from '../common/command-interface'
import { Permission } from '../common/command-interface'
import type DiscordInstance from '../discord-instance'

export default {
  getCommandBuilder: () =>
    new SlashCommandBuilder()
      .setName('override')
      .setDescription('execute command to all clients in-game')
      .addStringOption((option) =>
        option.setName('command').setDescription('command to execute. e.g. "/guild party"').setRequired(true)
      ) as SlashCommandBuilder,
  allowInstance: true,
  permission: Permission.ADMIN,

  handler: async function (clientInstance: DiscordInstance, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    const command: string = interaction.options.getString('command', true)
    const instance: string | null = interaction.options.getString('instance')

    if (instance == undefined) {
      clientInstance.app.clusterHelper.sendCommandToAllMinecraft(command)
    } else {
      clientInstance.app.clusterHelper.sendCommandToMinecraft(instance, command)
    }

    await interaction.editReply(`Command executed: ${command}`)
  }
} satisfies CommandInterface