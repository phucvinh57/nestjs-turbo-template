.PHONY: dump_db_dev

COMPOSE=docker compose
PG_EXEC=$(COMPOSE) exec -it game-database
PG_DUMP_STG=$(PG_EXEC) pg_dump -d game_dev -h lfg-development.clyyww82634g.ap-southeast-1.rds.amazonaws.com -U lfg_admin

dump_db_dev:
	$(COMPOSE) down game-database --volumes
	$(COMPOSE) up game-database -d
	echo "Dumping staging database..."
	$(PG_DUMP_STG) -x -O -f dump.sql
	echo "Dumped staging database to $(DUMP_FILE)"
	echo "Restoring staging database..."
	$(PG_EXEC) psql -d game-launcher -U lfgdev -f dump.sql
reset:
	$(COMPOSE) down game-database --volumes
	$(COMPOSE) up game-database -d