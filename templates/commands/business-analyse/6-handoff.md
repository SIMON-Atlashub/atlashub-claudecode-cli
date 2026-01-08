---
description: Business Analysis Phase 6 - Generate implementation prompt for Claude Code
argument-hint: [feature-name]
---

# Business Analysis - PHASE 6: HANDOFF

**You need to always ULTRA THINK.**

**Audience: CLAUDE CODE**
**Purpose: ONESHOT implementation**
**Language: ENGLISH (reduces tokens, better model performance)**

---

## Prerequisites

- Phase 4 (Validated): `.claude/ba/[feature-name]/04-functional-spec.md`

---

## Mission

Transform validated FRD into precise implementation instructions.
Output must be executable by Claude Code without ambiguity.

---

## Format Rules

1. **Diff-like syntax** - CREATE/MODIFY/DELETE with exact paths
2. **Line references** - Always include line numbers for modifications
3. **Copy patterns** - Point to template files, don't describe
4. **Ordered steps** - Dependencies must be clear
5. **Commands included** - CLI commands to run
6. **English only** - Better token efficiency and model comprehension

---

## Implementation Brief Template

```markdown
# IMPLEMENTATION BRIEF: [Feature Name]

## Context

**Feature**: [Name]
**Spec**: .claude/ba/[feature-name]/04-functional-spec.md
**Branch**: feature/[feature-name]

---

## Prerequisites

- [ ] Branch created from develop
- [ ] Dependencies: [none | list]

---

## Files

### Backend

CREATE `src/Domain/Entities/[Entity].cs`
  COPY: `src/Domain/Entities/[ExistingEntity].cs`
  CHANGE: class name, properties per spec section 3
  KEEP: audit fields (CreatedAt, UpdatedAt, IsDeleted)

CREATE `src/Infrastructure/Data/Configurations/[Entity]Configuration.cs`
  COPY: `src/Infrastructure/Data/Configurations/[Existing]Configuration.cs`
  CHANGE: table name "[Entities]", column configs per spec section 3

MODIFY `src/Infrastructure/Data/AppDbContext.cs`
  AT: line [X] (after last DbSet)
  ADD:
  ```csharp
  public DbSet<[Entity]> [Entities] => Set<[Entity]>();
  ```

CREATE `src/Application/DTOs/[Entity]Dto.cs`
  COPY: `src/Application/DTOs/[Existing]Dto.cs`
  CHANGE: properties per spec section 8

CREATE `src/Application/Services/[Entity]Service.cs`
  COPY: `src/Application/Services/[Existing]Service.cs`
  CHANGE: entity type, method implementations
  IMPLEMENT: business rules from spec section 2

CREATE `src/Api/Controllers/[Entity]Controller.cs`
  COPY: `src/Api/Controllers/[Existing]Controller.cs`
  CHANGE: route "[entities]", service injection
  PERMISSIONS: per spec section 6
    - GET: [entity].view
    - POST: [entity].create
    - PUT: [entity].edit
    - DELETE: [entity].delete

### Frontend

CREATE `src/app/[module]/[feature]/[feature].component.ts`
  RUN FIRST: `ng generate component [module]/[feature] --skip-tests`
  COPY PATTERN: `src/app/[existing]/[existing].component.ts`
  IMPLEMENT: UI logic per spec section 4

CREATE `src/app/[module]/[feature]/[feature].component.html`
  COPY PATTERN: `src/app/[existing]/[existing].component.html`
  IMPLEMENT: layout per spec section 4

CREATE `src/app/[module]/services/[feature].service.ts`
  RUN FIRST: `ng generate service [module]/services/[feature]`
  COPY PATTERN: `src/app/[existing]/services/[existing].service.ts`
  ENDPOINTS: per spec section 8
    - getAll() → GET /api/[entities]
    - getById(id) → GET /api/[entities]/{id}
    - create(dto) → POST /api/[entities]
    - update(id, dto) → PUT /api/[entities]/{id}
    - delete(id) → DELETE /api/[entities]/{id}

MODIFY `src/app/[module]/[module]-routing.module.ts`
  AT: line [X] (routes array)
  ADD:
  ```typescript
  {
    path: '[feature]',
    component: [Feature]Component,
    canActivate: [PermissionGuard],
    data: { permission: '[entity].view' }
  }
  ```

MODIFY `src/app/core/navigation/menu.config.ts`
  AT: line [X] (after related menu item)
  ADD: per spec section 5

### Database

MIGRATION:
```bash
dotnet ef migrations add Add[Entity]Table -p src/Infrastructure -s src/Api
```

EXPECTED SCHEMA (verify migration matches):
```sql
CREATE TABLE [dbo].[[Entities]] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    -- columns per spec section 3
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0
);
```

### Permissions

SEED DATA (add to migration or seed script):
```sql
INSERT INTO Permissions (Key, Name, Module) VALUES
('[entity].view', 'View [Entity]', '[module]'),
('[entity].create', 'Create [Entity]', '[module]'),
('[entity].edit', 'Edit [Entity]', '[module]'),
('[entity].delete', 'Delete [Entity]', '[module]');
```

---

## Execution Order

Execute in this exact order:

```bash
# 1. Backend entities and configuration
# Create: Entity, Configuration, DTO, Service, Controller

