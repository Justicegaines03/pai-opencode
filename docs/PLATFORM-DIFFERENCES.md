# Platform Differences: Claude Code vs OpenCode

**Critical differences that affect PAI behavior and must be accounted for in the port.**

---

## Overview

PAI was originally built for Claude Code. When porting to OpenCode, certain platform differences require adaptation. This document catalogs those differences and how PAI-OpenCode handles them.

---

## 1. Bash Tool: workdir Parameter (CRITICAL)

### The Difference

| Platform | Behavior |
|----------|----------|
| **Claude Code** | `cd` persists across bash calls within a session |
| **OpenCode** | Each `bash()` call spawns a NEW shell — `cd` has NO persistent effect |

### The Solution

**Use the `workdir` parameter for all commands that must run in a different directory.**

```typescript
// WRONG in OpenCode
bash({ command: "cd /repo && git status" })

// CORRECT in OpenCode
bash({ command: "git status", workdir: "/repo" })
```

### Impact on PAI

- **Algorithm:** Must use `workdir` when working outside `Instance.directory`
- **Multi-repo workflows:** Explicit directory specification required
- **Plugin validation:** Can detect missing `workdir` for external paths

**See:** [ADR-008](architecture/adr/ADR-008-opencode-bash-workdir-parameter.md)

---

## 2. Hooks vs Plugins

### The Difference

| Platform | Mechanism | Execution |
|----------|-----------|-----------|
| **Claude Code** | Subprocess hooks (`.claude/hooks/*.hook.ts`) | External process, stdout capture |
| **OpenCode** | In-process plugins (`~/.opencode/plugins/*.ts`) | Same process, direct API |

### The Solution

**Migrate hooks to OpenCode plugins with event handlers.**

```typescript
// Claude Code hook
export default async function(context) {
  // Hook logic
}

// OpenCode plugin
export default {
  name: "pai-core",
  onSessionStart: async (context) => { /* ... */ },
  onToolCall: async (tool, args) => { /* ... */ },
}
```

### Impact on PAI

- **6 hooks migrated** to plugins (context-loader, security-validator, voice-notification, etc.)
- **Event-driven architecture** replaces hook-based
- **File-based logging** to prevent TUI corruption

**See:** [ADR-001](architecture/adr/ADR-001-hooks-to-plugins-architecture.md), [ADR-004](architecture/adr/ADR-004-plugin-logging-file-based.md)

---

## 3. Directory Structure

### The Difference

| Platform | Directory | Config File |
|----------|-----------|-------------|
| **Claude Code** | `~/.claude/` | `settings.json` |
| **OpenCode** | `~/.opencode/` | `opencode.json` |

### The Solution

**Use `.opencode/` for all PAI-OpenCode files.**

```
~/.opencode/
├── PAI/              # Core PAI system
├── skills/           # Skills (SKILL.md structure)
├── agents/           # Agent definitions
├── plugins/          # OpenCode plugins
├── MEMORY/           # Session history, learning
└── opencode.json     # OpenCode config
```

### Impact on PAI

- **All paths updated** from `.claude/` to `.opencode/`
- **Dual config files:** `settings.json` (PAI) + `opencode.json` (OpenCode)
- **Symlink support** for existing OpenCode users

**See:** [ADR-002](architecture/adr/ADR-002-directory-structure-claude-to-opencode.md), [ADR-005](architecture/adr/ADR-005-configuration-dual-file-approach.md)

---

## 4. Agent Swarms

### The Difference

| Platform | Status | Feature |
|----------|--------|---------|
| **Claude Code** | ✅ Released (Feb 2026) | Agent Teams, TeammateTool, shared tasks |
| **OpenCode** | ❌ Not implemented | GitHub issues #12661, #12711, PR #7756 (open) |

### The Solution

**Use OpenCode's Task tool with sequential subagents.**

```typescript
// Claude Code: Agent Teams
TeammateTool({ team_name: "research-team", message: "..." })

// OpenCode: Sequential subagents
Task({ subagent_type: "Researcher", prompt: "..." })
```

### Impact on PAI

- **No parallel agent swarms** in PAI-OpenCode v3.0
- **Sequential subagents** via Task tool
- **Monitor PR #7756** for future "subagent-to-subagent delegation"

**See:** [EPIC-v3.0-Synthesis-Architecture.md](epic/EPIC-v3.0-Synthesis-Architecture.md) Section 1

---

## 5. Model Tiers

### The Difference

