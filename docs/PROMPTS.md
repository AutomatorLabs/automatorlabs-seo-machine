# Prompts

## Default Workflow Prompt

```text
You are working in the AutomatorLabs Astro repository.

Before making changes:
1. Read /docs/README.md first, then follow the read order listed there.
2. Verify the relevant source files directly before trusting any count or workflow note.
3. Summarize your understanding of the project and the requested change.
4. Create a short implementation plan with risks, affected files, and verification steps.
5. Wait for approval before editing code unless the user explicitly asked you to execute immediately.

After approval:
6. Implement the change.
7. Run the relevant build/tests/audits.
8. Update /docs if architecture, SEO behavior, product scope, content counts, or workflow changed.
9. Summarize exactly what changed and what was verified.

Rules:
- Do not invent features that are not in the repo.
- Mark uncertain conclusions as "Needs confirmation".
- Do not modify unrelated files.
```

## Bug Fixing Prompt

```text
Read /docs first, then inspect the failing route, component, data source, or helper.
Summarize the bug, likely cause, and smallest safe fix.
Wait for approval before editing unless the user explicitly asked you to proceed.
After implementation, run the narrowest relevant verification plus any impacted build/tests.
Update /docs only if the fix changes expected behavior or workflow.
```

## SEO Improvement Prompt

```text
Read /docs/SEO.md and /docs/ARCHITECTURE.md first.
Inspect the current metadata, schema, canonicals, sitemap, robots, internal linking, tests, and audit script before proposing changes.
Summarize:
- current SEO behavior
- gaps
- recommended implementation
- affected routes, components, and data files
Wait for approval before editing unless the user explicitly asked you to proceed.
After implementation, run build, SEO audit, and any relevant Playwright coverage, then update the docs.
```

## New Calculator Prompt

```text
Read /docs first.
Inspect src/data/calculators.ts, src/data/content.ts, src/data/calculator-categories.ts, shared calculator components, related-link helpers, tests, and at least one similar existing calculator.
Summarize:
- where the new calculator fits
- required data/config updates
- required route/component changes
- SEO and internal-linking implications
- test/doc updates needed
Wait for approval before editing unless the user explicitly asked you to proceed.
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
Wait for approval before editing unless the user explicitly asked you to proceed.
After implementation, verify behavior and update /docs if architectural conventions changed.
```

## Documentation Update Prompt

```text
Read all files in /docs first.
Identify which docs are stale relative to the current source.
Summarize proposed documentation updates and the source files used to verify them.
Unless asked otherwise, only edit files in /docs.
Keep updates concise, factual, and AI-friendly.
Update counts when the source has changed, and mark deployment or business claims as "Needs confirmation" unless the repo proves them.
```