# 2. Database migration
dotnet ef migrations add Add[Entity]Table -p src/Infrastructure -s src/Api
dotnet ef database update -p src/Infrastructure -s src/Api

# 3. Backend build verification
dotnet build src/Api

# 4. Frontend components
ng generate component [module]/[feature] --skip-tests
ng generate service [module]/services/[feature]
# Implement component and service

# 5. Frontend build verification
npm run build
npm run lint

# 6. Seed permissions (if not in migration)
# Execute SQL or run seed command
```

---

## Verification Checklist

```bash
# Build checks
dotnet build          # 0 errors
npm run build         # 0 errors
npm run lint          # 0 warnings (or acceptable)

# Runtime checks (manual)
# - Navigate to /[module]/[feature]
# - Create new item → appears in list
# - Edit item → changes saved
# - Delete item → removed (soft delete)
# - Test without permission → access denied
```

---

## Acceptance Criteria Mapping

| AC ID | Implementation | Verify |
|-------|----------------|--------|
| AC-01 | [Component/Method] | [How to test] |
| AC-02 | [Component/Method] | [How to test] |

---

## Constraints

**DO NOT:**
- Modify files not listed above
- Change existing entity properties
- Remove existing permissions
- Skip permission checks
- Add features not in spec

**MUST:**
- Follow existing naming conventions
- Include audit fields
- Apply soft-delete pattern
- Add proper error handling
- Match existing code style
```

---

## Compact Format (Simple Features)

For simple features, use condensed format:

```markdown
# IMPL: [Feature Name]

## Files

MODIFY `[file path]`
  AT: line [X]
  ADD: [code block]
  PATTERN: see `[reference file]:[lines]`

MODIFY `[file path]`
  AT: line [X]
  CHANGE: [what to change]

## Commands

```bash
[build/test commands]
```

## Verify

- [ ] [check 1]
- [ ] [check 2]
```

---

## Output Rules

1. **EXACT PATHS** - No placeholders like "src/..."
2. **LINE NUMBERS** - Always specify where to modify
3. **COPY PATTERNS** - Reference existing code, don't describe patterns
4. **ORDERED STEPS** - Backend before frontend, generate before modify
5. **RUNNABLE COMMANDS** - Include all CLI commands
6. **ENGLISH ONLY** - No French, better token efficiency

## File Output

Save to: `.claude/ba/[feature-name]/06-implementation-brief.md`

---

## Execution

After handoff is complete, user can execute with:

```
/implement .claude/ba/[feature-name]/06-implementation-brief.md
```

Or for simpler features:

```
/oneshot [paste brief content]
```

---

## BA Workflow Complete

```
Phase 1: DISCOVER  ✓ → 01-business-requirements.md
Phase 2: EXPLORE   ✓ → 02-technical-context.md
Phase 3: ANALYSE   ✓ → 03-enriched-requirements.md
Phase 4: SPECIFY   ✓ → 04-functional-spec.md
Phase 5: VALIDATE  ✓ → (feedback files if any)
Phase 6: HANDOFF   ✓ → 06-implementation-brief.md

Ready for implementation.
```

---

User: $ARGUMENTS
