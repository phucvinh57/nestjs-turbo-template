<p align="center">
  <a href="https://node.js.org/" alt="NodeJS" target="_blank">
    <img src="https://img.shields.io/badge/node.js-6DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white" />
  </a>
  <a href="https://nestjs.com/" alt="NestJS" target="_blank">
    <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" />
  </a>
  <a href="https://www.typescriptlang.org/" alt="TypeScript" target="_blank">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  </a>
    <a href="https://www.prisma.io/" alt="Prisma" target="_blank">
    <img src="https://img.shields.io/badge/Prisma-3982CE.svg?style=for-the-badge&logo=Prisma&logoColor=white" />
  </a>
  </a>
    <a href="https://www.postgresql.org/" alt="PostgreSQL" target="_blank">
    <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" />
  </a>
</p>

<h1 align="center">NestJS + Turbo monorepo</h1>
<h3 align="center">
  This repository contains the source code and documentation for the sample NestJS monorepo project.<br></br>
  It uses a Turborepo structure for managing microservices and packages. Follow the steps below to get started with development and deployment.
</h3>

# 1. Prerequisites

Before proceeding with the setup, make sure you have the following tools installed on your system:

1. **Docker and Docker Compose**: [Install Docker Compose](https://docs.docker.com/desktop/install/mac-install/)

   ```sh
   ## Verify installation
   docker --version
   docker-compose --version
   ```

2. **Install Node Version Manager**: [NVM](https://github.com/nvm-sh/nvm)

   ```sh
   brew install nvm
   ```

3. **Install Node Version 22**:

   ```sh
   nvm install 22
   nvm use 22
   nvm alias default 22

   npm --version  # should be npm >= 10
   node --version # should be node >= 22
   ```

4. **Install package manager**: [PNPM](https://pnpm.io/)

   ```sh
   npm install -g pnpm
   pnpm --version # should be >= 9
   ```

5. **Install TurboRepo**: [TurboRepo](https://turbo.build/)
   ```sh
   npm install -g turbo
   turbo --version # should be >= 2.2
   ```

# 2. [TurboRepo](https://turbo.build/) Guide

1. **Familiar command line**: [List TurboRepo command line](https://turbo.build/repo/docs/reference/run)

   ```sh
   ## Create new app
   turbo gen workspace --name {app-name} --type app --destination apps

   ## Copy app
   turbo gen workspace --name {app-name} --type app --destination apps --copy {app-old-name}

   ## Create new package
   turbo gen workspace --name {package-name} --type package --destination packages

   ## Copy package
   turbo gen workspace --name {package-name} --type package --destination packages --copy {package-old-name}

   ## Generate structure folder when build docker to debug if build image has failed
   turbo prune {app-name} --docker --our-dir=out/{app-name}
   ```

2. **Familiar structure folder**:

- `data`:
  - `aws`: store ECS task-definition for CI/CD update each microservices
- `apps`: Define micro-services app
  - `game-api`: Client-side for customer can interactive with system and payment
  - `merchant-api`: Developer-side for game publisher can manage project and control game version...
- `modules`: Internal-package
  - `@sample/config-${name}`: For config Typescript, Eslint, Prettier, Jest...
  - `@sample/prisma`: BaseORM engine to query database
  - `@sample/health`: Heartbeat internal service and external service up/down
- `packages`: external-library
  - `@packages/common`: Reused in every microservice
  - `@packages/gecko`: Get current coin/token price
  - `@packages/subgraph`: To sign/sync with smart-contract

# Start Application

### <p style="color: red">Contact Manager Project or Tech lead to get environment settings [environment variables .env](./.env)</p>

1. **Get Environment Variables**

- In `apps/game-api`: copy from `.env.example` to `.env`
- In `apps/merchant-api`: copy from `.env.example` to `.env`
- In `packages/game-database`: copy from `.env.example` to `.env`

2. **Install packages dependencies**

   ```sh
   pnpm install
   ```

3. **Start Database**

   ```sh
   # Start
   docker-compose --profile 'game-database' up -d --build
   # Close
   docker-compose --profile 'game-database' down
   ```

4. **Generate Schema Interface Database**

   ```sh
   pnpm run prisma:generate-game
   ```

5. **Start microservice**

   ```sh
   pnpm run dev:game
   pnpm run dev:merchant
   ```

# Deployment

- Follow [Commit convention](https://www.conventionalcommits.org/en/v1.0.0/)
  ```sh
  git push origin feat("<project_name>:<taskId>"): task description
  ## example
  git push origin feat(HEX:001): initial project"
  ```
  