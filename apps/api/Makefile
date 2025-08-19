.PHONY: dump_db_dev

PG_EXEC=docker exec docker-services-postgres-1
copy_db_to_stg:
	$(PG_EXEC) pg_dump -d fmv -U npvinh -x -O -f backup.sql 
	$(PG_EXEC) psql -d fmv_dev -U lfg_admin -h lfg-development.clyyww82634g.ap-southeast-1.rds.amazonaws.com -f backup.sql
