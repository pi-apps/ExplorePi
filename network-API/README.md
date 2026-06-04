# ExplorePi — Quantum Network Database Stack

Containerized multi-language database infrastructure for the ExplorePi Pi Network block explorer.

## Databases included

| Container | Image | Port | Language / Type |
|---|---|---|---|
| `pi_postgres` | postgres:16-alpine | 5432 | SQL / Relational |
| `pi_timescale` | timescale/timescaledb:latest-pg16 | 5433 | SQL / Time-series |
| `pi_mongo` | mongo:7 | 27017 | NoSQL / Document |
| `pi_redis` | redis:7-alpine | 6379 | Key-Value / Pub-Sub |
| `pi_clickhouse` | clickhouse/clickhouse-server:24 | 8123 | OLAP / Analytics |
| `pi_neo4j` | neo4j:5 | 7474 / 7687 | Graph / Cypher |
| `pi_elastic` | elasticsearch:8.13.0 | 9200 | Full-text Search / JSON |
| `pi_hasura` | hasura/graphql-engine:v2.40.0 | 8080 | GraphQL API layer |

All containers share the `pi_quantum_net` bridge network (`172.20.0.0/16`).

## Quick start

```bash
cp .env.example .env
# edit .env with secure passwords

docker compose up -d

# view logs
docker compose logs -f
```

## Seed schemas

```bash
# PostgreSQL
docker exec -i pi_postgres psql -U pi -d explorepi < seed/postgres-init.sql

# TimescaleDB
docker exec -i pi_timescale psql -U pi -d explorepi_ts < seed/timescale-init.sql

# ClickHouse
docker exec -i pi_clickhouse clickhouse-client -u pi --password $CH_PASS < seed/clickhouse-init.sql
```

## Connect

```bash
# SQL
psql -h localhost -U pi -d explorepi

# MongoDB
mongosh mongodb://pi:$MONGO_PASS@localhost:27017/explorepi

# Redis
redis-cli -h localhost -a $REDIS_PASS

# ClickHouse HTTP
curl "http://localhost:8123/?user=pi&password=$CH_PASS" --data "SELECT version()"

# Elasticsearch
curl http://localhost:9200/_cluster/health?pretty

# Hasura Console
open http://localhost:8080/console

# Neo4j Browser
open http://localhost:7474
```

## Quantum Network topology

```
Pi Stellar Horizon RPC
        ↓
sync_payments.py  (chunk auto-resize, pg insert)
        ↓
  ┌─────┴──────────────────────────────┐
  │                                    │
PostgreSQL ─── TimescaleDB          MongoDB
(relational)   (time-series)        (documents)
      │                                │
   Hasura GraphQL ◄────────────────────┘
      │
   ExplorePi Frontend
      │
Redis (cache + pub/sub) ── ClickHouse (OLAP) ── Elasticsearch (search)
                                                        │
                                                   Neo4j (graph)
```
