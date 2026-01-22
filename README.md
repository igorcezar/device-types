# Device Types

Device management platform with microservices architecture for device registration and statistics tracking.

## Architecture

```
┌─────────────────────────────────────────┐
│         statistics-api (Port 3000)      │
│         - Public API                    │
│         - Queries device statistics     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   device-registration-api (Port 3001)   │
│         - Internal API                  │
│         - Device registration           │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
│         - Persistent storage            │
└─────────────────────────────────────────┘
```

## Applications

### statistics-api

External-facing API that provides device statistics and analytics.

- **Port**: 3000
- **Technology**: Node.js, Express, TypeScript
- **Features**: Device statistics, data aggregation

### device-registration-api

Internal API for device registration and management.

- **Port**: 3001
- **Technology**: Node.js, Express, TypeScript, Knex, PostgreSQL
- **Features**:
  - Device CRUD operations
  - Automatic database migrations on startup
  - Production-ready migration system
  - PostgreSQL connection pooling

## Quick Start

### Docker Compose (Recommended)

The easiest way to run the entire stack locally:

```bash
# Start all services (PostgreSQL + both APIs)
docker compose up

# Run in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Verify services
curl http://localhost:3000/health  # statistics-api
curl http://localhost:3001/health  # device-registration-api
```

**Note**: Migrations run automatically on app startup, so the database is ready immediately.

### Local Development

```bash
# Install dependencies for both apps
cd statistics-api && yarn install
cd device-registration-api && yarn install

# Start PostgreSQL
docker compose up -d postgres

# Start both apps (in separate terminals)
cd statistics-api && yarn dev:local
cd device-registration-api && yarn dev:local
```

**Note**: Migrations run automatically when the app starts. You can also run them manually with `yarn migrate`.

## CI/CD

### GitHub Actions

Automated pipeline for linting, building, deploying with Helm.

**Features:**

- ✅ Lint both applications (ESLint, TypeScript, Prettier)
- ✅ Build TypeScript
- ✅ Build multi-arch Docker images (amd64, arm64)
- ✅ Push to DockerHub with automatic tagging
- ✅ Deploy to Kubernetes/OpenShift with Helm (Dry-run)
- ✅ Multi-environment deployments (dev, staging, prod)

**Deployment Flow:**

- `develop` branch → Deploy to dev environment
- `main` branch → Deploy to staging environment
- `v*` tags → Deploy to production environment

**Triggers:**

- Push to `main` or `develop`
- Git tags (e.g., `v1.0.0`)
- Pull requests (build only, no push)
- Manual workflow dispatch

## Deployment

### Kubernetes/OpenShift with Helm

Production-ready Helm charts with automatic dependency management:

#### 1. Create Secrets

Before deploying, create Kubernetes secrets for sensitive data:

```bash
# Create namespace first
kubectl create namespace device-registration-api-<env>
kubectl create namespace statistics-api-<env>

# Create database secrets for device-registration-api
kubectl create secret generic device-registration-api-secrets \
  --from-literal=DB_PASSWORD="devices" \
  --from-literal=DB_USER="device_user" \
  --from-literal=DB_NAME="devices" \
  --namespace device-registration-api-<env>

# Create database secrets for statistics-api
kubectl create secret generic statistics-api-secrets \
  --from-literal=DB_PASSWORD="devices" \
  --from-literal=DB_USER="device_user" \
  --from-literal=DB_NAME="devices" \
  --namespace statistics-api-<env>
```

**Note**: In production, use a secrets management solution (e.g., Sealed Secrets, External Secrets Operator, HashiCorp Vault).

#### 2. Update Dependencies

```bash
# Update chart dependencies before deploying
cd deployment/device-registration-api
helm dependency update

cd deployment/statistics-api
helm dependency update
```

#### 3. Deploy to Different Environments

Use `helm upgrade --install` for idempotent deployments (installs if not exists, upgrades if exists):

```bash
# device-registration-api (with PostgreSQL)
helm upgrade --install device-registration-api-<env> ./deployment/device-registration-api \
  -f deployment/device-registration-api/values.<env>.yaml \
  --namespace device-registration-api-<env> \
  --create-namespace

# statistics-api
helm upgrade --install statistics-api-<env> ./deployment/statistics-api \
  -f deployment/statistics-api/values.<env>.yaml \
  --namespace statistics-api-<env> \
  --create-namespace
```

**Override image tag (e.g., for CI/CD):**

```bash
helm upgrade --install device-registration-api-dev ./deployment/device-registration-api \
  -f deployment/device-registration-api/values.dev.yaml \
  --set device-registration-api.image.tag=abc123 \
  --set postgresql.auth.password="password" \
  --namespace device-registration-api-dev
```

**Using environment variables for passwords:**

