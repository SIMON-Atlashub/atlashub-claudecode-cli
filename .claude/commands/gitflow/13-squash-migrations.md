---
description: Phase 13 - Consolidate multiple migrations into one for release
agent: gitflow-squash-migrations
model: sonnet
---

# Phase 13: SQUASH-MIGRATIONS - Consolider les migrations pour release

Tu es expert EF Core. Consolide plusieurs migrations en une seule migration propre pour la release.

**Argument:** `$ARGUMENTS` = nom de la migration finale (optionnel, default: Release_vX.X.X_Initial)

---

## Pre-validation (OBLIGATOIRE)

**Verifier qu'on est sur une branche release:**

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ ! $BRANCH =~ ^release/ ]]; then
  echo "ERREUR: Cette commande ne peut etre executee que depuis une branche release"
  echo ""
  echo "Branche actuelle: $BRANCH"
  echo ""
  echo "Pour creer une release:"
  echo "  /gitflow:10-start release"
  exit 1
fi
```

---

## Quand utiliser

| Situation | Recommandation |
|-----------|----------------|
| 1-2 migrations | Garder separees |
| 3-5 migrations | Consolider recommande |
| 6+ migrations | Consolider obligatoire |
| Migration avec donnees | ATTENTION - verifier impact |
| Prod existante avec migrations appliquees | NE PAS consolider les anciennes |

---

## Workflow

### 1. Analyser les migrations existantes

```bash
# Lister toutes les migrations dans le projet
MIGRATIONS_DIR=$(find . -type d -name "Migrations" -not -path "*/bin/*" -not -path "*/obj/*" | head -1)

# Compter les migrations
MIGRATION_COUNT=$(ls -1 "$MIGRATIONS_DIR"/*.cs 2>/dev/null | grep -v Designer | grep -v ModelSnapshot | wc -l)

# Identifier la derniere migration appliquee en prod (si connue)
# Lire depuis config ou demander
LAST_APPLIED=$(cat .claude/gitflow/config.json | jq -r '.efcore.lastAppliedMigration // "none"')
```

### 2. Afficher l'etat actuel

```
================================================================================
                    SQUASH MIGRATIONS - ANALYSE
================================================================================

BRANCHE: release/v1.2.0

MIGRATIONS DETECTEES: 5
  001_Initial.cs                    (APPLIQUEE en prod)
  002_AddUsersTable.cs              (NOUVELLE - feature/users)
  003_AddOrdersTable.cs             (NOUVELLE - feature/orders)
  004_AddProductsTable.cs           (NOUVELLE - feature/products)
  005_AddCategoriesTable.cs         (NOUVELLE - feature/categories)

A CONSOLIDER: 4 migrations (002-005)
RESULTAT: 1 migration "Release_v1.2.0_AllFeatures"

================================================================================
```

### 3. Confirmer avec l'utilisateur

```javascript
AskUserQuestion({
  questions: [{
    question: "Confirmer la consolidation de 4 migrations en 1 ?",
    header: "Squash",
    options: [
      { label: "Oui, consolider", description: "Creer Release_v1.2.0_AllFeatures" },
      { label: "Non, garder separees", description: "Conserver les 4 migrations individuelles" },
      { label: "Voir details", description: "Afficher le contenu de chaque migration" }
    ],
    multiSelect: false
  }]
})
```

### 4. Executer le squash

```bash
# 1. Sauvegarder le ModelSnapshot actuel
cp "$MIGRATIONS_DIR/ApplicationDbContextModelSnapshot.cs" "$MIGRATIONS_DIR/ModelSnapshot.backup.cs"

# 2. Supprimer les migrations NON appliquees (dans l'ordre inverse!)
# IMPORTANT: Ne jamais supprimer une migration deja appliquee en prod
dotnet ef migrations remove  # Supprime 005
dotnet ef migrations remove  # Supprime 004
dotnet ef migrations remove  # Supprime 003
dotnet ef migrations remove  # Supprime 002

# 3. Creer la migration consolidee
dotnet ef migrations add "Release_v1_2_0_AllFeatures" \
  --context ApplicationDbContext \
  --output-dir Migrations

# 4. Verifier que le ModelSnapshot final est identique
diff "$MIGRATIONS_DIR/ApplicationDbContextModelSnapshot.cs" "$MIGRATIONS_DIR/ModelSnapshot.backup.cs"
# Si different = ERREUR, quelque chose s'est mal passe!

# 5. Nettoyer le backup
rm "$MIGRATIONS_DIR/ModelSnapshot.backup.cs"
```

### 5. Verification post-squash

```bash
# Build pour verifier
dotnet build

# Lister les migrations resultantes
dotnet ef migrations list --context ApplicationDbContext
```

---

## Output Format

```
================================================================================
                    SQUASH MIGRATIONS - RESULTAT
================================================================================

AVANT: 5 migrations
  001_Initial.cs                    (conservee)
  002_AddUsersTable.cs              (supprimee)
  003_AddOrdersTable.cs             (supprimee)
  004_AddProductsTable.cs           (supprimee)
  005_AddCategoriesTable.cs         (supprimee)

APRES: 2 migrations
  001_Initial.cs                    (conservee)
  Release_v1_2_0_AllFeatures.cs     (NOUVELLE)

TABLES IMPACTEES:
  + Users (CREATE)
  + UserRoles (CREATE)
  + Orders (CREATE)
  + OrderItems (CREATE)
  + Products (CREATE)
  + Categories (CREATE)

VERIFICATION:
  Build: OK
  ModelSnapshot: Identique (valide)
  Script SQL: Genere dans ./scripts/migrations/

================================================================================
IMPORTANT - A COMMITTER
================================================================================

git add Migrations/
git commit -m "db(migrations): squash migrations for release v1.2.0

Consolidated 4 feature migrations into 1 release migration:
- 002_AddUsersTable (feature/users)
- 003_AddOrdersTable (feature/orders)
- 004_AddProductsTable (feature/products)
- 005_AddCategoriesTable (feature/categories)

New migration: Release_v1_2_0_AllFeatures"

================================================================================
```

---

## Gestion des erreurs

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Migration has already been applied" | Migration deja en prod | Ne pas inclure dans le squash |
| ModelSnapshot different | Perte de donnees/tables | Restaurer backup, verifier manuellement |
| Build echoue | Code depend de migration | Verifier les entites |
| "Pending changes" | Modele modifie | `dotnet ef database update` d'abord |

---

## Cas special: Donnees existantes

Si une migration contient des `InsertData` ou `UpdateData`:

```
⚠️  ATTENTION: Migration avec donnees detectee
================================================================================

Fichier: 003_AddOrdersTable.cs
Ligne 45: InsertData(table: "OrderStatus", ...)

Ces donnees seront INCLUSES dans la migration consolidee.
Verifiez que c'est le comportement souhaite.

Options:
1. Inclure les donnees (defaut)
2. Exclure les donnees (migration schema only)
3. Annuler et revoir manuellement

================================================================================
```

---

## Modes

| Commande | Action |
|----------|--------|
| `/gitflow:13-squash-migrations` | Mode interactif |
| `/gitflow:13-squash-migrations Release_v1_2_0` | Nom specifie |
| `/gitflow:13-squash-migrations --dry-run` | Simulation sans execution |
| `/gitflow:13-squash-migrations --keep-data` | Inclure InsertData/UpdateData |
| `/gitflow:13-squash-migrations --schema-only` | Exclure toutes les donnees |
