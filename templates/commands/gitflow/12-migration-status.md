---
description: Phase 12 - View all pending migrations across branches
agent: gitflow-migration-status
model: haiku
---

# Phase 12: MIGRATION-STATUS - Vue globale des migrations EF Core

Tu es expert EF Core. Affiche l'etat de toutes les migrations sur toutes les branches GitFlow.

---

## Workflow

### 1. Scanner toutes les branches

```bash
# Lister toutes les branches GitFlow actives
FEATURES=$(git branch -r | grep 'feature/' | sed 's/origin\///')
RELEASES=$(git branch -r | grep 'release/' | sed 's/origin\///')
HOTFIXES=$(git branch -r | grep 'hotfix/' | sed 's/origin\///')
```

### 2. Pour chaque branche, detecter les migrations

```bash
# Pour chaque branche
for BRANCH in $FEATURES $RELEASES $HOTFIXES; do
  # Lister les fichiers migration ajoutes sur cette branche
  MIGRATIONS=$(git diff origin/develop..origin/$BRANCH --name-only | grep -E "Migrations/.*\.cs$" | grep -v Designer | grep -v ModelSnapshot)
done
```

### 3. Detecter les conflits potentiels

```bash
# Verifier si plusieurs branches modifient le meme ModelSnapshot
SNAPSHOT_CHANGES=$(git diff origin/develop..origin/$BRANCH --name-only | grep "ModelSnapshot")
```

---

## Output Format

```
================================================================================
                    EF CORE MIGRATION STATUS
================================================================================

DEVELOP (base)
  Derniere migration: 20240101_Initial
  ModelSnapshot: Users, Orders (2 tables)

--------------------------------------------------------------------------------
FEATURES (4 actives)
--------------------------------------------------------------------------------

feature/add-users
  + 20240115_AddUsersTable.cs
  + Tables: Users, UserRoles
  ModelSnapshot: MODIFIE
  Conflit potentiel: NON

feature/add-orders
  + 20240116_AddOrdersTable.cs
  + Tables: Orders, OrderItems
  ModelSnapshot: MODIFIE
  Conflit potentiel: NON

feature/add-products
  + 20240117_AddProductsTable.cs
  + Tables: Products
  ModelSnapshot: MODIFIE
  Conflit potentiel: NON

feature/add-categories
  + 20240118_AddCategoriesTable.cs
  + Tables: Categories
  + FK: Products.CategoryId -> Categories.Id
  ModelSnapshot: MODIFIE
  Conflit potentiel: OUI (depend de feature/add-products)

--------------------------------------------------------------------------------
RELEASES (0 active)
--------------------------------------------------------------------------------
Aucune release en cours

--------------------------------------------------------------------------------
HOTFIXES (0 active)
--------------------------------------------------------------------------------
Aucun hotfix en cours

================================================================================
                         RESUME
================================================================================

Total migrations pending:     4
Conflits ModelSnapshot:       0 directs, 1 dependance
Ordre de merge recommande:
  1. feature/add-users (independant)
  2. feature/add-orders (independant)
  3. feature/add-products (independant)
  4. feature/add-categories (depend de #3)

================================================================================
RECOMMANDATIONS
================================================================================

- Merger les features dans l'ordre recommande
- Apres merge de toutes les features, executer:
  /gitflow:squash-migrations (optionnel, consolide en 1 migration)
- Creer la release: /gitflow:10-start release

================================================================================
```

---

## Analyse des dependances

**Detection automatique des FK entre migrations:**

```bash
# Scanner les migrations pour les ForeignKey
grep -h "AddForeignKey\|HasOne\|HasMany" Migrations/*.cs | \
  grep -oP "(?<=table: \")[^\"]+|(?<=\.Entity<)[^>]+"
```

**Matrice de dependances:**

```
              Users  Orders  Products  Categories
Users           -      -        -          -
Orders          ?      -        -          -  (Orders.UserId?)
Products        -      -        -          -
Categories      -      -        X          -  (Categories depend de Products)
```

---

## Modes

| Commande | Action |
|----------|--------|
| `/gitflow:12-migration-status` | Vue complete |
| `/gitflow:12-migration-status --conflicts` | Conflits uniquement |
| `/gitflow:12-migration-status --order` | Ordre de merge recommande |
| `/gitflow:12-migration-status --branch feature/xxx` | Une branche specifique |
