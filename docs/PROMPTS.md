# Prompts

## Default Workflow Prompt

```text
You are working in the AutomatorLabs Astro repository.

Before making changes:
1. Read /docs/README.md, /docs/PROJECT.md, /docs/ARCHITECTURE.md, /docs/SEO.md, and /docs/TASKS.md.
2. Summarize your understanding of the project and the requested change.
3. Create a short implementation plan with risks, affected files, and verification steps.
4. Wait for approval before editing code.

After approval:
5. Implement the change.
6. Run the relevant build/tests/audits.
7. Update /docs if architecture, SEO behavior, product scope, or workflow changed.
8. Summarize exactly what changed and what was verified.

Rules:
- Do not invent features that are not in the repo.
- Mark uncertain conclusions as "Needs confirmation".
- Do not modify unrelated files.
```

## Bug Fixing Prompt

```text
Read /docs first, then inspect the failing route/component/data source.
Summarize the bug, likely cause, and smallest safe fix.
Wait for approval before editing.
After implementation, run the narrowest relevant verification plus any impacted build/tests.
Update /docs only if the fix changes expected behavior or workflow.
```

## SEO Improvement Prompt

```text
Read /docs/SEO.md and /docs/ARCHITECTURE.md first.
Inspect the current metadata, schema, canonicals, sitemap, robots, internal linking, tests, and scripts before proposing changes.
Summarize:
- current SEO behavior
- gaps
- recommended implementation
- affected routes/components/data files
Wait for approval before editing.
After implementation, run build, SEO audit, and any relevant Playwright coverage, then update /docs/SEO.md.
```

## New Calculator Prompt

```text
Read /docs first.
Inspect src/data/calculators.ts, src/data/content.ts, src/data/calculator-categories.ts, shared calculator components, related-link helpers, tests, and any similar existing calculator.
Summarize:
- where the new calculator fits
- required data/config updates
- required route/component changes
- SEO and internal-linking implications
- test/doc updates needed
Wait for approval before editing.
After implementation, run build/tests and update /docs if scope or workflow changed.
```

## Refactoring Prompt

```text
Read /docs/ARCHITECTURE.md first.
Identify the current architecture around the target area, then propose a refactor plan that preserves behavior.
Include:
- why the refactor is needed
- files affected
- migration risk
- verification plan
Wait for approval before editing.
After implementation, verify behavior and update /docs if architectural conventions changed.
```

## Documentation Update Prompt

```text
Read all files in /docs first.
Identify which docs are stale relative to the current source.
Summarize proposed documentation updates and the source files used to verify them.
Unless asked otherwise, only edit files in /docs.
Keep updates concise, factual, and AI-friendly.
```
