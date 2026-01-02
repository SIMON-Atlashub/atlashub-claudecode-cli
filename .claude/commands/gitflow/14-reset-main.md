---
description: Phase 14 - Reset main branch from develop (emergency recovery)
agent: gitflow-reset-main
model: sonnet
---

# Phase 14: RESET-MAIN - Reinitialiser main depuis develop

Tu es expert GitFlow. Reinitialise la branche main depuis develop en cas de divergence critique.

**ATTENTION:** Cette commande est pour les cas d'urgence uniquement.

---

## Quand utiliser

| Situation | Recommandation |
|-----------|----------------|
| main "pourri" / diverge significativement | **OUI** - cette commande |
| Petit retard de main vs develop | **NON** - utiliser release normale |
| main et develop quasi-identiques | **NON** - pas necessaire |
| Premier deploiement (main vide) | **OUI** - cette commande |

---

## Pre-validation (OBLIGATOIRE)

```bash
# 1. Verifier qu'on est sur develop ou main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "develop" && "$BRANCH" != "main" ]]; then
  echo "ERREUR: Executez cette commande depuis develop ou main"
  exit 1
fi

# 2. Analyser la divergence
git fetch origin

MAIN_COMMITS=$(git rev-list --count origin/main 2>/dev/null || echo "0")
DEVELOP_COMMITS=$(git rev-list --count origin/develop 2>/dev/null || echo "0")
DIVERGENCE=$(git rev-list --count origin/main..origin/develop 2>/dev/null || echo "0")
BEHIND=$(git rev-list --count origin/develop..origin/main 2>/dev/null || echo "0")
```

---

## Workflow

### 1. Afficher l'analyse de divergence

```
================================================================================
                    RESET-MAIN - ANALYSE
================================================================================

ETAT ACTUEL
  main:    {MAIN_COMMITS} commits
  develop: {DEVELOP_COMMITS} commits

DIVERGENCE
  develop ahead of main: {DIVERGENCE} commits
  main ahead of develop: {BEHIND} commits (PROBLEME!)

DIAGNOSTIC
  {Si BEHIND > 0: "main contient des commits absents de develop - DANGEREUX"}
  {Si DIVERGENCE > 50: "Divergence importante - reset recommande"}
  {Si DIVERGENCE < 10: "Petite divergence - release normale suffit"}

================================================================================
```

### 2. Si main a des commits uniques (BEHIND > 0)

```
⚠️  ATTENTION: main contient {BEHIND} commits absents de develop!

Ces commits seront PERDUS lors du reset:
{git log --oneline origin/develop..origin/main}

Options:
1. Cherry-pick ces commits dans develop d'abord
2. Creer une branche de backup: backup-main-{date}
3. Continuer et perdre ces commits

Que voulez-vous faire ?
```

### 3. Confirmer avec l'utilisateur

```javascript
AskUserQuestion({
  questions: [{
    question: "Confirmer le reset de main depuis develop ?",
    header: "Reset",
    options: [
      { label: "Oui, avec backup", description: "Creer backup-main-{date} puis reset (Recommande)" },
      { label: "Oui, sans backup", description: "Reset direct (dangereux)" },
      { label: "Non, annuler", description: "Ne rien faire" }
    ],
    multiSelect: false
  }]
})
```

### 4. Executer le reset

**Methode 1: Via Release (RECOMMANDEE)**

```bash
# Cette methode preserve l'historique GitFlow
# et cree un point de reference clair

# 1. Creer une release "corrective"
git checkout develop
git pull origin develop
VERSION=$(cat package.json | jq -r '.version')
RESET_VERSION="${VERSION%.*}.$(( ${VERSION##*.} + 1 ))"

git checkout -b release/v$RESET_VERSION

# 2. Merge vers main avec strategie "theirs" (develop gagne)
git checkout main
git pull origin main

# Backup si demande
git branch backup-main-$(date +%Y%m%d) || true

# Reset main au contenu de develop
git merge release/v$RESET_VERSION --strategy-option theirs --no-ff \
  -m "chore: reset main from develop (v$RESET_VERSION)

This release resets main to match develop state.
Reason: main was out of sync / corrupted.

Previous main backed up to: backup-main-$(date +%Y%m%d)"

# 3. Tag
git tag -a "v$RESET_VERSION" -m "Reset release v$RESET_VERSION"

# 4. Push
git push origin main --tags
git push origin backup-main-$(date +%Y%m%d) || true

# 5. Cleanup
git branch -d release/v$RESET_VERSION
```

**Methode 2: Force Reset (URGENCE UNIQUEMENT)**

```bash
# ATTENTION: Cette methode reecrit l'historique
# Ne PAS utiliser si d'autres developpeurs travaillent sur main

# 1. Backup
git checkout main
git branch backup-main-$(date +%Y%m%d)
git push origin backup-main-$(date +%Y%m%d)

# 2. Force reset
git reset --hard origin/develop

# 3. Force push (DANGEREUX!)
git push origin main --force-with-lease

# Note: --force-with-lease est plus sur que --force
# Il echoue si quelqu'un d'autre a push entre temps
```

---

## Output Format

```
================================================================================
                    RESET-MAIN - RESULTAT
================================================================================

ACTION: Reset via release corrective

AVANT
  main:    125 commits, dernier: abc1234 "old commit"
  develop: 180 commits, dernier: def5678 "latest feature"

APRES
  main:    181 commits, dernier: ghi9012 "chore: reset main from develop"
  develop: 180 commits (inchange)

BACKUP
  Branche: backup-main-20240115
  Commits preserves: 125

RELEASE
  Version: v1.3.0
  Tag: v1.3.0

================================================================================
VERIFICATION
================================================================================

# Verifier que main = develop (+ commit de merge)
git diff origin/main origin/develop
# Devrait montrer uniquement le commit de merge

# Verifier les tags
git tag -l | tail -5

================================================================================
PROCHAINES ETAPES
================================================================================

1. Informer l'equipe du reset
2. Les developpeurs doivent: git fetch && git pull
3. Verifier les pipelines CI/CD
4. Supprimer backup-main-{date} apres validation (optionnel)

================================================================================
```

---

## Gestion des erreurs

| Erreur | Cause | Solution |
|--------|-------|----------|
| "rejected - non-fast-forward" | Protection de branche | Desactiver temporairement ou utiliser release |
| "diverged" | Quelqu'un a push sur main | Re-fetch et reessayer |
| "merge conflict" | Fichiers modifies des deux cotes | Utiliser --strategy-option theirs |

---

## Modes

| Commande | Action |
|----------|--------|
| `/gitflow:14-reset-main` | Mode interactif (recommande) |
| `/gitflow:14-reset-main --via-release` | Force methode release |
| `/gitflow:14-reset-main --force` | Force reset direct (dangereux) |
| `/gitflow:14-reset-main --dry-run` | Simulation |
| `/gitflow:14-reset-main --no-backup` | Sans backup (tres dangereux) |
