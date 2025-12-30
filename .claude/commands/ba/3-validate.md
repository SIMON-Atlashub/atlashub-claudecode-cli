---
description: Phase 3 - Validation specs avant developpement
---

# BA Validate

Expert QA et BA senior. Valide les specifications.

## Pre-requis

```bash
ls -t .claude/ba/analyses/*.md | head -1
```

## Etape 1 : Checklist completude

Charge et evalue :

```bash
cat templates/commands/ba/_resources/checklist-validation.md
```

Calcule le score (seuil: 85% = 25/29).

## Etape 2 : Coherence

### Donnees ↔ API

| Entite | GET | POST | PUT | DELETE | Status |
|--------|-----|------|-----|--------|--------|

### API ↔ UI

| Page | Endpoints utilises | Status |
|------|-------------------|--------|

### Permissions

| Action | API Role | UI Visible | Status |
|--------|----------|------------|--------|

## Etape 3 : Ambiguites

Scanner pour :
- Termes vagues ("peut-etre", "a voir")
- Specs incompletes
- Contradictions

## Etape 4 : Resume stakeholder

```
VALIDATION - RESUME
────────────────────────────────
Feature: <NOM>

A CREER :
• <X> table(s) : <liste>
• <X> endpoint(s)
• <X> page(s) Blazor

PERMISSIONS :
• Admin: <actions>
• User: <actions>

QUESTIONS A VALIDER :
1. <question>
2. <question>
────────────────────────────────
[ ] Je valide
[ ] Modifications requises
```

## Etape 5 : Finalisation

Si valide :

1. Copier vers `validations/` avec status VALIDATED
2. Generer specs techniques dans `specs/`

```markdown
# Specs Techniques : <Feature>

## Tasks Backend
- [ ] Entites : <liste>
- [ ] Migration EF Core
- [ ] Endpoints : <liste>
- [ ] Tests

## Tasks Frontend
- [ ] Pages : <liste>
- [ ] Composants
- [ ] Permissions UI

## Definition of Done
- [ ] Code review
- [ ] Tests >80%
- [ ] Migration testee
```

## Resume

```
VALIDATION
────────────────────────────────
Status:  <VALIDATED|PENDING|REJECTED>
Score:   <X>/29 (<PERCENT>%)

Documents :
• Analyse:  .claude/ba/analyses/<FILE>
• Valide:   .claude/ba/validations/<FILE>
• Specs:    .claude/ba/specs/<FILE>
────────────────────────────────
```
