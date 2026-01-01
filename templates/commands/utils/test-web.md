---
description: Test web accessibility and content validation
argument-hint: --quick|--chrome|--report|<url>
allowed-tools: WebFetch, WebSearch, Read, Write, Bash
model: sonnet
---

# /test-web - Agent de test web

Teste l'accessibilité et le contenu des ressources web du projet.

## Modes d'exécution

| Mode | Flag | Description |
|------|------|-------------|
| Quick | `--quick` | WebFetch uniquement (HTTP 200 + contenu texte) |
| Chrome | `--chrome` | Tests E2E avec Claude for Chrome (requires `claude --chrome`) |
| Report | `--report` | Génère un rapport détaillé dans reports/ |
| Full | (défaut) | Quick + Chrome si disponible |

## Configuration

Lit la configuration depuis : [.claude/test-web/config.json](.claude/test-web/config.json)

## Workflow

### Mode Quick (--quick)

1. **Charger configuration**
   ```bash
   cat .claude/test-web/config.json
   ```

2. **Pour chaque target type "fetch"** :
   - `WebFetch(url, "Vérifie que la page est accessible et contient: {expects.contains}")`
   - Vérifier status HTTP (200 attendu)
   - Vérifier présence du contenu attendu

3. **Pour chaque target type "search"** :
   - `WebSearch(query)`
   - Vérifier que des résultats existent

4. **Rapport** : Afficher résultats dans la console

### Mode Chrome (--chrome)

**Prérequis** :
- Extension "Claude for Chrome" installée
- Plan Max/Pro/Team/Enterprise
- Claude Code lancé avec : `claude --chrome`

1. **Vérifier mode Chrome actif**
2. **Pour chaque target chrome** :
   - Naviguer vers l'URL
   - Exécuter les actions (click, verify, etc.)
   - Capturer screenshots si demandé

3. **Rapport** : Générer rapport avec captures

### Mode Report (--report)

Génère un fichier markdown dans [.claude/test-web/reports/](.claude/test-web/reports/) :

```markdown
# Test Web Report - YYYY-MM-DD HH:mm

## Summary
| Target | Status | Time |
|--------|--------|------|
| ... | PASS/FAIL | Xms |

## Details
### Target Name
- URL: ...
- Expected: ...
- Result: ...
- Screenshot: (if chrome mode)
```

## Exemples

### Test rapide de toutes les URLs configurées

```
/test-web --quick
```

### Test E2E avec navigateur

```bash
# D'abord lancer Claude Code avec Chrome
claude --chrome

# Puis exécuter les tests
/test-web --chrome
```

### Test d'une URL spécifique

```
/test-web https://github.com/SIMON-Atlashub/atlashub-claudecode-cli
```

### Générer rapport détaillé

```
/test-web --report
```

## Format de sortie

### Succès

```
TEST WEB RESULTS
────────────────────────────────
✅ GitHub Repository     200 OK    "README" found
✅ npm Package           200 OK    "claude-tools" found
✅ Google Indexation     Results   Found in search

Status: 3/3 PASS
────────────────────────────────
```

### Échec

```
TEST WEB RESULTS
────────────────────────────────
✅ GitHub Repository     200 OK    "README" found
❌ npm Package           404       Package not found
⚠️ Google Indexation     Results   No relevant results

Status: 1/3 PASS, 1 FAIL, 1 WARNING
────────────────────────────────
```

## Intégration BA/EPCT

Cette commande peut être appelée automatiquement dans :
- Phase T (Test) du workflow BA : `/ba:5-verify`
- Phase T du workflow EPCT

## Sources

- [Anthropic - Claude for Chrome](https://www.anthropic.com/news/claude-for-chrome)
- [Claude Help Center](https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome)

---

User: $ARGUMENTS
