# 🤝 Contributing to The Fortress Hub

Thank you for your interest in contributing! We welcome all contributions.

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Code Style](#code-style)
6. [Testing](#testing)
7. [Documentation](#documentation)

## 📜 Code of Conduct

We follow a Code of Conduct that ensures a welcoming environment for everyone. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Docker (optional)
- PostgreSQL 15+ (or Docker)
- Redis 7+ (or Docker)

### Setup Development Environment

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/your-username/the-fortress-hub.git
cd the-fortress-hub

# 3. Install dependencies
npm install

# 4. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 5. Start services (Docker)
npm run docker:up

# 6. Run migrations
npm run migrate

# 7. Seed data
npm run seed

# 8. Start development servers
npm run dev