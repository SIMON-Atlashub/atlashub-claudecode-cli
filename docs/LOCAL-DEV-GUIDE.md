# Guide d'installation locale - VS Code

Installation et test du CLI claude-gitflow en local dans votre projet.

## Prerequis

- Node.js 18+
- VS Code avec extension Claude Code
- Git

## Installation rapide

### 1. Cloner et builder

```bash
# Cloner le repo
git clone https://github.com/atlashub/claude-gitflow.git
cd claude-gitflow

# Installer les dependances
npm install

# Builder
npm run build
```

### 2. Lier le CLI globalement (dev)

```bash
# Cree un lien symbolique global
npm link

# Verifier
claude-gitflow --version
```

### 3. Installer les commandes localement

```bash
# Dans votre projet cible
cd /chemin/vers/mon-projet

# Installer en local (./.claude)
claude-gitflow install --local --skip-license
```

## Structure apres installation

```
mon-projet/
├── .claude/
│   ├── commands/
│   │   ├── gitflow.md
│   │   ├── gitflow/
│   │   │   ├── 1-init.md
│   │   │   ├── 2-status.md
│   │   │   └── ...
│   │   ├── apex.md
│   │   └── ...
│   ├── agents/
│   └── hooks/
└── ...
```

## Workflow de developpement

### Modifier une commande

1. Editer dans `templates/commands/`
2. Rebuild: `npm run build`
3. Reinstaller: `claude-gitflow install --local --force --skip-license`
4. Tester dans Claude Code: `/gitflow:1-init`

### Script de dev rapide

Creer `dev.ps1` (PowerShell):

```powershell
# dev.ps1 - Rebuild et reinstall
param(
    [string]$target = "."
)

Write-Host "Building..." -ForegroundColor Cyan
npm run build

Write-Host "Installing to $target..." -ForegroundColor Cyan
Push-Location $target
claude-gitflow install --local --force --skip-license
Pop-Location

Write-Host "Done!" -ForegroundColor Green
```

Usage:
```powershell
.\dev.ps1 -target "C:\Projects\mon-projet"
```

### Script bash (Git Bash/Linux/Mac)

```bash
#!/bin/bash
# dev.sh - Rebuild et reinstall

TARGET=${1:-.}

echo "Building..."
npm run build

echo "Installing to $TARGET..."
pushd "$TARGET" > /dev/null
claude-gitflow install --local --force --skip-license
popd > /dev/null

echo "Done!"
```

## VS Code Tasks

Ajouter dans `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build CLI",
      "type": "npm",
      "script": "build",
      "problemMatcher": []
    },
    {
      "label": "Install Local",
      "type": "shell",
      "command": "node dist/index.js install --local --force --skip-license",
      "problemMatcher": []
    },
    {
      "label": "Build & Install",
      "dependsOn": ["Build CLI", "Install Local"],
      "dependsOrder": "sequence",
      "problemMatcher": []
    },
    {
      "label": "Status",
      "type": "shell",
      "command": "node dist/index.js status --local",
      "problemMatcher": []
    }
  ]
}
```

Raccourcis:
- `Ctrl+Shift+B` -> Build CLI
- `Ctrl+Shift+P` -> Tasks: Run Task -> Build & Install

## VS Code Launch Config

Ajouter dans `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI - Install",
      "program": "${workspaceFolder}/dist/index.js",
      "args": ["install", "--local", "--skip-license"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI - Status",
      "program": "${workspaceFolder}/dist/index.js",
      "args": ["status", "--local"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI - Uninstall",
      "program": "${workspaceFolder}/dist/index.js",
      "args": ["uninstall", "--local", "--yes"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Tester les commandes Claude Code

### Dans le terminal VS Code

```bash
# Verifier l'installation
claude-gitflow status --local

# Lister les commandes installees
claude-gitflow status --local --verbose
```

### Dans Claude Code

1. Ouvrir Claude Code (`Ctrl+Shift+P` -> "Claude Code")
2. Taper une commande:
   - `/gitflow` - Workflow complet
   - `/gitflow:1-init` - Initialiser
   - `/apex` - Methodologie APEX

## Troubleshooting

### Commandes non reconnues dans Claude Code

```bash
# Verifier que .claude/commands existe
ls -la .claude/commands/

# Reinstaller
claude-gitflow install --local --force --skip-license
```

### Erreur "Cannot find module"

```bash
# Rebuild complet
npm run build

# Ou clean + build
rm -rf dist/
npm run build
```

### Permissions Windows

```powershell
# Executer en admin si erreur permissions
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### npm link ne fonctionne pas

```bash
# Alternative: executer directement
node dist/index.js install --local --skip-license
```

## Workflow recommande

1. **Developper** - Editer `templates/commands/*.md`
2. **Builder** - `npm run build`
3. **Installer** - `claude-gitflow install --local --force --skip-license`
4. **Tester** - Dans Claude Code: `/gitflow:1-init`
5. **Iterer** - Retour etape 1

## Commandes utiles

| Action | Commande |
|--------|----------|
| Build | `npm run build` |
| Install local | `claude-gitflow install --local --skip-license` |
| Reinstall | `claude-gitflow install --local --force --skip-license` |
| Status | `claude-gitflow status --local` |
| Uninstall | `claude-gitflow uninstall --local --yes` |
| Watch mode | `npm run dev` (si configure) |

## Ajouter watch mode

Dans `package.json`:

```json
{
  "scripts": {
    "dev": "tsup --watch",
    "dev:install": "nodemon --watch dist --exec \"node dist/index.js install --local --force --skip-license\""
  }
}
```

Installer nodemon:
```bash
npm install -D nodemon
```

Puis lancer:
```bash
# Terminal 1: Watch build
npm run dev

# Terminal 2: Watch install (dans le projet cible)
cd /chemin/projet && npm run dev:install
```
