# Development commands (using Dockerfile.dev and docker-compose.dev.yaml)
dev-up:
	docker-compose -f docker-compose.dev.yaml up -d

dev-down:
	docker-compose -f docker-compose.dev.yaml down

dev-rebuild:
	docker-compose -f docker-compose.dev.yaml down -v
	docker-compose -f docker-compose.dev.yaml build --no-cache
	docker-compose -f docker-compose.dev.yaml up -d

dev-reset:
	docker-compose -f docker-compose.dev.yaml down -v
	docker-compose -f docker-compose.dev.yaml up -d

dev-logs:
	docker-compose -f docker-compose.dev.yaml logs -f

# Production commands (using regular Dockerfile and docker-compose.yaml)
prod-up:
	docker-compose up -d

prod-down:
	docker-compose down

prod-rebuild:
	docker-compose down -v
	docker-compose build --no-cache
	docker-compose up -d

prod-reset:
	docker-compose down -v
	docker-compose up -d

prod-logs:
	docker-compose logs -f

# Container access (works for both dev and prod)
docker-frontend:
	docker exec -it frontend /bin/sh

docker-backend:
	docker exec -it backend /bin/sh

# Database operations
db-seed:
	docker exec backend sh -c "npm run db-seed"

db-reset:
	docker exec backend sh -c "npm run db-reset"

db-seed-prod:
	docker exec backend sh -c "node dist/scripts/seed.js"

db-reset-prod:
	docker exec backend sh -c "node dist/scripts/reset.js"

# Host npm operations
npm-install-backend-host:
	cd backend && npm install

npm-install-frontend-host:
	cd frontend && npm install

# Utility commands
clean:
	docker system prune -af
	docker volume prune -f

# Legacy commands (keeping for compatibility)
up: prod-up
rebuild: prod-rebuild
reset: prod-reset

# Show available commands
help:
	@echo "Development commands:"
	@echo "  dev-up       - Start development environment"
	@echo "  dev-down     - Stop development environment"
	@echo "  dev-rebuild  - Rebuild and restart development"
	@echo "  dev-reset    - Reset development environment"
	@echo ""
	@echo "Production commands:"
	@echo "  prod-up      - Start production environment"
	@echo "  prod-down    - Stop production environment" 
	@echo "  prod-rebuild - Rebuild and restart production"
	@echo "  prod-reset   - Reset production environment"
	@echo ""
	@echo "Container access:"
	@echo "  docker-frontend - Access frontend container"
	@echo "  docker-backend  - Access backend container"
	@echo ""
	@echo "Database:"
	@echo "  db-seed     - Seed database"
	@echo "  db-reset    - Reset database"