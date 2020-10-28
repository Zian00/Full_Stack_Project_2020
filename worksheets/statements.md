# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

## INSERT

Example:
```sql
INSERT INTO performance (performance_id, festivalId, startTime, endTime) VALUES (1000000001, 2000000001, 1000, 1200);
```
```sql
INSERT INTO performanceWithPopularity (performanceId, festivalId, startTime, endTime, popularity) VALUES (1000000001, 2000000001, 1000, 1200,10)
```

## SELECT with Filtering and Pagination

Example:
```sql
SELECT *, COUNT(*) OVER() AS no_of_rows FROM performance WHERE festivalId=2000000001 AND startTime >= 1000 LIMIT 5 OFFSET 3;
```
```sql
SELECT *, COUNT(*) OVER() AS no_of_rows FROM performanceWithPopularity WHERE festivalId=2000000001 AND startTime > 1000 AND endTime < 1200 LIMIT 5 OFFSET 3; 
```
