# Contributing to minecraft-helper-bot

Thanks for your interest in contributing!

## Getting started
- Fork this repository and clone your fork.
- Run `npm install` to install dependencies.
- Create a test Minecraft server and set `MC_HOST`, `MC_PORT`, `MC_USERNAME` in a `.env` file.

## How to contribute
- Check the open issues tagged `easy` or `good first issue`.
- Create a feature branch: `git checkout -b feature/my-change`.
- Make your changes (add or update commands in `index.js` or `commands/`).
- Run `node index.js` and test the bot connects and commands work.

## Coding style
- Use modern JavaScript (const/let, arrow functions).
- Keep commands small and focused, one file per command in `commands/`.

## Opening a pull request
- Push your branch and open a PR.
- Describe what you changed and how to test it.
- Link any related issue (e.g. `Closes #5`).
