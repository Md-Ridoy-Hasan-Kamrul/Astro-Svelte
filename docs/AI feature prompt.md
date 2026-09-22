# AI feature prompt (Astro + Svelte)

Copy this block into chat when asking the AI to implement a page/component.  
Replace the `[Insert …]` placeholders. This stack is **Astro + Svelte 5** — not React.

---

```md
# Role & Prerequisites
Act as a Principal Frontend Architect (10+ years of experience). Before writing any code, you MUST read and fully understand:
1. `README.md` (Strictly follow **Section 5 — Engineering Rules** and **Section 6 — Code Quality Standards**).
2. `docs/Rules for Svelte code quality.md` (Adhere to Svelte 5 runes, Astro islands, pure components, and the A–Z checklist).
3. The provided Figma design: [Insert Figma Link] (Analyze UI/UX, states, and layouts thoroughly before starting). If no Figma link is given, match the existing landing visual system in `src/styles/global.css` and nearby sections.

# Task
Implement the [Insert Page/Component Name] strictly in accordance with the Figma design (or existing design system). Ensure a pixel-perfect, production-ready implementation for this Astro + Svelte codebase.

# Execution Rules & Constraints
- **Stack:** Astro pages/layouts/sections + Svelte 5 islands only. No React, no Jest, no `sonner` (use `svelte-sonner`).
- **Responsiveness:** Fully responsive across Desktop, Laptop (~1020px), Tablet (768px), Mobile L (425px), Mobile M (375px), Mobile S (320px).
- **Isolation:** Do NOT modify or break unrelated files. Keep changes scoped to this feature.
- **Test-Driven Development (TDD):** Write comprehensive Vitest unit/integration tests FIRST, then implement. Use Playwright only if the task needs full-page E2E.
- **Code Quality:** One level of abstraction per function; put business logic in `lib/` / stores / small helpers; avoid magic numbers; keep folder architecture from `README.md`.
- **Data roles:** Axios = HTTP; TanStack Query = server cache; Zustand = client UI status only; toasts via `svelte-sonner`.

# Output Directive & Self-Review
Follow this strict order for your response:
1. **Analysis:** Briefly list architectural mistakes you will avoid and confirm alignment with `README.md` Sections 5–6 and `docs/Rules for Svelte code quality.md`.
2. **Tests:** Provide the comprehensive tests first.
3. **Implementation:** Provide the production-ready code.
4. **Final Validation:** After generating the code, you MUST explicitly answer this exact question: *"Does this code perfectly follow the 'One level of abstraction per function' rule from my Svelte Code Quality rules? Identify if there are any magic numbers or mixed abstractions here."* If you find any issues during this self-review, refactor the code immediately before finishing your response.
```

---

## Short version (quick tasks)

```md
Read README.md (sections 5–6) + docs/Rules for Svelte code quality.md.
Implement [feature] with TDD (Vitest first). Astro + Svelte 5 only. Scoped changes. Responsive 320–desktop. End with the one-level-of-abstraction + magic-numbers self-review.
```
