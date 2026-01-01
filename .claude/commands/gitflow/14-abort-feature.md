---
description: Phase 14 - Abort feature branch (abandon without merge)
agent: gitflow-abort
model: sonnet
args: [branch_name]
---

# Phase 14: ABORT-FEATURE - Abandonner une feature

Tu es expert GitFlow. Abandonne proprement une branche feature sans merger sur develop.

**Argument:** `$ARGUMENTS` = nom de la branche feature (optionnel, detecte automatiquement)

---

## Quand utiliser

- Feature annulee par le business
- Approche technique invalide
- Feature remplacee par autre solution
- Prototype/POC a jeter

---

## Workflow

### 1. Verifier contexte

- Detecter branche feature courante ou specifiee
- Verifier qu'on est bien sur une branche `feature/*`
- Lister les commits et fichiers modifies

### 2. Demander confirmation

```
⚠ ABANDON DE FEATURE

Branche: feature/{name}
Commits: {n} commits depuis develop
Fichiers: {n} fichiers modifies

Cette action va:
✗ NE PAS merger sur develop
✓ Archiver les informations (optionnel)
✓ Supprimer la branche feature

Les changements seront perdus. Confirmer? [oui/non]
```

### 3. Archiver (optionnel)

Si `--archive` specifie:

```bash
# Creer un tag d'archive
git tag -a archive/feature/{name} -m "Archived: feature/{name} - abandoned"
git push origin archive/feature/{name}
```

### 4. Logger l'abandon

Creer `.claude/gitflow/logs/abort_{timestamp}.json`:

```json
{
  "timestamp": "{ISO_DATE}",
  "type": "feature-abort",
  "branch": "feature/{name}",
  "reason": "{raison}",
  "commits_count": {n},
  "files_changed": {n},
  "archived": true|false,
  "archive_tag": "archive/feature/{name}"|null
}
```

### 5. Supprimer la branche

```bash
git checkout develop
git branch -D feature/{name}
git push origin --delete feature/{name}  # si existe
```

### 6. Nettoyer worktree (si applicable)

```bash
# Si worktree existe
git worktree remove {path} --force
```

### 7. Afficher resume

```
═══════════════════════════════════════════════════════════════
                    FEATURE ABANDONNEE
═══════════════════════════════════════════════════════════════

Branche supprimee: feature/{name}
Commits perdus: {n}
Archive: {tag ou "non"}
develop: inchange

═══════════════════════════════════════════════════════════════

Prochaines etapes:
- Documenter la raison de l'abandon
- Creer une issue si le besoin reste valide
- Ou demarrer une nouvelle approche:
  /gitflow:10-start feature {nouveau-nom}

═══════════════════════════════════════════════════════════════
```

---

## Options

| Commande | Action |
|----------|--------|
| `/gitflow:14-abort-feature` | Detecte feature courante |
| `/gitflow:14-abort-feature feature/auth` | Branche specifiee |
| `/gitflow:14-abort-feature --archive` | Cree tag d'archive |
| `/gitflow:14-abort-feature --keep-local` | Garde branche locale |
| `/gitflow:14-abort-feature --reason "POC termine"` | Specifie raison |

---

## Recuperation

Si abandon par erreur et `--archive` utilise:

```bash
# Restaurer depuis archive
git checkout -b feature/{name} archive/feature/{name}
```

Si pas archive mais pas encore garbage collected:

```bash
# Trouver le commit
git reflog
git checkout -b feature/{name} {commit-hash}
```
