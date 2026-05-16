# AGENTS.md - Party Pay Coding Agent Instructions

## Mission

Build Party Pay as an Android-first executable prototype, not a static demo.

Repository:

```txt
https://github.com/ojozinho/party-pay.git
```

Branch:

```txt
feat/android-executable-prototype
```

## Non-negotiables

- Default language: pt-BR.
- Secondary language: en-US.
- Android-first with Expo, React Native and TypeScript.
- Preserve the visual identity from the user's UI/UX prototype pack.
- Do not create a generic delivery, POS or fintech UI.
- Make every primary button functional.
- Use simulated Pix, simulated split, simulated QR pickup and local mock data.
- Separate customer, bartender and admin roles.
- Bartender must never see financial data.
- Do not commit secrets.

## Git

Use clear commits. The expected implementation commit is:

```bash
git add .
git commit -m "Build Android executable Party Pay prototype"
git push -u origin feat/android-executable-prototype
```

## Secrets

Never commit `.env` or real Supabase tokens. Commit `.env.example` only.

Never expose service role keys, database passwords, JWT secrets or private admin credentials in mobile code, docs, screenshots, commits, logs or mock files.

## Final Output

Return branch name, commit hash, pushed URL, run commands and what was implemented.
