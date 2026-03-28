# Repo Path Sweep Findings (2026-03-28)

## Scope

- Swept active repository content for legacy path drift:
  - `~/.claude`
  - `~/.opencode/skills/PAI/`
  - `~/.opencode/skills/CORE/`
  - `skills/PAI/`
  - `skills/CORE`
- Focused on runtime code, agent definitions, skill workflows, installer/runtime docs, and skill-pack content.

## What Was Fixed

- Runtime/tooling references migrated to OpenCode canonical roots:
  - `.opencode/PAI/Tools/*` now resolves to `~/.opencode` or `OPENCODE_DIR`.
  - Removed remaining `.claude` defaults from active TS tools.
- Agent docs updated from `~/.claude/...` to `~/.opencode/...`.
- Broad skill/workflow path cleanup:
  - `~/.opencode/skills/PAI/USER/...` -> `~/.opencode/PAI/USER/...`
  - `read ~/.opencode/skills/PAI/SKILL.md` -> `read ~/.opencode/PAI/SKILL.md`
  - major `skills/CORE/...` references switched to current PAI docs where safe.
- Cost-aware research skill-pack paths updated to OpenCode conventions.

## Verification Snapshot

- `bun run .opencode/PAI/Tools/algorithm.ts --help`
- `bun run .opencode/PAI/Tools/SessionHarvester.ts --recent 1 --dry-run`
- `bun run .opencode/plugins/handlers/implicit-sentiment.ts`
- `bun run .opencode/plugins/handlers/voice-notification.ts`
- `bun run .opencode/PAI/Tools/pai.ts --help`
- `bun run .opencode/PAI/Tools/SessionProgress.ts --help`
- `bun run .opencode/PAI/Tools/GetCounts.ts`

## Remaining Matches (Intentional)

After sweep, the active `.opencode/` tree is reduced to intentional references only:

- `.opencode/PAISYSTEM/PAI-TO-OPENCODE-MAPPING.md`
  - historical migration mapping table includes `.claude` and old `skills/PAI` paths by design.
- `.opencode/plugins/lib/identity.ts`
  - explanatory comment: "OpenCode uses ~/.opencode/ (not ~/.claude/)".
- `.opencode/skills/Utilities/OpenCodeSystem/SKILL.md`
  - guardrail wording explicitly says "never use ~/.claude".
- `.opencode/skills/Security/WebAssessment/OsintTools/osint-api-tools.py`
  - one remaining fallback default (`PAI_DIR -> ~/.claude`) intentionally deferred in this sweep to avoid large CRLF/LF formatting churn in a Python file.
- `.opencode/MEMORY/WISDOM/architecture.md`
  - anti-pattern example explicitly names hardcoded `~/.claude` path drift.

No actionable runtime/tool/agent path drift remained after this pass.

## Out of Scope for This Sweep

- Legacy-path references that remain in migration/epic/planning docs were left intentionally untouched.
- Those docs preserve historical context and migration guidance and do not affect runtime behavior.
