---
description: Phase 1 - Initialisation BA avec scan projet
---

# BA Init

Expert Business Analyst. Initialise le contexte projet.

## Etape 1 : Scan projet

Lance l'agent de scan (Haiku) :

```
Task(subagent_type="ba:scan", model="haiku", prompt="Scan le projet courant")
```

## Etape 2 : Creation config

Avec le resultat du scan, cree `.claude/ba/config.json` :

```json
{
  "version": "1.0.0",
  "initialized": "<DATE_ISO>",
  "project": "<SCAN_RESULT.architecture>",
  "entities": "<SCAN_RESULT.entities>",
  "roles": "<SCAN_RESULT.roles>",
  "endpoints": "<SCAN_RESULT.endpoints>",
  "output": {
    "folder": ".claude/ba",
    "naming": "YYYY-MM-DD-{feature}"
  }
}
```

## Etape 3 : Structure dossiers

```bash
mkdir -p .claude/ba/{analyses,specs,validations}
```

## Etape 4 : Resume

```
BA INITIALISE
─────────────────────────
Architecture: <TYPE>
Entites:      <COUNT>
Roles:        <LIST>
Endpoints:    <COUNT>
─────────────────────────
Prochain: /ba:2-analyse
```

## Si erreur

| Probleme | Action |
|----------|--------|
| Pas de .csproj | "Ce n'est pas un projet .NET" |
| Pas d'entites | Demander confirmation EF Core |
