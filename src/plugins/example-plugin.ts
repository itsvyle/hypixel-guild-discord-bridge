import type { PluginInterface, PluginContext } from '../common/plugins.js'

/* NOTICE
THIS PLUGIN DOES NOTHING. IT'S PURPOSE IS TO PROVIDE AN EXAMPLE OF SYNTAX.
DELETING THIS FILE WILL HAVE NO ADVERSE AFFECTS
*/

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRun(context: PluginContext): void {
    // modify something e.g:
    // app.ClusterHelper.sendCommandToAllMinecraft("hello there!")
  }
} satisfies PluginInterface
