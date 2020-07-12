---
id: myFirstDatabase
title: My First Database
sidebar_label: My First Database
---


The goal of this tutorial is to explore QuestDB's features to interact with time-series data.
This assumes you have an instance running. You can find guides to setup QuestDB [here](documentationOverview.md).

In this tutorial, you will learn how to
- [Create tables](#creating-a-table) 
- [Populate tables with sample data](#inserting-data)
- [Run simple and advanced queries](#running-queries)
- [Delete tables](#deleting-tables)

As an example, we will look at hypothetical temperature readings from a variety of sensors. 

:::info
All commands are run through the [Web Console](consoleGuide.md) accessible on 
**[http://localhost:9000/index.html](http://localhost:9000/index.html)**.

If you prefer, you could easily run the same SQL using [PSQL](guidePSQL.md) or the [HTTP API](guideREST.md).
:::

## Creating a table

The first step is to create tables. One will contain the metadata of our sensors, the other will contain
 the readings from these sensors.

Let's start by creating the `sensors` table.
```sql title="Create a table"
CREATE TABLE sensors (ID LONG, make STRING, city STRING);
```

:::info
The `CREATE TABLE` command comes with many more functions. 
 For more information, please refer to the **[CREATE TABLE](createTable.md)** command reference.
:::

## Inserting data
Let's populate our `sensors` table with procedurally-generated data.
```sql title="Insert as select"
INSERT INTO sensors
    SELECT 
        x ID, --increasing integer
        rnd_str('Eberle', 'Honeywell', 'Omron', 'United Automation', 'RS Pro') make, 
        rnd_str('New York', 'Miami', 'Boston', 'Chicago', 'San Francisco') city
    FROM long_sequence(10000) x
;
```

:::info 
For more information on `INSERT` and `INSERT as select`, please refer to the [INSERT reference](sqlINSERT.md).

For more information on procedurally generated data in the [random  generator functions](functionsRandomValueGenerators.md)
and in the [row generator functions](functionsRowGenerator.md). 
:::

Our `sensors` table now contains 10,000 randomly generated sensors of different makes and in various cities.
It should look like the below:

|ID     | make              | city
|----   |-----              |-----
|1      | RS Pro            | New York 
|2      | Honeywell         | Chicago 
|3      | United Automation | Miami
|4      | Honeywell         | Chicago 
|...    | ...               | ...    

Let's now create some sensor readings. In this case, we will generate the table and the data at
the same time. 

```sql title="Create table as"
CREATE TABLE readings 
AS(
    SELECT
        x ID,
        timestamp_sequence(to_timestamp('2019-10-17T00:00:00', 'yyyy-MM-ddTHH:mm:ss'), rnd_long(1,10,2) * 100000L) ts,
        rnd_double(0)*8 + 15 temp,
        rnd_long(0, 10000, 0) sensorId
    FROM long_sequence(10000000) x)
TIMESTAMP(ts) 
PARTITION BY MONTH;
```

:::note
While creating this table we did the following:
- `TIMESTAMP(ts)` elected `ts` as [designated timestamp](designatedTimestamp.md). This will enable time-partitioning.
- `PARTITION BY MONTH` created a monthly partition strategy. Our data will be sharded in monthly files.
:::

The generated data will look like the below.

|ID	    |ts	                            |temp	        |sensorId
|-------|-------------------------------|---------------|---------
|1	    |2019-10-17T00:00:00.000000Z	|19.37373911	|9160
|2	    |2019-10-17T00:00:00.600000Z	|21.91184617	|9671
|3	    |2019-10-17T00:00:01.400000Z	|16.58367834	|8731
|4	    |2019-10-17T00:00:01.500000Z	|16.69308815	|3447
|5	    |2019-10-17T00:00:01.600000Z	|19.67991569	|7985
|...    |...           	                |...	        |...

## Running queries

Let's first select all records from the `readings` table (note the omission of `SELECT * FROM`):
```sql title="Select *"
readings;
```

Let's also select the `count` of records from `readings`:
```sql title="Simple aggregation"
SELECT count() FROM readings;
```
|count     |
|----------|
|10,000,000|


and the average reading:
```sql title="Simple aggregation"
SELECT avg(temp) FROM readings;
```
|average   |
|----------|
|18.997    |


We can now leverage our `sensors` table to get more interesting data.
```sql title="Simple JOIN"
SELECT * 
FROM readings 
JOIN(
    SELECT ID sensId, make, city 
    FROM sensors) 
ON readings.sensorId = sensId;
```

Results should look like the data below:

|ID	|ts	                            |temp	        |sensorId	|sensId	|make	            |city
|---|-------------------------------|---------------|-----------|-------|-------------------|---------
|1	|2019-10-17T00:00:00.000000Z	|19.37373911	|9160	    |9160	|RS Pro	            |Boston
|2	|2019-10-17T00:00:00.600000Z	|21.91184617	|9671   	|9671	|United Automation	|New York
|3	|2019-10-17T00:00:01.400000Z	|16.58367834	|8731   	|8731	|Honeywell	        |Miami
|4	|2019-10-17T00:00:01.500000Z	|16.69308815	|3447   	|3447	|United Automation	|Miami
|5	|2019-10-17T00:00:01.600000Z	|19.67991569	|7985   	|7985	|Eberle	            |San Francisco
|6	|2019-10-17T00:00:01.600000Z	|15.39514039	|4230   	|4230	|United Automation	|Chicago
|7	|2019-10-17T00:00:02.100000Z	|15.06719566	|2829   	|2829	|Honeywell	        |New York
|...|...                            |...            |...        |...    |...                |...

```sql title="Aggregation keyed by city"
SELECT city, max(temp) 
FROM readings 
JOIN(
    SELECT ID sensId, city 
    FROM sensors) 
ON readings.sensorId = sensId;
```

Results should look like the data below:

|city	        |max
|---------------|-----------
|Boston	        |22.99999233
|New York	    |22.99999631
|Miami	        |22.99999673
|San Francisco	|22.99999531
|Chicago	    |22.9999988


```sql title="Aggregation by hourly time buckets"
SELECT ts, city, make, avg(temp)
FROM readings 
JOIN (
    SELECT ID sensId, city, make
    FROM sensors
    WHERE city='Miami' AND make='Omron') 
ON readings.sensorId = sensId 
WHERE ts ='2019-10-21;1d' -- this is an interval between 21-10 and 1day later
SAMPLE BY 1h;
```

Results should look like the data below.

|ts	                            |city	|make	|average
|-------------------------------|-------|-------|------------
|2019-10-21T00:00:00.000000Z	|Miami	|Omron	|18.97225935
|2019-10-21T01:00:00.000000Z	|Miami	|Omron	|19.15940157
|2019-10-21T02:00:00.000000Z	|Miami	|Omron	|18.92696357
|2019-10-21T03:00:00.000000Z	|Miami	|Omron	|19.09917038
|2019-10-21T04:00:00.000000Z	|Miami	|Omron	|19.1161127
|2019-10-21T05:00:00.000000Z	|Miami	|Omron	|18.93939597
|...                            |...    |...    |...


:::info
Find more about these commands in the **[Select](sqlSELECT.md)** and **[Join](joins.md)** sections.
:::


## Deleting tables

Upon dropping the table, all data is deleted. 

```sql
DROP TABLE readings;
DROP TABLE sensors;
```
