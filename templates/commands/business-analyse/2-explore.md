---
description: Business Analysis Phase 2 - Technical context exploration with parallel agents
argument-hint: [feature-name]
---

# Business Analysis - PHASE 2: EXPLORE

**Model: Haiku/Sonnet for agents orchestration**

## Mission

Gather technical context to enrich business requirements.
Launch ONLY relevant agents based on feature type. Minimize token usage.

---

## Prerequisites

- Phase 1 completed: `.claude/ba/[feature-name]/01-business-requirements.md`

---

## Agent Selection Matrix

| Feature Type | Agents to Launch | Est. Tokens |
|--------------|------------------|-------------|
| UI only (button, form) | `explore-theme`, `explore-api` | ~2,400 |
| Data feature | `explore-schema`, `explore-api` | ~2,700 |
| New page/route | `explore-navigation`, `explore-theme`, `explore-api` | ~3,600 |
| Security feature | `explore-permissions`, `explore-api` | ~2,200 |
| Full module | `explore-schema`, `explore-permissions`, `explore-api` | ~3,700 |

**NEVER launch more than 3 agents.**

---

## Execution

### Step 1: Read Business Requirements

```bash
Read: .claude/ba/[feature-name]/01-business-requirements.md
```

Identify feature type from requirements.

### Step 2: Confirm Agent Selection

```markdown
## Exploration Plan

**Feature**: [feature name]
**Type**: UI | Data | Page | Security | Module

**Agents to Launch**:
1. explore-api (always required)
2. [agent if needed]
3. [agent if needed]

**Skipping**: [agents not needed and why]
```

### Step 3: Launch Agents in Parallel

Launch selected agents simultaneously with Task tool.

```
Task: explore-api
Prompt: Find API patterns for [feature context]

Task: explore-schema (if data feature)
Prompt: Find data model patterns for [entities]

Task: explore-theme (if UI feature)
Prompt: Find UI components and styling for [UI elements]
```

### Step 4: Consolidate Output

Merge agent results into compact format:

```markdown
# Technical Context: [Feature Name]

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Phase | EXPLORE |

---

## API Context

- **Existing endpoints**: [list relevant endpoints]
- **Controller pattern**: [file:line]
- **Service pattern**: [file:line]
- **DTO pattern**: [file:line]

## Data Context (if applicable)

- **Related entities**: [list]
- **Entity pattern**: [file:line]
- **Configuration pattern**: [file:line]

## UI Context (if applicable)

- **Similar pages**: [list with paths]
- **Component library**: [PrimeNG, Material, etc.]
- **Theme/styling**: [file:line]

## Permission Context (if applicable)

- **Existing permissions**: [list relevant]
- **Permission pattern**: [file:line]
- **Guard pattern**: [file:line]

## Navigation Context (if applicable)

- **Routing module**: [file:line]
- **Menu configuration**: [file:line]
- **Similar routes**: [list]

---

## Implementation Hints

- **Files to CREATE**: [list with proposed paths]
- **Files to MODIFY**: [list with paths and line numbers]
- **Patterns to COPY**: [file:line references]

---

## Constraints Discovered

- [Technical constraint 1]
- [Technical constraint 2]
```

---

## Output Rules

1. **No JSON blobs** - Use markdown tables and bullets
2. **File:line references** - Always include line numbers
3. **Compact format** - Max 100 lines output
4. **Actionable only** - Skip theoretical analysis

## File Output

Save to: `.claude/ba/[feature-name]/02-technical-context.md`

---

## Next Phase

After exploration complete:

```
/business-analyse:3-analyse
```

Phase 3 will merge business requirements with technical context.

---

User: $ARGUMENTS
