# Context Routing System

> Lazy-loading context routing for PAI-OpenCode v3.0+

## Architecture Overview

**Before (WP1):** 233KB static context loaded at session start
**After (WP2):** ~20KB bootstrap + on-demand skill loading

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION START                              │
│                     (~20KB load)                              │
├─────────────────────────────────────────────────────────────┤
│  MINIMAL_BOOTSTRAP.md                                       │
│  ├── Algorithm Core (OBSERVE→LEARN)                         │
│  ├── Identity Reference                                     │
│  └── Routing Instructions                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (on-demand)
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │  Skill  │          │  Skill  │          │  Skill  │
   │Research │          │ Agents  │          │ Council │
   └─────────┘          └─────────┘          └─────────┘
        │                     │                     │
        ▼                     ▼                     ▼
   SKILL.md             SKILL.md             SKILL.md
```

## Loading Strategies

### 1. Bootstrap Loading (Immediate)

Loaded at every session start:

| File | Size | Purpose |
|------|------|---------|
| `MINIMAL_BOOTSTRAP.md` | ~5KB | Routing and identity reference |
| Algorithm v3.7.0 | ~15KB | Core 7-phase methodology |
| **Total** | **~20KB** | Essential only |

### 2. Skill Loading (On-Demand)

Use OpenCode native `skill` tool:

```typescript
// Find a skill by name
const researchSkill = await skill_find("Research");

// Use the skill (loads its context)
await skill_use(researchSkill.id);
```

Skills are discovered from `.opencode/skills/<name>/SKILL.md`.

### 3. User Context Loading (On-Demand)

User personal context loads when referenced:

| Context Type | Trigger | Source |
|--------------|---------|--------|
| TELOS (goals, mission) | "My goals", "life purpose" | `PAI/USER/TELOS/TELOS.md` |
| ABOUTME (background) | "As you know about me..." | `PAI/USER/ABOUTME.md` |
| DAIDENTITY (AI config) | "Jeremy", "your name" | `PAI/USER/DAIDENTITY.md` |

## Migration from WP1

### What Changed

| Component | WP1 | WP2 |
|-----------|-----|-----|
| context-loader.ts | ✅ Existed | ❌ Removed |
| Static 233KB load | ✅ Loaded | ❌ No longer loaded |
| skill_find/skill_use | ❌ Not used | ✅ Primary method |
| Bootstrap size | ~214KB | ~20KB |

### Files Deleted

- `.opencode/plugins/handlers/context-loader.ts`
- Related bulk loading utilities

### Files Created

- `.opencode/PAI/MINIMAL_BOOTSTRAP.md`
- `.opencode/PAI/CONTEXT_ROUTING.md` (this file)

## Skill Discovery

OpenCode automatically discovers skills:

```
.opencode/skills/
├── Research/
│   └── SKILL.md
├── Agents/
│   └── SKILL.md
└── CreateCLI/
    └── SKILL.md
```

Each skill's `SKILL.md` contains its full documentation and triggers.

## Caching

Loaded skills are cached for the session duration:

```typescript
// First call loads from disk
await skill_use("Research");  // Loads SKILL.md

// Second call uses cached version
await skill_use("Research");  // Uses cache
```

## Error Handling

When a skill is not found:

```typescript
try {
  const skill = await skill_find("NonExistent");
  if (!skill) {
    // Skill not found - provide helpful error
    log("Skill 'NonExistent' not found. Available skills:");
    // List available skills
  }
} catch (error) {
  // Handle error gracefully
}
```

## Best Practices

1. **Don't preload**: Let skills load on-demand
2. **Reference bootstrap**: Use MINIMAL_BOOTSTRAP.md as the foundation
3. **Skill triggers**: Each skill defines its USE WHEN triggers
4. **Lazy user context**: Load personal context only when referenced
5. **Session cache**: Already-loaded skills persist for the session

## Verification

Check lazy loading is working:

```bash
# 1. Bootstrap should be <25KB
wc -c .opencode/PAI/MINIMAL_BOOTSTRAP.md

# 2. No context-loader.ts
ls .opencode/plugins/handlers/context-loader.ts  # Should fail

# 3. Skill tool available
# (Verified by OpenCode environment)
```

---

*Part of PAI-OpenCode v3.0 Context Modernization (WP2)*
