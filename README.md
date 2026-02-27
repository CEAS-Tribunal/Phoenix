# Phoenix UI

## Package Manager

This repository is managed with [Bun](https://bun.com/).

Required Bun version: `1.2.5` or newer.

## Local Setup (Bun Migration)

1. Install Bun:

```bash
curl -fsSL https://bun.com/install | bash
```

2. Verify installation:

```bash
bun --version
```

3. Install dependencies:

```bash
bun install
```

4. Start the UI locally:

```bash
bun run dev
```

5. Build for production:

```bash
bun run build
```

6. Preview production build:

```bash
bun run preview
```

## Notes

- Use `bun add <package>` for new dependencies.
- Use `bun add -d <package>` for dev dependencies.
- Lockfile is `bun.lock` (replaces `package-lock.json`).
