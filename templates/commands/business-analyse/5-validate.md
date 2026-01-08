---
description: Business Analysis Phase 5 - User validation and feedback loop
argument-hint: [feature-name]
---

# Business Analysis - PHASE 5: VALIDATE

**Model: Sonnet (interaction-focused, no deep analysis needed)**

## Mission

Present the FRD to user for validation.
Collect feedback and route to appropriate phase.

---

## Prerequisites

- Phase 4: `.claude/ba/[feature-name]/04-functional-spec.md`

---

## Step 1: Present Summary

Read the FRD and present a concise summary for validation:

```markdown
## Specification Ready for Validation

**Feature**: [Feature Name]
**Version**: 1.0
**Status**: Pending Validation

### Quick Summary

**What it does**:
[2-3 sentences describing the feature]

**Key Requirements**:
1. [Must-have 1]
2. [Must-have 2]
3. [Must-have 3]

**Scope**:
- Included: [brief list]
- Excluded: [brief list]

**Files Created**:
- `.claude/ba/[feature-name]/04-functional-spec.md` (full specification)

---

### Validation Options

Please review and choose:

1. **APPROVED** - Specification is correct, proceed to handoff
2. **MINOR CHANGES** - Small adjustments needed (list them)
3. **MAJOR CHANGES** - Significant changes to requirements (back to Phase 3)
4. **REJECTED** - Start over with different approach
```

---

## Step 2: Process Feedback

Based on user response:

### Option 1: APPROVED

```markdown
## Validation Complete

**Status**: APPROVED
**Validated by**: [User]
**Date**: [Date]

Proceeding to Phase 6 (Handoff).

Next command:
/business-analyse:6-handoff [feature-name]
```

Update FRD status to "Validated".

### Option 2: MINOR CHANGES

```markdown
## Minor Changes Requested

**Changes**:
1. [Change 1]
2. [Change 2]

I'll update the specification now...
```

Apply changes directly to `04-functional-spec.md`, then re-present for validation.

**DO NOT go back to Phase 3 for minor changes.**

### Option 3: MAJOR CHANGES

```markdown
## Major Changes Required

**Reason**: [User explanation]

**Impact**: Requirements need re-analysis

Returning to Phase 3 to re-analyze with new information.

Next command:
/business-analyse:3-analyse [feature-name]
```

Save feedback to: `.claude/ba/[feature-name]/05-feedback-v[N].md`

### Option 4: REJECTED

```markdown
## Specification Rejected

**Reason**: [User explanation]

**Options**:
1. Start fresh with `/business-analyse:1-discover [new-request]`
2. Archive this attempt and discuss alternative approach

What would you like to do?
```

Move folder to: `.claude/ba/_archived/[feature-name]-[date]/`

---

## Step 3: Update Status

After validation, update the FRD header:

```markdown
| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | **Validated** |
| Validated By | [User] |
| Validation Date | [Date] |
```

---

## Feedback Log Template

For MAJOR CHANGES, save feedback:

```markdown
# Validation Feedback: [Feature Name]

| Field | Value |
|-------|-------|
| Version | [N] |
| Date | [Date] |
| Result | Major Changes |

## Changes Requested

1. **[Area]**: [What needs to change]
   - Current: [What spec says]
   - Requested: [What user wants]

2. **[Area]**: [What needs to change]
   - Current: [What spec says]
   - Requested: [What user wants]

## Impact Analysis

- [ ] Affects scope
- [ ] Affects data model
- [ ] Affects UI
- [ ] Affects permissions
- [ ] Affects API

## Next Steps

Return to Phase 3 with this context.
```

---

## Validation Checklist

Present to user if they want guided validation:

```markdown
## Validation Checklist

### Functional Completeness
- [ ] All user needs are addressed
- [ ] No missing requirements
- [ ] Business rules are accurate

### Scope Accuracy
- [ ] In-scope items are correct
- [ ] Out-of-scope items are acceptable
- [ ] No scope creep

### UI/UX (if applicable)
- [ ] Layout matches expectations
- [ ] Interactions are intuitive
- [ ] Navigation is logical

### Data (if applicable)
- [ ] Data model is correct
- [ ] Relationships make sense
- [ ] No missing fields

### Acceptance Criteria
- [ ] Criteria are clear
- [ ] Criteria are testable
- [ ] Criteria match requirements
```

---

## Output Rules

1. **Concise presentation** - Don't dump the entire FRD
2. **Clear options** - Make next steps obvious
3. **Fast iteration** - Minor changes applied immediately
4. **Audit trail** - Save feedback for major changes

## File Outputs

- Update: `.claude/ba/[feature-name]/04-functional-spec.md` (status)
- Create (if major changes): `.claude/ba/[feature-name]/05-feedback-v[N].md`

---

## Next Phase

After APPROVED:

```
/business-analyse:6-handoff [feature-name]
```

Phase 6 will generate the implementation prompt.

---

User: $ARGUMENTS
