---
description: Phase 12 - Abort release branch (abandon without merge to main)
agent: gitflow-abort
model: sonnet
args: [branch_name]
---

# Phase 12: ABORT-RELEASE - Abandonner une release

Tu es expert GitFlow. Abandonne proprement une branche release sans merger sur main.

**Argument:** `$ARGUMENTS` = nom de la branche release (optionnel, detecte automatiquement)

---

## Quand utiliser

- Tests de release echoues (bugs critiques)
- Changement de priorites business
- Fonctionnalites pas pretes
- Decision de reporter la release

---

## Workflow

### 1. Verifier contexte

- Detecter branche release courante ou specifiee
- Verifier qu'on est bien sur une branche `release/*`
- Lister les commits sur cette release
- Identifier les corrections (bug fixes) vs nouvelles features

### 2. Demander confirmation

```
⚠ ABANDON DE RELEASE

Branche: release/{version}
Commits: {n} commits depuis develop
  - {n} corrections (a conserver)
  - {n} features (a re-evaluer)

Cette action va:
✗ NE PAS merger sur main
✗ NE PAS creer de tag
✓ Merger les corrections vers develop
✓ Supprimer la branche release

Confirmer l'abandon? [oui/non]
```

### 3. Sauvegarder les corrections

Si corrections presentes sur la release:

```bash
# Checkout develop
git checkout develop

# Merger la release (sans fast-forward)
git merge --no-ff release/{version} -m "chore: salvage fixes from abandoned release/{version}

Corrections recuperees:
- {liste des commits de type fix}

Release abandonnee - pas de merge sur main"
```

### 4. Logger l'abandon

Creer `.claude/gitflow/logs/abort_{timestamp}.json`:

```json
{
  "timestamp": "{ISO_DATE}",
  "type": "release-abort",
  "branch": "release/{version}",
  "reason": "{raison fournie par user}",
  "commits_total": {n},
  "commits_salvaged": {n},
  "commits_lost": [],
  "salvage_commit": "{hash}",
  "version_aborted": "{version}",
  "next_action": "re-evaluate for next release"
}
```

### 5. Supprimer la branche

```bash
# Supprimer branche locale
git branch -d release/{version}

# Supprimer branche remote (si existe)
git push origin --delete release/{version}
```

### 6. Afficher resume

```
═══════════════════════════════════════════════════════════════
                    RELEASE ABANDONNEE
═══════════════════════════════════════════════════════════════

Branche supprimee: release/{version}
Corrections recuperees: {n} commits → develop
Version annulee: {version} (pas de tag cree)

═══════════════════════════════════════════════════════════════

PROCHAINES ETAPES:

1. Analyser les causes de l'echec
2. Creer des issues pour les bugs restants
3. Planifier une nouvelle release quand pret:
   /gitflow:10-start release {nouvelle-version}

═══════════════════════════════════════════════════════════════
```

---

## Options

| Commande | Action |
|----------|--------|
| `/gitflow:12-abort-release` | Detecte release courante |
| `/gitflow:12-abort-release release/1.3` | Branche specifiee |
| `/gitflow:12-abort-release --keep-local` | Garde branche locale |
| `/gitflow:12-abort-release --no-salvage` | Ne merge pas les corrections |
| `/gitflow:12-abort-release --reason "bugs critiques"` | Specifie raison |

---

## Cas speciaux

### Release deja partiellement pushee

Si des commits de la release ont ete pushes:

1. Verifier qu'aucun tag n'existe
2. Supprimer branche remote
3. Informer l'equipe de l'abandon

### Corrections dependantes

Si certaines corrections dependent de features non-pretes:

1. Cherry-pick uniquement les commits independants
2. Lister les commits non-recuperes dans le log
3. Creer des issues pour ces corrections

### Hotfix pendant release

Si un hotfix a ete cree pendant la release:

1. Verifier que le hotfix est bien merge sur main
2. La release peut etre abandonnee sans impact sur le hotfix

---

## Prevention

Pour eviter les abandons de release:

1. **Feature freeze** - Geler les features avant la release
2. **Release candidate** - Tester sur branche RC avant release officielle
3. **Tests automatises** - CI/CD sur branche release
4. **Criteres de validation** - Checklist avant merge sur main
