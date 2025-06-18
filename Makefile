docker-frontend:
	docker exec -it frontend /bin/sh
docker-backend:
	docker exec -it backend /bin/sh

rebuild:
	docker-compose down -v
	docker-compose build --no-cache
	docker compose up
up:
	docker compose up
reset:
	docker-compose down -v
	docker-compose up -d

npm-install-backend-host:
	cd backend; npm i;
npm-install-frontend-host:
	cd frontend; npm i;

db-seed:
	docker exec backend sh -c "npm run db-seed"
db-reset:
	docker exec backend sh -c "npm run db-reset"