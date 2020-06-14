---
id: myFirstDatabase
title: My First Database
sidebar_label: My First Database
---


The goal of this tutorial is to explore QuestDB's features to interact with time-series data.
This assumes you have an instance running. You can find guides to setup QuestDB [here](documentationOverview.md)

In this tutorial, we will learn to:
- Create tables 
- Populate tables with sample data
- Run simple and more advanced queries
- Delete tables

As an example, we will look at hypothetical temperature readings from a variety of sensors. 
> All commands are run through the [Web Console](consoleGuide.md) accessible on 
**[http://localhost:9000/index.html](http://localhost:9000/index.html)**.

## Creating a table

The first step is to create tables. One will contain the metadata of our sensors, the other will contain
 the readings from these sensors.

Let's start by creating the `sensors` table:
```sql
CREATE TABLE sensors (ID LONG, make STRING, city STRING);
```

>Find more about these commands in the **[SQL Administration](createTable.md)** commands section.

## Inserting data
Let's populate our `sensors` table with procedurally-generated data:
```sql
INSERT INTO sensors
    SELECT 
        x ID, --increasing integer
        rnd_str('Eberle', 'Honeywell', 'Omron', 'United Automation', 'RS Pro') make, 
        rnd_str('New York', 'Miami', 'Boston', 'Chicago', 'San Francisco') city
    FROM long_sequence(10000) x
;
```

> You can find more information on procedurally generated data in the [random  generator functions](functionsRandomValueGenerators.md)
> and in the [row generator functions](functionsRowGenerator.md)

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

```sql
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

Note:
- we elected `ts` as `TIMESTAMP`. This will enable time-partitioning.
- we partitioned data by `MONTH`. Our data will be sharded in monthly files.

The generated data will look like the below:

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
```sql
readings;
```

Let's also select the `count` of records from `readings`:
```sql
SELECT count() FROM readings;
```
|count     |
|----------|
|10,000,000|


and the average reading:
```sql
SELECT avg(temp) FROM readings;
```
|average   |
|----------|
|18.997    |


We can now leverage our `sensors` table to get more interesting data.
```sql
-- Run a join to get all readings and the corresponding metadata from the sensors table
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

```sql
-- Select maximum reading for each city
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


```sql
-- Select average hourly temperature in Miami for Omron sensors
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

Results should look like the data below:

|ts	                            |city	|make	|average
|-------------------------------|-------|-------|------------
|2019-10-21T00:00:00.000000Z	|Miami	|Omron	|18.97225935
|2019-10-21T01:00:00.000000Z	|Miami	|Omron	|19.15940157
|2019-10-21T02:00:00.000000Z	|Miami	|Omron	|18.92696357
|2019-10-21T03:00:00.000000Z	|Miami	|Omron	|19.09917038
|2019-10-21T04:00:00.000000Z	|Miami	|Omron	|19.1161127
|2019-10-21T05:00:00.000000Z	|Miami	|Omron	|18.93939597
|...                            |...    |...    |...


> Find more about these commands in the **[Select](sqlSELECT.md)** and **[Join](joins.md)** sections.

## Finding your data files
Data is stored on the hard drive. You can find it in the same path as QuestDB executable in the db folder. 
There will be a directory for each table. In this instance
`/questDB/db/readings` and `/questDB/db/sensors`.

Upon exploring this folder, you can see your data has been partitioned monthly.
|**Folders**    |               |               |               |
|---------------|---------------|---------------|---------------|
|2019-10        |2019-11        |2019-12        |...            |

Each folder will contain `.d` files corresponding to each column in the table. So for example for table `readings`
|**Files**      |               |               |               |
|---------------|---------------|---------------|---------------|
|ID.d           |ts.d           |sensorId.d     |temp.d         |

## Deleting tables

Upon dropping the table, all data is deleted. 

```sql
DROP TABLE readings;
DROP TABLE sensors;
```

