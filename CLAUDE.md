# Expense Tracker

## Project Overview

A personal expense tracker web app built with React. Users can add expenses via a form, view them in a table, and see spending visualized on a dashboard with a pie chart (by category) and a bar chart (by month).

## Tech Stack

- **Framework:** React (with Vite)
- **Language:** JavaScript (JSX)
- **Charts:** Recharts
- **Styling:** CSS Modules (one `.module.css` per component)
- **State Management:** React hooks (`useState`, `useEffect`, `useContext`)
- **Storage:** localStorage (no backend)

## Project Structure

```
src/
  components/       # Reusable UI components
    ExpenseForm.jsx
    ExpenseTable.jsx
    Dashboard.jsx
    PieChart.jsx
    BarChart.jsx
    common/         # Shared components (Button, Input, Card, etc.)
  context/          # React Context for global expense state
    ExpenseContext.jsx
  utils/            # Helper functions (formatting, date math, category lists)
  App.jsx
  main.jsx
  index.css         # Global styles and CSS variables
```

## Code Style & Conventions

- **Comments:** Add clear comments explaining *why* code exists, not just *what* it does. Comment every component's purpose and any non-obvious logic.
- **Components:** Keep components small and reusable. Extract repeated UI into `components/common/`.
- **Naming:** PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants.
- **Props:** Destructure props in function signatures. Use default values where sensible.
- **Functions:** Prefer `const` arrow functions for components and handlers.
- **Imports:** Group imports: React/libraries first, then components, then utils/context, then styles.
- **Files:** One component per file. File name matches the component name.

## Data Model

Each expense object:

```js
{
  id: crypto.randomUUID(),      // unique identifier
  description: "Groceries",     // string, required
  amount: 52.30,                // number, required, > 0
  category: "Food",             // string from predefined list
  date: "2026-02-12"            // ISO date string, required
}
```

### Categories

Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Shopping, Other

## Key Features

1. **Expense Form** — Add new expenses with description, amount, category, and date. Validate inputs before saving.
2. **Expense Table** — Display all expenses sorted by date (newest first). Support deleting entries.
3. **Dashboard** — Pie chart showing spending by category. Bar chart showing spending by month.

## Commands

```bash
pnpm install         # install dependencies
pnpm run dev         # start dev server (Vite)
pnpm run build       # production build
pnpm run preview     # preview production build locally
```

## Guidelines for AI Assistants

- Write clean, well-commented code. The developer is learning, so comments should teach.
- Prefer simplicity over abstraction. Don't over-engineer.
- Always read existing files before modifying them.
- Keep components reusable — avoid hardcoding values that could be props.
- Use CSS Modules for scoped styling; avoid inline styles.
- Persist expenses to localStorage so data survives page reloads.
- When creating charts, use Recharts `<ResponsiveContainer>` for proper sizing.
- Validate form inputs and show user-friendly error messages.
- Do not add TypeScript, testing libraries, or extra dependencies unless asked.
