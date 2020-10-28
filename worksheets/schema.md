# Schema

This document will gives user a good idea of how your database's structure looks like.

You may refer to the following link to learn more about postgresql schema:

```sql 
DROP TABLE IF EXISTS performance;
CREATE TABLE performance(
   id SERIAL PRIMARY KEY,
   performance_id BIGINT UNIQUE,
   festival_id BIGINT,
   start_time INTEGER,
   end_time INTEGER
);
```

performance table
|  Attributes  |    Type    |          Remarks          |
|--------------|------------|---------------------------|
|      id      |   SERIAL   |PRIMARY KEY, AUTO-INCREMENT|
|performanceId |  BIGINT    |          UNIQUE, NOT NULL |
|festivalId    |  BIGINT    |          NOT NULL         |
|startTime     |  VARCHAR   |          NOT NULL         |
|endTime       |  VARCHAR   |          NOT NULL         |


performanceWithPopularity table
|  Attributes  |    Type    |          Remarks          |
|--------------|------------|---------------------------|
|      id      |   SERIAL   |PRIMARY KEY, AUTO-INCREMENT|
|performanceId |  BIGINT    |          UNIQUE, NOT NULL |
|festivalId    |  BIGINT    |          NOT NULL         |
|startTime     |  VARCHAR   |          NOT NULL         |
|endTime       |  VARCHAR   |          NOT NULL         |
|popularity    |  INT       |          NOT NULL         |


1. [CREATE statements](https://www.postgresqltutorial.com/postgresql-create-table/)
2. [Foreign Keys](https://www.postgresqltutorial.com/postgresql-foreign-key/)

The following are examples of how you can create a table, replace the examples with your own create statements of all your table.
```sql
   CREATE TABLE performance (
      id SERIAL PRIMARY KEY,
      performanceId BIGINT UNIQUE NOT NULL,
      festivalId BIGINT NOT NULL,
      startTime VARCHAR NOT NULL,
      endTime VARCHAR NOT NULL
   )
```
```sql
   CREATE TABLE performanceWithPopularity (
      id SERIAL PRIMARY KEY,
      performanceId BIGINT UNIQUE NOT NULL,
      festivalId BIGINT NOT NULL,
      startTime VARCHAR NOT NULL,
      endTime VARCHAR NOT NULL,
      popularity INT NOT NULL
   )
```
