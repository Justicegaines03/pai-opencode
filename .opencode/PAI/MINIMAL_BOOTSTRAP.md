# Minimal PAI Bootstrap

> Lazy-loading context system for PAI-OpenCode. Core identity + routing only (~20KB). Skills load on-demand via OpenCode native `skill` tool.

---

## What Loads at Session Start (Bootstrap)

This minimal context (~20KB) loads immediately:

1. **Algorithm Core** - How PAI works (OBSERVE→THINK→PLAN→BUILD→EXECUTE→VERIFY→LEARN)
2. **Identity Marker** - Who you are (minimal reference)
3. **Routing Logic** - How to load additional context on-demand

## What Loads On-Demand (Lazy)

Everything else loads via OpenCode `skill` tool when referenced:

| When User Says | Skill Loaded |
|----------------|--------------|
| "Research this topic" | Research SKILL.md |
| "Extract wisdom from video" | KnowledgeExtraction SKILL.md |
| "Create a skill for X" | CreateSkill SKILL.md |
| "Agents discuss this" | Agents SKILL.md |
| "Use Council" | Council SKILL.md |
| "Build CLI tool" | CreateCLI SKILL.md |
| "Process this document" | Documents SKILL.md |

## Using the Skill Tool

OpenCode provides native lazy loading:

```typescript
// In your plugin or handler:
const skill = await skill_find("Research");  // Find skill by name
await skill_use(skill.id);                    // Load skill context
```

**Do NOT** load all skills at session start. Load only when needed.

## User Identity

Your personal context lives in `.opencode/PAI/USER/`:

| File | Purpose |
|------|---------|
| `ABOUTME.md` | Your background and expertise |
| `TELOS/TELOS.md` | Your life goals and mission |
| `DAIDENTITY.md` | Your AI assistant configuration |

These are loaded on-demand via the skill system, not at session start.

---

## Context Routing

See full routing documentation: `CONTEXT_ROUTING.md`

Quick reference:
- **Immediate:** Algorithm, minimal identity
- **On-demand:** Skills via `skill_find`/`skill_use`
- **User context:** Via lazy loading from `PAI/USER/`

---

*This is the minimal bootstrap. Everything else loads when needed.*
