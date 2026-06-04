# ExplorePi Quantum Network — Makefile
.PHONY: up down restart logs ps seed clean

up:
	docker compose up -d --build

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ps:
	docker compose ps

# Run SQL seed manually (if needed after first start)
seed:
	docker exec -i explorePi_postgres psql -U piuser -d explorePi < db/init/01_schema.sql

# Check languages in DB
langs:
	docker exec -it explorePi_postgres psql -U piuser -d explorePi \
	  -c "SELECT code, name_en, name_native, speakers_m FROM speaking_languages ORDER BY speakers_m DESC NULLS LAST LIMIT 30;"

# Wipe volumes and restart fresh
clean:
	docker compose down -v
	docker compose up -d --build

# Open Adminer in browser
admin:
	open http://localhost:8080

# Open app
app:
	open http://localhost:3000
