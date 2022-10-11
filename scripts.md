# Installation Scripts

## Init (Root)

```bash
yarn create next-app --typescript
yarn eslint

yarn add --dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-typescript
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
yarn add --dev husky
```

## Client (Application)

```bash

```

## Contracts (Backend)

```bash
yarn workspace contracts add --dev @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-ethers ethers hardhat
cd contracts/
npx hardat
```

## Install

```bash
yarn install
yarn husky install
```

> Note: If you want to skip the check, you can add a --no-verify flag to your commit command. For example: git commit --no-verify -m "Update README.md"