| Platform | Native Support | Implementation |
|----------|----------------|----------------|
| **Claude Code** | ❌ No | Would require custom routing |
| **OpenCode** | ⚠️ Partial | Custom fork with `model_tier` parameter |

### The Solution

**Use custom OpenCode binary with Model Tier support.**

```json
// opencode.json
{
  "agent": {
    "Engineer": {
      "model": "opencode/kimi-k2.5",
      "model_tiers": {
        "quick": { "model": "opencode/glm-4.7" },
        "standard": { "model": "opencode/kimi-k2.5" },
        "advanced": { "model": "opencode/claude-sonnet-4.5" }
      }
    }
  }
}
```

### Impact on PAI

- **Custom binary required** for PAI-OpenCode v3.0
- **60x cost savings** with tier routing
- **Production-ready** (battle-tested for months)

**See:** [EPIC-v3.0-Synthesis-Architecture.md](epic/EPIC-v3.0-Synthesis-Architecture.md) Section "Model Tiers"

---

## 6. Lazy Loading

### The Difference

| Platform | Mechanism | Context Size |
|----------|-----------|--------------|
| **Claude Code** | Static context loading | 233KB at session start |
| **OpenCode** | Native `skill` tool | On-demand, ~20KB bootstrap |

### The Solution

**Use OpenCode's native skill discovery and lazy loading.**

```typescript
// OpenCode-native skill discovery
const skills = await skill_find({ pattern: "research" });
await skill_use({ name: "research", action: "deepResearch" });
```

### Impact on PAI

- **Remove static context loader** (233KB → 20KB)
- **Use native skill tool** for on-demand loading
- **Faster session startup** (<3 seconds)

**See:** [EPIC-v3.0-Synthesis-Architecture.md](epic/EPIC-v3.0-Synthesis-Architecture.md) WP2

---

## 7. Event System

### The Difference

| Platform | Events | Hook Points |
|----------|--------|-------------|
| **Claude Code** | Limited | Pre/post tool, session start/end |
| **OpenCode** | 20+ events | session, tool, file, message, compaction, etc. |

### The Solution

**Use OpenCode's native event system for plugin triggers.**

```typescript
// OpenCode events
onSessionStart, onSessionEnd, onToolCall, onFileChange,
onMessageUpdate, onContextCompaction, ...
```

### Impact on PAI

- **Richer event coverage** for plugin triggers
- **Replace hooks with events** (cleaner architecture)
- **Context compaction hook** for learning extraction

**See:** [PLUGIN-SYSTEM.md](PLUGIN-SYSTEM.md)

---

## Summary Table

| Feature | Claude Code | OpenCode | PAI-OpenCode Solution |
|---------|-------------|----------|----------------------|
| **Bash workdir** | `cd` persists | `workdir` param | Use `workdir` explicitly |
| **Hooks** | Subprocess | In-process plugins | Migrate to plugins |
| **Directory** | `.claude/` | `.opencode/` | Use `.opencode/` |
| **Agent Swarms** | ✅ Yes | ❌ No | Sequential Task tool |
| **Model Tiers** | ❌ No | ⚠️ Custom fork | Custom binary |
| **Lazy Loading** | Static | Native skill tool | Use native discovery |
| **Events** | Limited | 20+ events | Use native events |

---

## Migration Checklist

When porting PAI features to OpenCode:

- [ ] Check for `cd` usage in bash calls → use `workdir`
- [ ] Migrate hooks to plugin event handlers
- [ ] Update paths from `.claude/` to `.opencode/`
- [ ] Use Task tool instead of Agent Teams
- [ ] Configure Model Tiers in `opencode.json`
- [ ] Use native skill tool for lazy loading
- [ ] Map hooks to OpenCode events

---

## References

- [ADR-001: Hooks to Plugins](architecture/adr/ADR-001-hooks-to-plugins-architecture.md)
- [ADR-002: Directory Structure](architecture/adr/ADR-002-directory-structure-claude-to-opencode.md)
- [ADR-004: Plugin Logging](architecture/adr/ADR-004-plugin-logging-file-based.md)
- [ADR-005: Dual Config](architecture/adr/ADR-005-configuration-dual-file-approach.md)
- [ADR-008: Bash workdir](architecture/adr/ADR-008-opencode-bash-workdir-parameter.md)
- [EPIC-v3.0-Synthesis-Architecture](epic/EPIC-v3.0-Synthesis-Architecture.md)

---

*Last updated: 2026-03-05*
*Status: Complete for v3.0 migration*
