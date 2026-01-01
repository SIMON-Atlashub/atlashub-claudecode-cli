# Analyse Fonctionnelle : Web Testing & Clickable References

> Document généré le 2025-12-30
> Statut : **VALIDÉ** - Prêt pour implémentation

---

## Résumé exécutif

| Attribut | Valeur |
|----------|--------|
| **Feature** | Web Testing Agent + Clickable References |
| **Complexité** | MOYENNE |
| **Données** | 0 entités (pas de DB) |
| **Fichiers** | ~5 templates à modifier + 1 agent à créer |
| **Impact** | Workflow EPCT phase T |

---

## Feature 1 : Références cliquables & commandes copiables

### Besoin

Dans **tous** les outputs générés par les commandes Claude Code :
- Les fichiers doivent être cliquables : `[filename.ts](path/filename.ts#L42)`
- Les commandes doivent être dans des blocs de code copiables

### Spécifications

#### Format fichiers cliquables

```markdown
<!-- CORRECT -->
[config.json](.claude/gitflow/config.json)
[config.json:26](.claude/gitflow/config.json#L26)
[config.json:26-35](.claude/gitflow/config.json#L26-L35)

<!-- INCORRECT -->
`.claude/gitflow/config.json`
`config.json`
```

#### Format commandes copiables

```markdown
<!-- CORRECT - Commandes Claude Code -->
```
/gitflow:1-init --exec
```

<!-- CORRECT - Commandes bash -->
```bash
npm run build
```

<!-- INCORRECT -->
Exécutez `/gitflow:1-init --exec`
```

### Fichiers à modifier

| Fichier | Action |
|---------|--------|
| [templates/commands/gitflow/](templates/commands/gitflow/) | Mettre à jour tous les templates |
| [templates/commands/apex/](templates/commands/apex/) | Mettre à jour tous les templates |
| [templates/commands/ba/](templates/commands/ba/) | Mettre à jour tous les templates |
| [templates/commands/epct/](templates/commands/epct/) | Mettre à jour tous les templates |

---

## Feature 2 : Agent de test web HYBRIDE pour EPCT

### Besoin

Créer un système de test web **hybride** combinant :
1. **Claude Code (Terminal)** : `WebFetch` + `WebSearch` pour tests rapides
2. **Extension Chrome Claude** : Tests E2E interactifs avec le navigateur

### Architecture hybride

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE TEST WEB HYBRIDE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐ │
│  │   NIVEAU 1 : RAPIDE     │    │   NIVEAU 2 : E2E NAVIGATEUR     │ │
│  │   (Claude Code Terminal)│    │   (claude --chrome)             │ │
│  ├─────────────────────────┤    ├─────────────────────────────────┤ │
│  │                         │    │                                 │ │
│  │  • WebFetch → HTTP 200  │    │  • Navigation réelle            │ │
│  │  • WebFetch → Contenu   │    │  • Clics sur boutons            │ │
│  │  • WebSearch → Google   │    │  • Remplir formulaires          │ │
│  │                         │    │  • Console logs, DOM            │ │
│  │  Temps: ~5 secondes     │    │  • Screenshots, GIFs            │ │
│  │                         │    │                                 │ │
│  │  Commande:              │    │  Temps: ~30-60 secondes         │ │
│  │  /test-web --quick      │    │                                 │ │
│  │                         │    │  Activation:                    │ │
│  └─────────────────────────┘    │  claude --chrome                │ │
│                                 │  puis /test-web --chrome        │ │
│                                 └─────────────────────────────────┘ │
│                                                                     │
│  WORKFLOW COMBINÉ :                                                 │
│  ─────────────────                                                  │
│  1. /test-web --quick  → Tests rapides (toujours)                  │
│  2. Si PASS → /test-web --e2e → Tests E2E (optionnel)              │
│  3. Rapport consolidé avec les deux niveaux                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Niveau 1 : Tests rapides (Claude Code Terminal)

| Outil | Capacité | Exemple |
|-------|----------|---------|
| `WebFetch` | Récupérer contenu URL | Vérifier README sur GitHub |
| `WebSearch` | Recherche Google | Vérifier indexation npm |

### Niveau 2 : Tests E2E (Claude for Chrome - `claude --chrome`)

**Prérequis** : Extension "Claude for Chrome" installée + Plan Max/Pro/Team/Enterprise

**Activation** : `claude --chrome` lance Claude Code avec accès navigateur

