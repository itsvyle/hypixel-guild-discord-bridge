import type { Slayer as SlayerType } from 'hypixel-api-reborn'

import type { ChatCommandContext } from '../common/command-interface'
import { ChatCommandHandler } from '../common/command-interface'
import { getSelectedSkyblockProfileRaw, getUuidIfExists } from '../common/util'

const Slayers: Record<string, string[]> = {
  zombie: ['revenant', 'rev', 'zombie'],
  spider: ['tarantula', 'tara', 'spider', 'tar'],
  wolf: ['sven', 'wolf'],
  enderman: ['voidgloom', 'eman', 'enderman'],
  blaze: ['inferno', 'demonlord', 'blaze'],
  vampire: ['riftstalker', 'bloodfiend', 'vamp', 'vampire'],
  overview: ['all', 'summary']
}
const slayerExpTable = {
  1: 5,
  2: 15,
  3: 200,
  4: 1000,
  5: 5000,
  6: 20_000,
  7: 100_000,
  8: 400_000,
  9: 1_000_000
}
const vampExpTable = {
  1: 20,
  2: 75,
  3: 240,
  4: 840,
  5: 2400
}

const highestTierTable = {
  // 1 less due to index starting at 0
  zombie: 4,
  spider: 3,
  wolf: 3,
  enderman: 3,
  blaze: 3,
  vampire: 4
}

export default class Slayer extends ChatCommandHandler {
  constructor() {
    super({
      name: 'Slayers',
      triggers: ['slayer', 'sl', 'slyr'],
      description: "Returns a player's slayer level",
      example: `slayer eman %s`
    })
  }

  async handler(context: ChatCommandContext): Promise<string> {
    const givenUsername = context.args[0] ?? context.username
    const givenSlayer = context.args[1] ?? 'overview'

    const uuid = await getUuidIfExists(context.app.mojangApi, givenUsername)
    if (uuid == undefined) {
      return `${context.username}, Invalid username! (given: ${givenUsername})`
    }

    const profile = await getSelectedSkyblockProfileRaw(context.app.hypixelApi, uuid)
    const slayerBosses = profile.slayer.slayer_bosses

    let chosenSlayer: string | undefined
    for (const [key, names] of Object.entries(Slayers)) {
      if (names.includes(givenSlayer.toLowerCase())) {
        chosenSlayer = key
      }
    }

    for (const [name, slayer] of Object.entries(slayerBosses)) {
      if (name === chosenSlayer) {
        return (
          `${givenUsername}'s ${chosenSlayer} slayer: ` +
          `Level ${this.getSlayerLevel(slayer.xp, name)} (${slayer.xp.toLocaleString()}) ` +
          `Highest tier kills: ${this.getHighestTierKills(slayer, name).toLocaleString()}`
        )
      }
    }

    let output = '/'
    for (const [name, slayer] of Object.entries(slayerBosses)) {
      output += this.getSlayerLevel(slayer.xp, name) + '/'
    }
    return `${givenUsername}'s slayers: ${output}`
  }

  private getSlayerLevel(exp: number, slayer: string): number {
    let maxLevel: number
    let expTable: Record<number, number>

    if (slayer === 'vampire') {
      maxLevel = 5 // vampire slayer only goes to level 5
      expTable = vampExpTable
    } else {
      maxLevel = 9
      expTable = slayerExpTable
    }

    let level = 0
    for (let x = 1; x <= maxLevel && expTable[x] <= exp; x++) {
      level = x
    }
    return level
  }

  private getHighestTierKills(slayerData: SlayerType, slayerName: string): number {
    const highestTier = highestTierTable[slayerName as keyof typeof highestTierTable]
    const index = 'boss_kills_tier_' + highestTier
    return slayerData[index as keyof SlayerType] ?? 0
  }
}
