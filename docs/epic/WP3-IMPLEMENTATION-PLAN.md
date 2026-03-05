# WP3 Implementation Plan: Category Structure - Part A

**Branch:** `feature/wp3-categories-a`
**Duration:** 6-8 hours
**Owner:** Engineer Agent
**Status:** Planning

---

## 🎯 Goal

Transform flat skill structure to hierarchical category structure for 4 categories:
1. **Agents/** - Verify existing category structure
2. **ContentAnalysis/** - NEW category with ExtractWisdom
3. **Investigation/** - NEW category with OSINT + PrivateInvestigator
4. **Media/** - NEW category with Art + Remotion

---

## 📊 Current State vs Target State

### Agents/ (Already a Category ✅)

**Current:**
```
.opencode/skills/Agents/
├── AgentPersonalities.md
├── AgentProfileSystem.md
├── ArchitectContext.md
├── ArtistContext.md
├── CodexResearcherContext.md
├── Data/
├── DeepResearcherContext.md
├── DesignerContext.md
├── EngineerContext.md
├── GeminiResearcherContext.md
├── GrokResearcherContext.md
├── PentesterContext.md
├── PerplexityResearcherContext.md
├── QATesterContext.md
├── REDESIGN-SUMMARY.md
├── Scratchpad/
├── SKILL.md
├── Templates/
├── Tools/
└── Workflows/
```

**Target:** Same structure (already correct)

**Action:** Verify structure matches PAI 4.0.3, no changes needed

---

### ContentAnalysis/ (NEW Category)

**Current:**
```
.opencode/skills/ExtractWisdom/
├── SKILL.md
└── Workflows/
```

**Target:**
```
.opencode/skills/ContentAnalysis/
├── ExtractWisdom/
│   ├── SKILL.md
│   └── Workflows/
└── SKILL.md (NEW - category-level)
```

**Action:**
1. Create `.opencode/skills/ContentAnalysis/` directory
2. Move `ExtractWisdom/` into `ContentAnalysis/`
3. Create category-level `SKILL.md` for ContentAnalysis
4. Update all internal path references

---

### Investigation/ (NEW Category)

**Current:**
```
.opencode/skills/OSINT/
├── CompanyTools.md
├── EntityTools.md
├── EthicalFramework.md
├── Methodology.md
├── PeopleTools.md
├── SKILL.md
└── Workflows/

.opencode/skills/PrivateInvestigator/
├── SKILL.md
└── Workflows/
```

**Target:**
```
.opencode/skills/Investigation/
├── OSINT/
│   ├── CompanyTools.md
│   ├── EntityTools.md
│   ├── EthicalFramework.md
│   ├── Methodology.md
│   ├── PeopleTools.md
│   ├── SKILL.md
│   └── Workflows/
├── PrivateInvestigator/
│   ├── SKILL.md
│   └── Workflows/
└── SKILL.md (NEW - category-level)
```

**Action:**
1. Create `.opencode/skills/Investigation/` directory
2. Move `OSINT/` into `Investigation/`
3. Move `PrivateInvestigator/` into `Investigation/`
4. Create category-level `SKILL.md` for Investigation
5. Update all internal path references

---

### Media/ (NEW Category)

**Current:**
```
.opencode/skills/Art/
├── Examples/
├── HeadshotExamples/
├── Lib/
├── SKILL.md
├── ThumbnailExamples/
├── Tools/
├── Workflows/
└── YouTubeThumbnailExamples/

.opencode/skills/Remotion/
├── ArtIntegration.md
├── CriticalRules.md
├── Patterns.md
├── SKILL.md
├── Tools/
└── Workflows/
```

**Target:**
```
.opencode/skills/Media/
├── Art/
│   ├── Examples/
│   ├── HeadshotExamples/
│   ├── Lib/
│   ├── SKILL.md
│   ├── ThumbnailExamples/
│   ├── Tools/
│   ├── Workflows/
│   └── YouTubeThumbnailExamples/
├── Remotion/
│   ├── ArtIntegration.md
│   ├── CriticalRules.md
│   ├── Patterns.md
│   ├── SKILL.md
│   ├── Tools/
│   └── Workflows/
└── SKILL.md (NEW - category-level)
```

**Action:**
1. Create `.opencode/skills/Media/` directory
2. Move `Art/` into `Media/`
3. Move `Remotion/` into `Media/`
4. Create category-level `SKILL.md` for Media
5. Update all internal path references

---

## 📋 Implementation Steps

### Phase 1: Preparation (30 min)

1. **Create feature branch**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/wp3-categories-a
   ```

2. **Verify current state**
   ```bash
   ls -la .opencode/skills/ | grep -E "(Agents|ExtractWisdom|OSINT|PrivateInvestigator|Art|Remotion)"
   ```

3. **Create backup** (in case we need to rollback)
   ```bash
   # Document current structure
   tree .opencode/skills/ -L 2 > /tmp/pre-wp3-structure.txt
   ```

---

### Phase 2: ContentAnalysis Category (1.5 hours)

**Step 2.1: Create category directory**
```bash
mkdir -p .opencode/skills/ContentAnalysis
```

**Step 2.2: Move ExtractWisdom**
```bash
git mv .opencode/skills/ExtractWisdom .opencode/skills/ContentAnalysis/ExtractWisdom
```

**Step 2.3: Create category-level SKILL.md**
```bash
cat > .opencode/skills/ContentAnalysis/SKILL.md << 'EOF'
---
name: ContentAnalysis
description: Content analysis and wisdom extraction. USE WHEN analyze content, extract insights, process media, understand content.
---

# ContentAnalysis - Content Analysis and Wisdom Extraction

**Category for skills that analyze, extract, and synthesize content.**

## Skills in This Category

| Skill | Purpose | Trigger |
|-------|---------|---------|
| **ExtractWisdom** | Dynamic wisdom extraction from videos, podcasts, articles | "extract wisdom", "analyze video", "key takeaways" |

## When to Use

- Analyzing YouTube videos, podcasts, interviews, articles
- Extracting insights and wisdom from content
- Processing media for key takeaways
- Understanding what's interesting in content

## Category Philosophy

ContentAnalysis skills adapt to the content they process. Instead of static extraction patterns, they detect what wisdom domains exist in the content and build custom sections around them.

## Customization

**Before executing, check for user customizations at:**
`~/.opencode/skills/PAI/USER/SKILLCUSTOMIZATIONS/ContentAnalysis/`

If this directory exists, load and apply any PREFERENCES.md, configurations, or resources found there.
EOF
```

**Step 2.4: Update path references**
- Search for references to `.opencode/skills/ExtractWisdom/`
- Update to `.opencode/skills/ContentAnalysis/ExtractWisdom/`
- Check: SKILL.md files, Workflows, Tools, Documentation

---

### Phase 3: Investigation Category (2 hours)

**Step 3.1: Create category directory**
```bash
mkdir -p .opencode/skills/Investigation
```

**Step 3.2: Move OSINT**
```bash
git mv .opencode/skills/OSINT .opencode/skills/Investigation/OSINT
```

**Step 3.3: Move PrivateInvestigator**
```bash
git mv .opencode/skills/PrivateInvestigator .opencode/skills/Investigation/PrivateInvestigator
```

**Step 3.4: Create category-level SKILL.md**
```bash
cat > .opencode/skills/Investigation/SKILL.md << 'EOF'
---
name: Investigation
description: Investigation and research skills. USE WHEN investigate, research person, company intel, due diligence, OSINT, background check.
---

# Investigation - Research and Investigation Skills

**Category for skills that investigate, research, and gather intelligence.**

## Skills in This Category

| Skill | Purpose | Trigger |
|-------|---------|---------|
| **OSINT** | Open source intelligence gathering | "OSINT", "due diligence", "background check", "research person" |
| **PrivateInvestigator** | Ethical people-finding | "find person", "locate", "reconnect", "people search" |

## When to Use

- Due diligence and background checks
- Company intelligence gathering
- People finding and reconnection
- Open source research
- Ethical investigation

## Category Philosophy

Investigation skills operate within strict ethical frameworks. They gather publicly available information while respecting privacy boundaries and legal constraints.

## Customization

**Before executing, check for user customizations at:**
`~/.opencode/skills/PAI/USER/SKILLCUSTOMIZATIONS/Investigation/`

If this directory exists, load and apply any PREFERENCES.md, configurations, or resources found there.
EOF
```

**Step 3.5: Update path references**
- Search for references to `.opencode/skills/OSINT/`
- Update to `.opencode/skills/Investigation/OSINT/`
- Search for references to `.opencode/skills/PrivateInvestigator/`
- Update to `.opencode/skills/Investigation/PrivateInvestigator/`
- Check: SKILL.md files, Workflows, Tools, Documentation

---

### Phase 4: Media Category (2 hours)

**Step 4.1: Create category directory**
```bash
mkdir -p .opencode/skills/Media
```

**Step 4.2: Move Art**
```bash
git mv .opencode/skills/Art .opencode/skills/Media/Art
```

**Step 4.3: Move Remotion**
```bash
git mv .opencode/skills/Remotion .opencode/skills/Media/Remotion
```

**Step 4.4: Create category-level SKILL.md**
```bash
cat > .opencode/skills/Media/SKILL.md << 'EOF'
---
name: Media
description: Media creation and processing skills. USE WHEN create visuals, generate images, video production, thumbnails, art, illustrations.
---

# Media - Media Creation and Processing

**Category for skills that create, process, and manipulate media content.**

## Skills in This Category

| Skill | Purpose | Trigger |
|-------|---------|---------|
| **Art** | Visual content creation (images, illustrations, diagrams) | "create art", "generate image", "make illustration", "visual content" |
| **Remotion** | Video production and motion graphics | "create video", "motion graphics", "video production", "remotion" |

## When to Use

- Creating visual content (images, illustrations, diagrams)
- Video production and motion graphics
- Thumbnail generation
- Media asset creation
- Visual storytelling

## Category Philosophy

Media skills bridge the gap between technical execution and creative vision. They handle the technical complexity of media creation while allowing the user to focus on creative direction.

## Customization

**Before executing, check for user customizations at:**
`~/.opencode/skills/PAI/USER/SKILLCUSTOMIZATIONS/Media/`

If this directory exists, load and apply any PREFERENCES.md, configurations, or resources found there.
EOF
```

**Step 4.5: Update path references**
- Search for references to `.opencode/skills/Art/`
- Update to `.opencode/skills/Media/Art/`
- Search for references to `.opencode/skills/Remotion/`
- Update to `.opencode/skills/Media/Remotion/`
- Check: SKILL.md files, Workflows, Tools, Documentation

---

### Phase 5: Verification (1 hour)

**Step 5.1: Verify directory structure**
```bash
tree .opencode/skills/ -L 2
```

Expected output:
```
.opencode/skills/
├── Agents/
├── ContentAnalysis/
│   ├── ExtractWisdom/
│   └── SKILL.md
├── Investigation/
│   ├── OSINT/
│   ├── PrivateInvestigator/
│   └── SKILL.md
├── Media/
│   ├── Art/
│   ├── Remotion/
│   └── SKILL.md
└── (other skills...)
```

**Step 5.2: Validate with Biome**
```bash
bun biome check .opencode/skills/
```

**Step 5.3: Test skill discovery**
```bash
# Verify skills are still discoverable
grep -r "name: ExtractWisdom" .opencode/skills/
grep -r "name: OSINT" .opencode/skills/
grep -r "name: PrivateInvestigator" .opencode/skills/
grep -r "name: Art" .opencode/skills/
grep -r "name: Remotion" .opencode/skills/
```

**Step 5.4: Check for broken references**
```bash
# Search for old paths that might have been missed
grep -r "skills/ExtractWisdom/" .opencode/ --include="*.md" --include="*.ts"
grep -r "skills/OSINT/" .opencode/ --include="*.md" --include="*.ts"
grep -r "skills/PrivateInvestigator/" .opencode/ --include="*.md" --include="*.ts"
grep -r "skills/Art/" .opencode/ --include="*.md" --include="*.ts"
grep -r "skills/Remotion/" .opencode/ --include="*.md" --include="*.ts"
```

---

### Phase 6: Documentation Update (30 min)

**Step 6.1: Update ARCHITECTURE-PLAN.md**
- Mark WP3 as complete
- Update status

**Step 6.2: Update README.md**
- Update skill count
- Update category list

**Step 6.3: Create WP3 completion summary**
```bash
cat > docs/epic/WP3-COMPLETION-SUMMARY.md << 'EOF'
# WP3 Completion Summary

**Date:** [DATE]
**Branch:** feature/wp3-categories-a
**Status:** Complete

## Changes Made

### Categories Created

1. **ContentAnalysis/** - NEW category
   - ExtractWisdom moved from root
   - Category-level SKILL.md created

2. **Investigation/** - NEW category
   - OSINT moved from root
   - PrivateInvestigator moved from root
   - Category-level SKILL.md created

3. **Media/** - NEW category
   - Art moved from root
   - Remotion moved from root
   - Category-level SKILL.md created

### Categories Verified

1. **Agents/** - Already correct structure
   - No changes needed
   - Structure matches PAI 4.0.3

## Files Changed

- [List of moved files]
- [List of new SKILL.md files]
- [List of updated path references]

## Verification

- ✅ Directory structure matches target
- ✅ All skills discoverable
- ✅ No broken references
- ✅ Biome validation passes

## Next Steps

- WP4: Category Structure - Part B
EOF
```

---

### Phase 7: Commit and PR (30 min)

**Step 7.1: Commit changes**
```bash
git add .
git commit -m "feat(wp3): Create hierarchical category structure - Part A

- Create ContentAnalysis/ category with ExtractWisdom
- Create Investigation/ category with OSINT + PrivateInvestigator
- Create Media/ category with Art + Remotion
- Verify Agents/ category structure (already correct)
- Add category-level SKILL.md for each new category
- Update all internal path references

Categories created: 3
Skills moved: 5
Category-level SKILL.md created: 3

Part of PAI-OpenCode v3.0 migration (WP3)
Related: #31"
```

**Step 7.2: Push and create PR**
```bash
git push origin feature/wp3-categories-a
gh pr create --repo Steffen025/pai-opencode --base dev --title "feat(wp3): Create hierarchical category structure - Part A" --body "..."
```

---

## 🎯 Success Criteria

- [ ] ContentAnalysis/ category created with ExtractWisdom
- [ ] Investigation/ category created with OSINT + PrivateInvestigator
- [ ] Media/ category created with Art + Remotion
- [ ] Agents/ category verified (no changes needed)
- [ ] Category-level SKILL.md created for each new category
- [ ] All internal path references updated
- [ ] No broken references
- [ ] Biome validation passes
- [ ] Skills still discoverable
- [ ] Documentation updated

---

## ⚠️ Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Broken path references | Comprehensive grep search before commit |
| Skills not discoverable | Test skill discovery after moves |
| Git mv fails | Use manual mv + git add if needed |
| Category SKILL.md incorrect | Follow PAI 4.0.3 patterns |

---

## 📚 References

- `docs/epic/ARCHITECTURE-PLAN.md` - Full v3.0 plan
- `docs/epic/EPIC-v3.0-Synthesis-Architecture.md` - Vision and research
- PAI 4.0.3 - Reference implementation for category structure
