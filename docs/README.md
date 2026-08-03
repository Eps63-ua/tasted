# Tasted documentation

This folder is the durable product and engineering context for Tasted. Coding agents must read the relevant documents before making changes.

## Product

- [`PRODUCT_SPEC.md`](PRODUCT_SPEC.md): goals, concepts, behavior, screens, and MVP boundaries.
- [`DECISIONS.md`](DECISIONS.md): approved architecture and product decisions.
- [`ROADMAP.md`](ROADMAP.md): ordered implementation milestones and completion checklist.

## Design

- [`UI_DESIGN.md`](UI_DESIGN.md): design tokens, components, layouts, states, and Android behavior.
- [`FIGMA_REFERENCE.md`](FIGMA_REFERENCE.md): what is reusable from the generated Figma prototype and what must be discarded.

## Engineering

- [`DATABASE_DESIGN.md`](DATABASE_DESIGN.md): relational model, ownership, RLS, storage, indexes, and deletion rules.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): folders, routes, data flow, state management, and dependency boundaries.
- [`TESTING.md`](TESTING.md): automated and manual quality strategy.
- [`SECURITY.md`](SECURITY.md): secrets, authorization, privacy, storage, and destructive operations.
- [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md): safe Git habits and commit workflow.

## Agent-assisted development

- [`CODEX_WORKFLOW.md`](CODEX_WORKFLOW.md): exact workflow for planning, implementing, reviewing, testing, and committing with Codex.
- [`PROMPT_LIBRARY.md`](PROMPT_LIBRARY.md): reusable prompts for common tasks.
- [`GLOSSARY.md`](GLOSSARY.md): plain-language explanations of project terminology.

## Reading order for a new coding session

1. `../AGENTS.md`
2. `PRODUCT_SPEC.md`
3. `DECISIONS.md`
4. The specialized document for the task
5. `ROADMAP.md`
