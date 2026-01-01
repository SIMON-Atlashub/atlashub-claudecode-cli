# CLAUDE.md - @atlashub/claude-tools

## Repository

| Information | Valeur |
|-------------|--------|
| **Nom** | @atlashub/claude-tools |
| **Type** | Node.js/TypeScript CLI Tool |
| **Version** | 1.0.0 |
| **Description** | Claude Code automation toolkit - GitFlow, APEX, EF Core migrations, prompts and more |
| **Remote** | https://github.com/SIMON-Atlashub/atlashub-claudecode-cli.git |
| **Branche principale** | main |
| **Branche de développement** | develop |

### Structure du projet

Ce projet est un outil CLI (Command Line Interface) développé en TypeScript qui fournit des commandes et workflows pour automatiser diverses tâches dans Claude Code :

- **GitFlow** : Gestion du workflow GitFlow avec versioning SemVer
- **APEX** : Méthodologie Analyze-Plan-Execute-eXamine pour l'implémentation systématique
- **EF Core Migrations** : Outils pour gérer les migrations Entity Framework Core dans les projets .NET
- **Prompts** : Création et optimisation de prompts pour agents et commandes

### Workflow GitFlow

Ce repository utilise GitFlow avec la configuration suivante :

- **Strategy de versioning** : SemVer (Semantic Versioning)
- **Source de version** : package.json
- **Préfixe des tags** : `v`
- **Auto-increment** :
  - feature → minor (1.0.0 → 1.1.0)
  - hotfix → patch (1.0.0 → 1.0.1)
  - release → manual
- **Merge strategy** : `--no-ff` (preserve history)
- **Branches protégées** : main, develop

### Configuration GitFlow

La configuration complète se trouve dans [.claude/gitflow/config.json](.claude/gitflow/config.json)

### Note sur EF Core

Bien que ce projet contienne des outils pour gérer EF Core dans d'autres projets .NET, il n'utilise pas lui-même Entity Framework Core car il s'agit d'un projet Node.js/TypeScript.

---

*Initialisé le 2025-12-30*
