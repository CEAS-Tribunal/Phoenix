# Phoenix UI

This project uses **[Bun](https://bun.com)** only (no npm, yarn, or pnpm). Use the instructions below to install Bun and run the app.

---

## Do I still need package.json?

**Yes.** `package.json` is the standard project manifest and is used by both npm and Bun. We keep `package.json` for dependencies, scripts, and metadata. The only change from npm is:

- **Lockfile:** We use **`bun.lock`** (committed to git), not `package-lock.json`. Do not run `npm install` or `yarn` in this repo — use `bun install` only.

---

## For teammates: switching from npm to Bun

### 1. Install Bun (macOS)

Pick one method ([official install docs](https://bun.com/docs/installation)):

**macOS (recommended):**
```bash
curl -fsSL https://bun.com/install | bash
```

**macOS (Homebrew):**
```bash
brew install oven-sh/bun/bun
```

Then **restart your terminal** and verify:

```bash
bun --version
# Should show 1.2.5 or newer
```

If `bun` is not found, add Bun to your PATH (see [Bun installation](https://bun.com/docs/installation) — e.g. add `export PATH="$HOME/.bun/bin:$PATH"` to `~/.zshrc` or `~/.bashrc`).

---

### 2. Clone and install (first time)

**Important:** Before running `bun install`, be sure to delete any existing `node_modules` and `package-lock.json`:

```bash
cd Phoenix
rm -rf node_modules
rm -f package-lock.json   # remove npm lockfile if still present
bun install
```

Do **not** run `npm install` or `yarn`. This repo uses only `bun.lock`; other lockfiles are gitignored.

---

### 3. Daily commands

| If you used npm…        | Use with Bun instead   |
|-------------------------|------------------------|
| `npm install`           | `bun install`          |
| `npm run dev`            | `bun run dev`          |
| `npm run build`         | `bun run build`        |
| `npm run preview`       | `bun run preview`      |
| `npm run lint`         | `bun run lint`         |
| `npx <tool>`            | `bunx <tool>`          |
| `npm install <pkg>`     | `bun add <pkg>`        |
| `npm install -D <pkg>`  | `bun add -d <pkg>`     |
| `npm uninstall <pkg>`   | `bun remove <pkg>`     |
| `npm update`            | `bun update`           |
| `npm outdated`          | `bun outdated`         |

You can also shorten script runs: `bun dev` is the same as `bun run dev`.

---

### 4. Quick reference

```bash
# Install dependencies (after clone or when package.json changes)
bun install

# Start dev server (http://localhost:3000)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Lint
bun run lint
```

---

### 5. Adding / removing packages

- **Add a dependency:**  
  `bun add <package-name>`

- **Add a dev dependency:**  
  `bun add -d <package-name>`

- **Remove a dependency:**  
  `bun remove <package-name>`

After adding or removing packages, commit both `package.json` and `bun.lock`.

---

### 6. Troubleshooting

| Issue | What to do |
|-------|------------|
| `bun: command not found` | Install Bun (step 1) and add `~/.bun/bin` to your PATH. Restart the terminal. |
| Wrong or missing dependencies | Delete `node_modules` and run `bun install` again. |
| Script fails or behaves oddly | Ensure you're using Bun: `bun run <script>`, not `npm run <script>`. |
| You ran `npm install` by mistake | Run `bun install` to align with `bun.lock`. Do not commit `package-lock.json` (it's gitignored). |

---

### 7. Project details

- **Required Bun version:** 1.2.5 or newer (set in `package.json` via `packageManager`).
- **Lockfile:** `bun.lock` (text format). Commit it so everyone gets the same dependency tree.
- **Config:** Optional Bun settings are in `bunfig.toml` ([bunfig docs](https://bun.com/docs/runtime/bunfig)).
- **Scripts:** Dev/build/preview use Vite with Bun's runtime (`bunx --bun vite`) for faster startup ([Bun + Vite](https://bun.com/docs/guides/ecosystem/vite)).

---

## Official docs

- [Bun overview](https://bun.com/docs)
- [Installation](https://bun.com/docs/installation)
- [Migrate from npm to Bun](https://bun.com/docs/guides/install/from-npm-install-to-bun-install)
- [Bun + Vite](https://bun.com/docs/guides/ecosystem/vite)
