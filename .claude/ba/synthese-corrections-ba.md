# Synthèse Corrections Workflow BA

**Date** : 2025-12-30
**Status** : APPLIQUE

---

## Corrections appliquées

### 1. Template Analyse - SANS CODE

| Avant | Après |
|-------|-------|
| ````csharp` DTOs | Tableau DTOs (DTO, Propriétés, Usage) |
| ````bash` migration | Texte : nom migration prévu |

### 2. Workflow clarifié

```
/ba:2-analyse  → analyses/{feature}.md   (fonctionnel, SANS code)
/ba:3-validate → specs/{feature}.md      (Plan de Développement)
/ba:4-implement {file}                   (exécute le plan)
```

### 3. Plan de Développement (specs/)

Structure avec **ordre d'exécution** :
- 1. Backend - Entités (ordre, fichier cible)
- 2. Backend - Migration (nom, tables)
- 3. Backend - Endpoints (ordre, controller, route)
- 4. Frontend - Pages (ordre, URL)
- 5. Tests (priorité)
- Definition of Done

### 4. Implement lit specs/ (pas validations/)

- Source : `.claude/ba/specs/`
- Variable : `$PLAN_FILE`

---

## Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `1-init.md` | Prompt scan optimisé, config.json enrichi |
| `_resources/template-analyse.md` | Code supprimé |
| `3-validate.md` | Plan de dev structuré + exemples |
| `4-implement.md` | Lit specs/ avec $PLAN_FILE |
| `5-verify.md` | Section sélection ajoutée |

## Synchronisation templates ↔ .claude

| Fichier | Status |
|---------|--------|
| 1-init.md | ✓ SYNC |
| 2-analyse.md | ✓ SYNC |
| 3-validate.md | ✓ SYNC |
| 4-implement.md | ✓ SYNC |
| 5-verify.md | ✓ SYNC |
| template-analyse.md | ✓ SYNC |

---

## Workflow Final

```bash
/ba:1-init                    # Config projet
/ba:2-analyse                 # Analyse fonctionnelle (sans code)
/ba:3-validate                # Validation → Plan de dev
/ba:4-implement {file}.md     # Implémentation guidée
/ba:5-verify                  # Vérification
```
