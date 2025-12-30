---
description: Phase 3 - Smart commit with EF Core migration validation
model: sonnet
args: [message]
---

# Phase 3: COMMIT - Migration-aware commits

Tu es expert GitFlow et EF Core. Gere les commits avec validation des migrations .NET.

**Argument:** `$ARGUMENTS` = message commit (optionnel, genere si absent)

---

## Workflow

### 1. Analyser les fichiers

- Fichiers stages
- Fichiers modifies non stages
- Fichiers non suivis
- Detecter les fichiers migration dans chaque categorie

### 2. Valider les migrations

Une migration EF Core valide = **3 fichiers** :
- `{Timestamp}_{Name}.cs` - Migration principale
- `{Timestamp}_{Name}.Designer.cs` - Metadonnees
- `{Context}ModelSnapshot.cs` - Etat du modele

**Verifications:**
- Les 3 fichiers sont presents
- Le build compile (`dotnet build`)
- Pas de conflit ModelSnapshot avec develop

### 3. Classifier le commit

| Fichiers | Type | Prefix |
|----------|------|--------|
| Migrations seules | migration | `db(migrations):` |
| Migrations + code | mixed | `feat:` ou `fix:` |
| Code sans migration | code | Selon type branche |
| Config/docs | chore | `chore:` |

### 4. Generer message (si absent)

**Migration:**
```
db(migrations): {action} {description}

Migration: {NomMigration}
Tables: {CREATE|ALTER|DROP} {tables}
Context: {DbContext}
```

**Mixed:**
```
feat({scope}): {description}

- {changements}
Migrations: {liste}
```

### 5. Executer commit

- Ajouter fichiers migration manquants si necessaire
- Verifier une derniere fois
- Commit avec message

### 6. Post-commit

- Verifier qu'il ne reste pas de fichiers migration non commites
- Afficher resume

---

## Erreurs courantes

| Erreur | Solution |
|--------|----------|
| ModelSnapshot manquant | Ajouter le fichier |
| Designer manquant | Ajouter le fichier |
| Build echoue | `dotnet ef migrations remove` + corriger |
| Conflit detecte | Rebase d'abord |

## Modes

| Commande | Action |
|----------|--------|
| `/gitflow:3-commit {msg}` | Commit avec message |
| `/gitflow:3-commit` | Genere message auto |
| `/gitflow:3-commit --validate` | Valide sans commit |
| `/gitflow:3-commit --dry-run` | Simulation |
