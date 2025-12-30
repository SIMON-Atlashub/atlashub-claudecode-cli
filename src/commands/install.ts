import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../lib/logger.js';
import { checkLicense } from '../lib/license.js';
import { installCommands } from '../lib/installer.js';
import { detectProject } from '../lib/detector.js';

export const installCommand = new Command('install')
  .alias('i')
  .description('Install GitFlow commands, agents, and hooks')
  .option('-f, --force', 'Overwrite existing files')
  .option('-g, --global', 'Install to user directory ~/.claude (default)', true)
  .option('-l, --local', 'Install to project directory ./.claude')
  .option('--commands-only', 'Install only commands')
  .option('--agents-only', 'Install only agents')
  .option('--hooks-only', 'Install only hooks')
  .option('--no-config', 'Skip config file creation')
  .option('--skip-license', 'Skip license check (for testing)')
  .action(async (options) => {
    logger.header('Installing Claude GitFlow');

    // Determine install location
    const isGlobal = !options.local;

    // Check license (unless skipped)
    if (!options.skipLicense) {
      const license = await checkLicense();

      if (!license.valid) {
        logger.box(
          [
            'No valid license found.',
            '',
            'To activate your license:',
            `  ${chalk.cyan('claude-gitflow activate <YOUR-KEY>')}`,
            '',
            'To purchase a license:',
            `  ${chalk.cyan('https://atlashub.ch/claude-gitflow')}`,
            '',
            chalk.dim('Use --skip-license to test without a license'),
          ],
          'warning'
        );
        return;
      }

      logger.success(`License valid (${license.plan})`);
    } else {
      logger.warning('License check skipped');
    }

    // Detect project (for info only)
    const spinner = logger.spinner('Analyzing environment...');
    const project = await detectProject();
    spinner.stop();

    console.log();
    logger.info(`Install location: ${isGlobal ? chalk.cyan('~/.claude (global)') : chalk.yellow('./.claude (local)')}`);
    logger.info(`Git repository: ${project.isGitRepo ? chalk.green('Yes') : chalk.gray('No')}`);
    logger.info(`.NET project: ${project.hasDotNet ? chalk.green('Yes') : chalk.gray('No')}`);
    logger.info(`EF Core: ${project.hasEfCore ? chalk.green('Yes') : chalk.gray('No')}`);
    console.log();

    // Determine components to install
    const components: ('commands' | 'agents' | 'hooks' | 'all')[] = [];
    if (options.commandsOnly) components.push('commands');
    else if (options.agentsOnly) components.push('agents');
    else if (options.hooksOnly) components.push('hooks');
    else components.push('all');

    // Install
    try {
      const result = await installCommands({
        force: options.force,
        global: isGlobal,
        skipConfig: !options.config,
        components,
      });

      console.log();

      if (result.errors.length > 0) {
        logger.warning(`Completed with ${result.errors.length} error(s)`);
      }

      const summary = [
        chalk.green.bold('Installation complete!'),
        '',
        `Files installed: ${chalk.cyan(result.installed)}`,
        `Files skipped: ${chalk.yellow(result.skipped)} (use --force to overwrite)`,
        '',
        'Available commands in Claude Code:',
        '',
        chalk.bold('GitFlow:'),
        `  ${chalk.cyan('/gitflow')}        - Full GitFlow workflow`,
        `  ${chalk.cyan('/gitflow:1-init')} - Initialize GitFlow`,
        `  ${chalk.cyan('/gitflow:2-status')} - Show status`,
        `  ${chalk.cyan('/gitflow:3-commit')} - Smart commit`,
        `  ${chalk.cyan('/gitflow:4-plan')} - Create plan`,
        `  ${chalk.cyan('/gitflow:5-exec')} - Execute plan`,
        `  ${chalk.cyan('/gitflow:6-abort')} - Rollback`,
        '',
        chalk.bold('Development:'),
        `  ${chalk.cyan('/apex')}           - APEX methodology`,
        `  ${chalk.cyan('/epct')}           - Explore-Plan-Code-Test`,
        `  ${chalk.cyan('/debug')}          - Systematic debugging`,
        '',
        chalk.bold('EF Core:'),
        `  ${chalk.cyan('/db-migration')}   - Migration management`,
        `  ${chalk.cyan('/ef-migration-sync')} - Sync migrations`,
      ];

      logger.box(summary, 'success');
    } catch (error) {
      logger.error(error instanceof Error ? error.message : 'Installation failed');
      process.exit(1);
    }
  });
