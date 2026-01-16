---
description: Business Analysis Phase 3 - Enriched analysis merging business needs with technical context
argument-hint: [feature-name]
---

# Business Analysis - PHASE 3: ANALYSE

**You need to always ULTRA THINK.**

## Mission

Merge business requirements with technical context.
Identify gaps, conflicts, and opportunities.
Produce enriched requirements ready for specification.

---

## Prerequisites

- Phase 1: `.claude/ba/[feature-name]/01-business-requirements.md`
- Phase 2: `.claude/ba/[feature-name]/02-technical-context.md`

---

## Step 1: Load Context

Read both files and cross-reference:

```bash
Read: .claude/ba/[feature-name]/01-business-requirements.md
Read: .claude/ba/[feature-name]/02-technical-context.md
```

---

## Step 2: Gap Analysis

Identify mismatches between WHAT user wants and WHAT system can do:

```markdown
## Gap Analysis

### Feasibility Check

| Requirement | Technical Reality | Gap | Resolution |
|-------------|-------------------|-----|------------|
| [BR-01] | [What exists/possible] | None / Minor / Major | [How to resolve] |
| [BR-02] | [What exists/possible] | None / Minor / Major | [How to resolve] |

### Conflicts Detected

| Conflict | Business Need | Technical Constraint | Proposed Resolution |
|----------|---------------|----------------------|---------------------|
| [C-01] | [What user wants] | [Why it's hard] | [Alternative approach] |

### Opportunities Discovered

| Opportunity | Description | Impact |
|-------------|-------------|--------|
| [O-01] | [Existing feature that helps] | [How it simplifies] |
| [O-02] | [Pattern that can be reused] | [Time saved] |
```

---

## Step 3: Enriched Clarification

If gaps or conflicts exist, ask user targeted questions:

```markdown
## Clarifications Needed (Phase 3)

Based on technical analysis, I need to clarify:

1. **[Conflict/Gap]**: You requested [X], but the system currently [Y].
   - Option A: [approach 1 - tradeoffs]
   - Option B: [approach 2 - tradeoffs]
   - Which do you prefer?

2. **[Scope question]**: The existing [feature] already does [partial].
   - Should we extend it or create something new?

3. **[Priority question]**: Given [constraint], we can do [A] or [B] but not both initially.
   - Which is more important?
```

**WAIT for user answers if questions exist.**

---

## Step 4: Enriched Business Requirements

After resolving gaps, produce final BRD:

```markdown
# Enriched Business Requirements: [Feature Name]

| Field | Value |
|-------|-------|
| Version | 2.0 |
| Status | Analysed |
| Phase | ANALYSE |

---

## Problem Statement

[Refined after technical analysis]

## Goal

[Confirmed or adjusted goal]

## Scope (Refined)

### In Scope
- [Capability 1] → [Technical approach hint]
- [Capability 2] → [Technical approach hint]

### Out of Scope
- [Excluded item] - Reason: [technical/business reason]

### Deferred (Future)
- [Item moved to future] - Reason: [complexity/dependency]

## Requirements (Final MoSCoW)

### Must Have
| ID | Requirement | Technical Notes |
|----|-------------|-----------------|
| BR-01 | [Requirement in user language] | Extends [existing] |
| BR-02 | [Requirement in user language] | New implementation |

### Should Have
| ID | Requirement | Technical Notes |
|----|-------------|-----------------|
| BR-03 | [Requirement] | [Notes] |

### Could Have
| ID | Requirement | Technical Notes |
|----|-------------|-----------------|
| BR-04 | [Requirement] | [Notes] |

### Won't Have (This Version)
| ID | Requirement | Reason |
|----|-------------|--------|
| BR-05 | [Requirement] | [Why deferred] |

## Business Rules (Refined)

| ID | Rule | Technical Implementation |
|----|------|-------------------------|
| BRU-01 | If [condition] then [action] | [How system enforces] |
| BRU-02 | Only [role] can [action] | Via [permission system] |

## Acceptance Criteria (Testable)

| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| AC-01 | User can [action] and sees [result] | Manual / Automated |
| AC-02 | When [condition], system [behavior] | Manual / Automated |

---

## Technical Alignment Summary

- **Patterns to follow**: [list with file:line]
- **Dependencies**: [existing features/services]
- **Risk areas**: [complexity hotspots]

---

## Decisions Log

| Decision | Rationale | Decided By |
|----------|-----------|------------|
| [Decision 1] | [Why this choice] | User / Analyst |
| [Decision 2] | [Why this choice] | User / Analyst |
```

---

## Output Rules

1. **Traceability** - Link requirements to technical context
2. **Decisions documented** - Record why choices were made
3. **No ambiguity** - Every requirement is clear and testable
4. **User validated** - All gaps resolved with user input

## File Output

Save to: `.claude/ba/[feature-name]/03-enriched-requirements.md`

---

## Next Phase

After enriched requirements validated:

```
/business-analyse:4-specify
```

Phase 4 will create detailed functional specification (FRD).

---

User: $ARGUMENTS