| Capacité | Description |
|----------|-------------|
| Navigation | Ouvrir URLs, suivre liens |
| Interaction | Cliquer boutons, remplir forms |
| Console | Lire logs, erreurs, requêtes réseau |
| DOM | Inspecter état de la page |
| Screenshots | Capturer visuels, enregistrer GIFs |
| Sessions | Accès aux sites déjà connectés (Gmail, Notion, etc.) |

**Sources** :
- [Anthropic - Piloting Claude for Chrome](https://www.anthropic.com/news/claude-for-chrome)
- [Claude Help Center - Getting Started](https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome)

### Cas d'usage

#### 1. Vérifier GitHub repo

```typescript
// Configuration
{
  url: "https://github.com/SIMON-Atlashub/atlashub-claudecode-cli",
  expectations: {
    status: 200,
    contains: ["@atlashub/claude-tools", "README"]
  }
}
```

#### 2. Vérifier package npm

```typescript
// Configuration
{
  url: "https://www.npmjs.com/package/@atlashub/claude-tools",
  expectations: {
    status: 200,
    contains: ["1.0.0", "Claude Code automation"]
  }
}
```

#### 3. Vérifier indexation Google

```typescript
// Configuration
{
  searchTerm: "@atlashub/claude-tools npm",
  expectResults: true
}
```

### Intégration EPCT

```
EPCT Workflow
─────────────────────────────────────────
E - Explore    │ Analyse du code existant
P - Plan       │ Planification des changements
C - Code       │ Implémentation
T - Test       │ ← /test-web s'exécute ICI
               │   • Tests unitaires (existants)
               │   • Tests web (NOUVEAU)
               │   • Validation accessibilité
─────────────────────────────────────────
```

### Fichier de configuration suggéré

Créer [.claude/test-web/config.json](.claude/test-web/config.json) :

```json
{
  "targets": [
    {
      "name": "GitHub Repository",
      "url": "https://github.com/SIMON-Atlashub/atlashub-claudecode-cli",
      "type": "fetch",
      "expects": {
        "status": 200,
        "contains": ["README", "package.json"]
      }
    },
    {
      "name": "npm Package",
      "url": "https://www.npmjs.com/package/@atlashub/claude-tools",
      "type": "fetch",
      "expects": {
        "status": 200,
        "contains": ["claude-tools"]
      }
    },
    {
      "name": "Google Indexation",
      "query": "@atlashub/claude-tools",
      "type": "search",
      "expects": {
        "hasResults": true
      }
    }
  ],
  "runOn": ["epct:test", "manual"],
  "timeout": 30000,
  "retries": 2
}
```

### Template de la commande

Créer [templates/commands/utils/test-web.md](templates/commands/utils/test-web.md) :

```markdown
# /test-web - Agent de test des fonctionnalités web

Teste l'accessibilité et le contenu des ressources web du projet.

## Configuration

Lit la configuration depuis [.claude/test-web/config.json](.claude/test-web/config.json)

## Exécution

Pour chaque target configuré :
1. **type: fetch** → Utilise `WebFetch` pour récupérer l'URL
2. **type: search** → Utilise `WebSearch` pour chercher le terme

## Rapport

Génère un rapport dans `.claude/test-web/reports/YYYY-MM-DD_HHmmss.md`

## Commandes

```
/test-web          # Exécute tous les tests configurés
/test-web --quick  # Teste uniquement l'accessibilité (HTTP 200)
/test-web --report # Génère un rapport détaillé
```
```

---

## Plan d'implémentation

### Étape 1 : Créer l'agent test-web

1. Créer [templates/commands/utils/test-web.md](templates/commands/utils/test-web.md)
2. Créer la structure [.claude/test-web/](templates/commands/utils/test-web.md)
3. Définir le config.json avec les targets par défaut

### Étape 2 : Mettre à jour les templates existants

1. Auditer tous les templates dans [templates/commands/](templates/commands/)
2. Remplacer les références de fichiers par des liens markdown
3. Entourer les commandes de blocs de code

### Étape 3 : Intégrer dans EPCT

1. Modifier [templates/commands/epct/](templates/commands/epct/) pour inclure test-web dans phase T
2. Ajouter hook optionnel pour exécution automatique

---

## Validation

- [ ] Agent test-web créé et fonctionnel
- [ ] Tous les templates utilisent le format cliquable
- [ ] Intégration EPCT validée
- [ ] Documentation mise à jour

---

## Prochain

```
/ba:3-validate
```

Puis implémentation avec :

```
/epct
```
