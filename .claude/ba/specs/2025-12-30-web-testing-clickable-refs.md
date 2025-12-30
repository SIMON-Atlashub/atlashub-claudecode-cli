# Specs Techniques : Web Testing & Clickable References

> **Status** : READY FOR IMPLEMENTATION
> **Date** : 2025-12-30

---

## Feature 1 : Références cliquables & commandes copiables

### Tasks Templates

- [ ] Auditer tous les templates dans [templates/commands/](templates/commands/)
- [ ] Créer script/guide de formatage
- [ ] Mettre à jour templates gitflow
- [ ] Mettre à jour templates apex
- [ ] Mettre à jour templates ba
- [ ] Mettre à jour autres templates

### Standards de formatage

```markdown
# Fichiers cliquables
[filename.ts](path/filename.ts)
[filename.ts:42](path/filename.ts#L42)
[filename.ts:42-51](path/filename.ts#L42-L51)

# Commandes copiables
```
/command --option
```

# Bash copiable
```bash
npm run build
```
```

---

## Feature 2 : Agent /test-web

### Tasks Configuration

- [ ] Créer structure [.claude/test-web/](.claude/test-web/)
- [ ] Créer [.claude/test-web/config.json](.claude/test-web/config.json)
- [ ] Créer dossier [.claude/test-web/reports/](.claude/test-web/reports/)

### Tasks Commande

- [ ] Créer [templates/commands/utils/test-web.md](templates/commands/utils/test-web.md)
- [ ] Implémenter mode `--quick` (WebFetch uniquement)
- [ ] Implémenter mode `--chrome` (Claude for Chrome)
- [ ] Implémenter mode `--report` (rapport détaillé)
- [ ] Gérer les erreurs et retries

### Tasks Intégration BA

- [ ] Intégrer dans phase T du workflow BA
- [ ] Ajouter hook automatique optionnel
- [ ] Documenter l'utilisation

---

## Configuration cible

### [.claude/test-web/config.json](.claude/test-web/config.json)

```json
{
  "$schema": "https://atlashub.ch/schemas/test-web-config.json",
  "version": "1.0.0",
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
  "chrome": {
    "enabled": true,
    "targets": [
      {
        "name": "GitHub Login Check",
        "url": "https://github.com",
        "actions": [
          { "type": "verify", "selector": ".logged-in", "exists": true }
        ]
      }
    ]
  },
  "settings": {
    "timeout": 30000,
    "retries": 2,
    "reportPath": ".claude/test-web/reports"
  }
}
```

---

## Template commande

### [templates/commands/utils/test-web.md](templates/commands/utils/test-web.md)

```markdown
# /test-web - Agent de test web

Teste l'accessibilité et le contenu des ressources web du projet.

## Modes

| Mode | Commande | Description |
|------|----------|-------------|
| Quick | `/test-web --quick` | WebFetch uniquement (HTTP 200 + contenu) |
| Chrome | `/test-web --chrome` | Tests E2E avec Claude for Chrome |
| Report | `/test-web --report` | Génère rapport détaillé |
| Full | `/test-web` | Quick + Chrome si disponible |

## Prérequis Chrome

1. Extension "Claude for Chrome" installée
2. Plan Max/Pro/Team/Enterprise
3. Lancer avec: `claude --chrome`

## Configuration

Lit: [.claude/test-web/config.json](.claude/test-web/config.json)

## Workflow

1. Charge la configuration
2. Pour chaque target type "fetch":
   - WebFetch(url) → Vérifie status HTTP
   - WebFetch(url, prompt) → Vérifie contenu
3. Pour chaque target type "search":
   - WebSearch(query) → Vérifie résultats
4. Si --chrome et Chrome disponible:
   - Pour chaque target chrome:
     - Navigate, interact, verify
5. Génère rapport dans reports/
```

---

## Definition of Done

- [ ] Tous les templates utilisent le format cliquable
- [ ] /test-web --quick fonctionne avec WebFetch
- [ ] /test-web --chrome fonctionne avec Claude for Chrome
- [ ] Configuration externalisée dans config.json
- [ ] Rapports générés dans reports/
- [ ] Intégration phase T du workflow BA
- [ ] Documentation mise à jour

---

## Prochaine étape

```
/ba:4-implement
```
