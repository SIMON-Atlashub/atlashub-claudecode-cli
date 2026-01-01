---
description: Phase 13 - Abort hotfix branch (abandon without merge to main)
agent: gitflow-abort
model: sonnet
args: [branch_name]
---

# Phase 13: ABORT-HOTFIX - Abandonner un hotfix

Tu es expert GitFlow. Abandonne proprement une branche hotfix sans merger sur main.

**Argument:** `$ARGUMENTS` = nom de la branche hotfix (optionnel, detecte automatiquement)

---

## Quand utiliser

- Fix invalide ou incorrect
- Meilleure solution trouvee
- Hotfix plus necessaire (probleme resolu autrement)
- Conflit avec autre hotfix en cours

---

## Workflow

### 1. Verifier contexte

- Detecter branche hotfix courante ou specifiee
- Verifier qu'on est bien sur une branche `hotfix/*`
- Verifier qu'aucun tag n'a ete cree

### 2. Demander confirmation

```
⚠ ABANDON DE HOTFIX

Branche: hotfix/{name}
Commits: {n} commits depuis main
Version prevue: {version}

Cette action va:
✗ NE PAS merger sur main
✗ NE PAS merger sur develop
✗ NE PAS creer de tag
✓ Supprimer la branche hotfix

Les changements seront perdus. Confirmer? [oui/non]
```

### 3. Logger l'abandon

Creer `.claude/gitflow/logs/abort_{timestamp}.json`:

```json
{
  "timestamp": "{ISO_DATE}",
  "type": "hotfix-abort",
  "branch": "hotfix/{name}",
  "reason": "{raison}",
  "commits_lost": [{commits}],
  "version_aborted": "{version}",
  "main_unchanged": true,
  "develop_unchanged": true
}
```

### 4. Supprimer la branche

```bash
git checkout develop
git branch -D hotfix/{name}
git push origin --delete hotfix/{name}  # si existe
```

### 5. Afficher resume

```
═══════════════════════════════════════════════════════════════
                    HOTFIX ABANDONNE
═══════════════════════════════════════════════════════════════

Branche supprimee: hotfix/{name}
Commits perdus: {n}
main: inchange
develop: inchange

═══════════════════════════════════════════════════════════════

Si le probleme persiste, creer un nouveau hotfix:
/gitflow:10-start hotfix {nouveau-nom}

═══════════════════════════════════════════════════════════════
```

---

## Options

| Commande | Action |
|----------|--------|
| `/gitflow:13-abort-hotfix` | Detecte hotfix courant |
| `/gitflow:13-abort-hotfix hotfix/fix-auth` | Branche specifiee |
| `/gitflow:13-abort-hotfix --keep-local` | Garde branche locale |
| `/gitflow:13-abort-hotfix --salvage-to-develop` | Merge vers develop |

---

## Difference avec abort-release

| Aspect | Release | Hotfix |
|--------|---------|--------|
| Corrections | Souvent recuperees | Rarement (fix invalide) |
| Impact | Fonctionnalites reportees | Probleme reste a resoudre |
| Urgence | Planifiable | Immediate si critique |
