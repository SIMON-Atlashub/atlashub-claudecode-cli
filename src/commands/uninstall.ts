import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger } from '../lib/logger.js';
import { uninstallCommands } from '../lib/installer.js';

export const uninstallCommand = new Command('uninstall')
  .alias('u')
  .description('Remove GitFlow commands, agents, and hooks')
  .option('-g, --global', 'Uninstall from user directory ~/.claude (default)', true)
  .option('-l, --local', 'Uninstall from project directory ./.claude')
  .option('--commands-only', 'Remove only commands')
  .option('--agents-only', 'Remove only agents')
  .option('--hooks-only', 'Remove only hooks')
  .option('--keep-config', 'Keep configuration file')
  .option('-y, --yes', 'Skip confirmation')
  .action(async (options) => {
    logger.header('Uninstalling Claude GitFlow');

    const isGlobal = !options.local;
    const location = isGlobal ? '~/.claude' : './.claude';

    logger.info(`Location: ${chalk.cyan(location)}`);
    console.log();

    // Confirm
    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to uninstall from ${location}?`,
          default: false,
        },
      ]);

      if (!confirm) {
        logger.info('Cancelled.');
        return;
      }
    }

    // Determine components to remove
    const components: ('commands' | 'agents' | 'hooks' | 'all')[] = [];
    if (options.commandsOnly) components.push('commands');
    else if (options.agentsOnly) components.push('agents');
    else if (options.hooksOnly) components.push('hooks');
    else components.push('all');

    try {
      const result = await uninstallCommands({
        global: isGlobal,
        keepConfig: options.keepConfig,
        components,
      });

      console.log();

      if (result.errors.length > 0) {
        logger.warning(`Completed with ${result.errors.length} error(s)`);
      } else {
        logger.success(`Uninstalled ${result.removed} item(s) successfully.`);
      }
    } catch (error) {
      logger.error(error instanceof Error ? error.message : 'Uninstallation failed');
      process.exit(1);
    }
  });