```bash
# More secure: use environment variables
export POSTGRES_PASSWORD="your-secure-password"

helm upgrade --install device-registration-api-dev ./deployment/device-registration-api \
  -f deployment/device-registration-api/values.dev.yaml \
  --set postgresql.auth.password="$POSTGRES_PASSWORD" \
  --namespace device-registration-api-dev
```

**Features:**

- Generic chart for both applications
- Multi-environment support (dev, staging, production)
- Automatic dependency management (PostgreSQL for device-registration-api)
- OpenShift compatibility (`openshift: true`)
- Security best practices (non-root, NetworkPolicies, etc.)
- High availability (HPA, PDB, pod anti-affinity)
- Database migrations run automatically on pod startup

## Development

### Prerequisites

- Node.js 24+
- Yarn
- PostgreSQL 16+ (or Docker)

### Project Structure

```

device-types/
├── statistics-api/ # Statistics API service
│ ├── src/
│ ├── Dockerfile
│ └── package.json
├── device-registration-api/ # Registration API service
│ ├── src/
│ │ ├── config/ # Knex configuration
│ │ ├── scripts/ # Migration scripts
│ │ └── persistence/ # Database connection
│ ├── migrations/ # Database migrations
│ ├── Dockerfile
│ └── package.json
├── deployment/ # Helm charts for deployment
│ ├── chart/
│ │ └── app-deploy/ # Base Helm chart
│ ├── device-registration-api/ # App-specific chart
│ │ ├── Chart.yaml
│ │ ├── values.dev.yaml
│ │ ├── values.staging.yaml
│ │ └── values.prod.yaml
│ └── statistics-api/ # App-specific chart
│ ├── Chart.yaml
│ ├── values.dev.yaml
│ ├── values.staging.yaml
│ └── values.prod.yaml
├── .github/ # CI/CD workflows
│ └── workflows/
│ └── cicd.yml
└── docker-compose.yml # Local development stack

```

### Available Scripts

**Both applications:**

```bash
yarn dev          # Development with hot reload
yarn dev:local    # Development with .env file
yarn build        # Build TypeScript
yarn start        # Start production build
yarn lint         # Run ESLint
yarn lint:fix     # Fix linting issues
yarn typecheck    # Check TypeScript types
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

**device-registration-api only:**

```bash
yarn migrate           # Run pending migrations
yarn migrate:rollback  # Rollback last batch
yarn migrate:make      # Create new migration file
```

### Database Migrations

Database migrations run **automatically** when the app starts (both locally and in production). You can also run them manually:

```bash
cd device-registration-api

# Run migrations manually
yarn migrate

# Rollback last migration
yarn migrate:rollback

# Create new migration
yarn migrate:make migration_name
```

**How it works:**

- Migrations execute before the server starts
- Uses `knex.migrate.latest()` to apply pending migrations
- If migrations fail, the app won't start (fail-fast)
- Safe for containerized environments (Docker, Kubernetes)

## Environment Variables

Create `.env` files for local development (see `.env.example` in each app directory).

**Note**: `.env` files are only loaded when `NODE_ENV !== 'production'`. In production, environment variables should be provided by your hosting platform (Docker, Kubernetes, etc.).

### statistics-api

```env
NODE_ENV=development
PORT=3000
DEVICE_REGISTRATION_API=http://localhost:3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=device
DB_USER=postgres
DB_PASSWORD=postgres

```

### device-registration-api

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=device
DB_USER=postgres
DB_PASSWORD=postgres
```

## API Endpoints

### statistics-api (Port 3000)

- `GET /health` - Health check
- `POST /Log/auth` - Store information about user login event
- `GET /Log/auth/statistics` - Retrieve Device Registrations by Type

### device-registration-api (Port 3001)

- `GET /health` - Health check
- `POST /Device/register` - Register a Device Type for a given User

## Technologies

- **Runtime**: Node.js 24
- **Language**: TypeScript 5
- **Framework**: Express 5
- **Database**: PostgreSQL 17
- **ORM**: Knex.js
- **Linting**: ESLint 9
- **Formatting**: Prettier 3
- **Containerization**: Docker
- **Orchestration**: Kubernetes/OpenShift with Helm

## Troubleshooting

### Migrations not running

If migrations aren't running automatically:

1. Check that `NODE_ENV` is not set to `production` locally
2. Verify database connection in `.env` file
3. Run migrations manually: `yarn migrate`

### Docker Compose issues

```bash
# Clean rebuild
docker compose down -v
docker compose build --no-cache
docker compose up

# View logs for specific service
docker compose logs -f device-registration-api
```

### Helm deployment issues

```bash
# Check dependencies
helm dependency list ./deployment/device-registration-api

# Update dependencies
helm dependency update ./deployment/device-registration-api

# Dry run to check for issues
helm upgrade --install myapp ./deployment/device-registration-api \
  -f deployment/device-registration-api/values.dev.yaml \
  --dry-run --debug
```

## License

MIT
