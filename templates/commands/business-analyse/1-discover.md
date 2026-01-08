---
description: Business Analysis Phase 1 - Initial elicitation and similarity detection
argument-hint: <user-request>
---

# Business Analysis - PHASE 1: DISCOVER

**You need to always ULTRA THINK.**

## Mission

Transform vague user request into clear business requirements.
Detect if similar functionality already exists before proceeding.

**NO technical details. NO solution design. Just understand the NEED.**

---

## Step 1: Similarity Check

**FIRST**, launch the `ba-similarity` agent to detect existing features:

```
Task: ba-similarity
Prompt: Check if this request overlaps with existing features: [user request]
```

### Similarity Results

| Result | Action |
|--------|--------|
| **DUPLICATE** | STOP - Reference existing spec, ask user if they want modifications |
| **EXTEND** | Note existing feature to extend in Phase 2 |
| **NEW** | Proceed with elicitation |

---

## Step 2: Elicitation Questions

Ask ONLY relevant questions based on request type. **Max 5 questions.**

### Question Matrix

| Request Type | Questions |
|--------------|-----------|
| **New feature** | Goal? Trigger? Expected outcome? Who uses it? |
| **Enhancement** | Current pain? What's missing? Desired improvement? |
| **Bug/Issue** | What happens now? What should happen? Steps to reproduce? |
| **UI change** | Who sees it? When? What action does it enable? |
| **Data/Report** | What data? What decisions does it support? Frequency? |

### Output Format

```markdown
## Clarifications Needed

1. **Goal**: What problem are you trying to solve?
2. **[Contextual question based on type]**
3. **[Contextual question based on type]**
4. **Scope**: Is [X] included or excluded?
5. **Priority**: Must-have vs nice-to-have?
```

**WAIT for user answers before proceeding.**

---

## Step 3: Business Requirements

After user answers, formalize the NEED (not the solution):

```markdown
# Business Requirements: [Feature Name]

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Draft |
| Phase | DISCOVER |

---

## Problem Statement

[1-2 sentences: the pain point or opportunity]

## Goal

[What success looks like from user perspective]

## Scope

### In Scope
- [Capability 1]
- [Capability 2]

### Out of Scope
- [Explicitly excluded]

## Requirements (MoSCoW)

### Must Have
- [Essential requirement - user language]
- [Essential requirement - user language]

### Should Have
- [Important but not critical]

### Could Have
- [Nice to have]

### Won't Have (this version)
- [Explicitly deferred]

## Business Rules

- [Rule 1: If X then Y]
- [Rule 2: Only when Z]

## Acceptance Criteria (User Language)

- [ ] User can [action] and sees [result]
- [ ] When [condition], system [behavior]

---

## Similarity Check Result

- [ ] NEW - No existing similar feature
- [ ] EXTEND - Builds on: [existing feature]
- [ ] Related to: [feature for reference]
```

---

## Output Rules

1. **User language** - No technical jargon
2. **WHAT not HOW** - Requirements, not solutions
3. **Testable** - Each requirement must be verifiable
4. **Prioritized** - MoSCoW classification

## File Output

Save to: `.claude/ba/[feature-name]/01-business-requirements.md`

---

## Next Phase

After user validates business requirements:

```
/business-analyse:2-explore
```

Phase 2 will analyze technical context to enrich these requirements.

---

User: $ARGUMENTS
