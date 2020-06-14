---
id: select
title: SELECT
sidebar_label: SELECT
---

`SELECT` allows you to specify list of columns and expressions to be selected and evaluated from a table.

## Syntax
![select syntax](/static/img/select-statement.svg)

>Note that the `TABLE` you query from can either be a table in your database (in which case you would pass the table's name),
>or the result of a sub query.

## Simple Select

### All columns
QuestDB supports `SELECT * FROM tablename`. When selecting all, you can also omit most of the statement and simply pass 
the table name. 

The two examples below are equivalent

```sql
SELECT * FROM ratings;

// is equivalent to //

ratings;
```


### Specific columns
To select specific columns, replace * by the names of the columns you are interested in.

Example:

```sql
SELECT movieId, rating  FROM ratings;
```


### Arithmetic Expressions
`SELECT` is capable of evaluating multiple expressions and functions. You can mix comma separated lists 
of expressions with the column names you are selecting.

```sql
SELECT movieId, (100 - rating)*2, rating > 3.5 good  
FROM ratings;
```

The result of `rating > 3.5` is a boolean. The column will be named good and take values true or false.

### Aliases
Using aliases allow you to give expressions or column names of your choice. You can assign an alias to a column or an 
expression by writing the alias name you want after that expression

>Alias names and column names must be unique.
Example:

```sql
SELECT movieId alias1, rating alias2 
FROM ratings
```


## Aggregation
Aggregation functions can be used in arithmetic expressions.

### Aggregate functions


Currently implemented aggregate functions:

@TODO


### Aggregation by group

QuestDB evaluates aggregation functions without need for traditional `GROUP BY`. Simply use a mix of column
names and aggregation functions in a `SELECT` clause. You can have any number of discrete value columns and
any number of aggregation functions.

```sql
SELECT movieId, avg(rating), count() FROM ratings;

// is equivalent to //

SELECT movieId, avg(rating), count() FROM ratings GROUP BY movieId;
```


### Aggregation arithmetic

Aggregation functions can be used in arithmetic expressions. The following computes `mid` of rating values for
every movie.


```sql
SELECT movieId, (min(rating) + max(rating))/2 mid, count() count FROM ratings;
```


## WHERE clause

### Syntax
QuestDB supports standard `WHERE` clause for filtering data. 
Filter expressions are required to return boolean result.

![filter syntax](/static/img/filtered-statement.svg)

```sql
SELECT COLUMN1, COLUMN2...
FROM TABLENAME
WHERE CONDITIONS;
```

`CONDITIONS` are expressions that return boolean results.

### Operators

Advanced conditions can be built using logical operators. 

List of supported `BOOLEAN` operators:

@TODO


### Exact timestamp 

Use `=` operator and UTC date string for exact timestamp matches:

~~~ sql
SELECT ratings WHERE timestamp = '2010-01-12T00:02:26.000Z'
~~~
QuestDB SQL optimiser will create more efficient plan when data is time series naturally ordered by timestamp.

### Interval timestamp

> QuestDB supports interval timestamp search with comparison operators. However, to obtain best performance, 
>we recommend using our timestamp search notation described below

#### Using `>`,`>=`,`<`,`<=` operators:

~~~ sql
SELECT ratings WHERE timestamp > '2010-01-12T00:00:00.000Z' and timestamp < '2010-01-12T00:59:59.999Z' 
~~~


#### Using `in` operator: 

~~~ sql
SELECT ratings WHERE timestamp in ('2010-01-12T00:00:00.000Z', '2010-01-12T00:59:59.999Z') 
~~~

`in` is inclusive of edges and supports exactly two UTC timestamps.

#### Using QuestDB timestamp search notation

Using `=` operator and partial UTC timestamp string. Example below selects data between 14:00 and 14:59 on 12 January 2010: 

~~~ sql
SELECT ratings WHERE timestamp = '2010-01-12T14' 
~~~

To obtain intervals UTC timestamps can be truncated at seconds, minutes, days, months and years. This example
selects data for the whole of 2011:

~~~ sql
SELECT ratings WHERE timestamp = '2011' 
~~~


Using `=` operator and interval length modifier to specify longer than single time unit intervals. This
example selects 2pm, 3pm and 4pm data:

~~~ sql
SELECT ratings WHERE timestamp = '2010-01-12T14;2h' 
~~~

QuestDB uses the following algorithm to create the interval: `2010-01-12T14` is translated into _natural_ interval
`[2010-01-12T14:00:00.000Z, 2010-01-12T14:59:59.999Z]`, then 2 hours added to the upper bound resulting in 
`[2010-01-12T14:00:00.000Z, 2010-01-12T16:59:59.999Z]` interval.

Interval modifier format is:

![interval modifier](/static/img/interval-modifier.svg)

where letters stand for:

@TODO

### Floating Point

You can use `eq` operator to compare `double` and `float` values with tolerance to avoid rounding problems.
For example:

~~~ sql
SELECT prices WHERE eq(bid, 1.56, 0.000001) 
~~~

You can also use `=`:

~~~ sql
SELECT prices WHERE bid = 1.56 
~~~

but `=` would not match `1.56` and `1.559999999999`.

>Best practice for floating point values would be to store as LONG integer using scaling factors 
>to avoid rounding-related issues.

### Search using aggregation results

Subqueries can be used to filter on aggregation results in QuestDB SQL. It is fairly simple because of
the optional nature of `select .. from`. 
 
The following example selects all movies that received over 50,000 ratings.

~~~ sql
(select movieId x, (min(rating) + max(rating))/2 mid, count() count from ratings) where count > 50000
~~~

Standard SQL equivalent would be:

~~~ sql
select movieId, (min(rating) + max(rating))/2 mid, count() count from ratings
group by movieId
having count() > 50000
~~~

## ORDER BY

### Usage
`ORDER BY` is used to sort the results of a query in ascending or descending order.

### Syntax
```sql
SELECT COLUMN1, COLUMN2...
FROM TABLENAME
ORDER BY COLUMN1 [ASC]|DESC, COLUMN2 [ASC]|DESC ...;
```

@TODO

> Note that ASC is optional and can be omitted.
>

### Examples
Order by one column in ascending order:
```sql
ratings ORDER BY userId;
// is equivalent to //
SELECT * FROM ratings ORDER BY userId ASC;
```

Order by one column in descending order:
```sql
ratings ORDER BY userId DESC;
```

Order by several columns:
```sql
ratings ORDER BY userId, rating DESC;
// is equivalent to //
SELECT * FROM ratings ORDER BY userId ASC , rating DESC;
```

## SELECT DISTINCT

### Usage
`SELECT DISTINCT` is used to return only distinct (i.e different) values.

### Syntax
```sql
SELECT DISTINCT COLUMN1, COLUMN2, ...
FROM TABLE;
```

### Example
The following query will return a list of all unique ratings in the table.
```sql
SELECT DISTINCT rating 
FROM ratings;
```

> SELECT DISTINCT can be used in conjunction with more advanced queries and filters.

The following query will return a list of all unique ratings in the table, and the number of times they occur.
```sql
SELECT DISTINCT rating, count() 
FROM ratings;
```

The following query will return a list of all ratings-userId couples in the table and hoy many times each user has assigned each rating.
It is also filtered for ratings superior to 3
```sql
SELECT DISTINCT rating, userId, count() 
FROM ratings
WHERE rating > 3;
```

## LIMIT

### Overview
`LIMIT` is used to specify the number of records to return. Furthermore, you can specify whether the position of the rows 
(first n rows, last n rows, n rows after skipping m rows etc) .

>In other implementations of SQL, this is sometimes replaced by statements such as `OFFSET` or `ROWNUM`
>Our implementation of `LIMIT` encompasses both in one statement.

### Syntax
Statements with `LIMIT` follow this syntax:

```sql
SELECT column1, column2, ...
FROM table 
LIMIT NUM_ROWS;
```

Where
`NUM_ROWS` is the number of rows you want to return with the query.

> Limit will by default start from the TOP of the table. If you would like to get results
>from the BOTTOM of the table, then l should be a negative number.

### Examples
The following will return the TOP 5 results.
```sql
SELECT * FROM ratings LIMIT 5;
```
>For a results table with rows from 1 to n, it will return rows [1, 2, 3, 4, 5]

The following will return the BOTTOM 5 results:
```sql
SELECT * FROM ratings LIMIT -5;
```
>For a results table with rows from 1 to n, it will return rows [n-5, n-4, n-3, n-2, n-1, n]

### Range
You can use two parameters to return a range. To do so, you should use the syntax
```sql
SELECT . . FROM . . LIMIT n, m;
```
Where `n` is the lower bound of your range (**exclusive**), and `m` is the upper bound of your range (**inclusive**)

For example, the following return records {3, 4, 5}

```sql
ratings LIMIT 2,5;
```

When used with `negative` numbers, you can return a range starting from the bottom.

For example, the following will return records between n-7 (exclusive) and n-3 (inclusive), i.e {n-6, n-5, n-4, n-3}
```sql
ratings LIMIT -7, -3;
```


## SAMPLE BY 

### Overview
`SAMPLE BY` is used on time-series data to summarise large datasets into aggregates of homogeneous time chunks.

>To use `SAMPLE BY`, one column needs to be designated as `timestamp`. Find out more in the **[CREATE TABLE](createTable.md)** section.

### Syntax
`SAMPLE BY` syntax is as follows:
```sql
SELECT columns
FROM table 
SAMPLE BY nSAMPLE_SIZE
```

WHere `SAMPLE_SIZE` is the unit of time by which you wish to aggregate your results, and `n` is the number of
 time-chunks that will be summarised together. You can sample by any multiple of the following:
 
<table class="alt tall">
<thead>
<th>Modifier</th>
<th>Remarks</th>
</thead>
<tbody>
<tr>
<td class="param">s</td>
<td>
Seconds
</td>
</tr>

<tr>
<td class="param">m</td>
<td>
Minutes
</td>
</tr>

<tr>
<td class="param">h</td>
<td>
Hours
</td>
</tr>

<tr>
<td class="param">d</td>
<td>
Days
</td>
</tr>

<tr>
<td class="param">M</td>
<td>
Months
</td>
</tr>

<tr>
<td class="param">y</td>
<td>
Years
</td>
</tr>

</tbody>
</table>

### Examples
Assume the following table
```shell script
TRADES
===============================================
timestamp,    buysell,    quantity,     price
-----------------------------------------------
ts1           B           q1            p1
ts2           S           q2            p2
ts3           S           q3            p3
...           ...         ...           ...
tsn           B           qn            pn
```

The following will return the number of trades per hour:
```sql
SELECT timestamp, count()
FROM TRADES
SAMPLE BY 1h;
```

The following will return the trade volume in 30 minute intervals
```sql
SELECT timestamp, sum(quantity*price)
FROM TRADES
SAMPLE BY 30m;
```

The following will return the average trade notional (where notional is = q * p) by day:
```sql
SELECT timestamp, avg(quantity*price)
FROM TRADES
SAMPLE BY 1d;
``` 

## FILL

### Overview
`FILL` is an option for `SAMPLE BY` to determine how the results of a query are displayed when one or more of your time-slices have no data. 
This is useful when you would like your query results to be homogeneous in time: rather than skipping the time chunk, the query will
return a value determine by the type of FILL you choose.

### Syntax
```sql
SELECT timestamp, aggr1, aggr2, ...
FROM table 
SAMPLE BY YOUR_SAMPLE_SIZE
FILL(FILL_OPTION_1, FILL_OPTION_2...);
```

`FILL_OPTION` can be any of the following:

<table class="alt tall">
<thead>
<th>Option</th>
<th>Remarks</th>
</thead>
<tbody>
<tr>
<td class="param">NONE</td>
<td>
Will not fill. In case there is no data, the time-chunk will be skipped in the results. This means your table could
potentially be missing intervals.
</td>
</tr>

<tr>
<td class="param">NULL</td>
<td>
Will fill with NULL
</td>
</tr>

<tr>
<td class="param">PREV</td>
<td>
Will fill using the previous data point.
</td>
</tr>

<tr>
<td class="param">LINEAR</td>
<td>
Will fill with the result of the linear interpolation of the surrounding 2 points.
</td>
</tr>

<tr>
<td class="param">0</td>
<td>
Will fill with 0. Note you can replace 0 with any number of your choice (e.g fill 100.00)
</td>
</tr>

</tbody>
</table>

> Fill must be used on aggregations such as sum(), count() etc.

### Examples
Consider the following table
```shell script
PRICES
======================
timestamp,    price
----------------------
ts1           p1
ts2           p2
ts3           p3
...           ...
tsn           pn
```

We could run the following to get the minimum, maximum and average price per hour using the following query:
```sql
SELECT timestamp, min(price) min, max(price) max, avg(price) avg
FROM PRICES
SAMPLE BY 1h;
```

It would generally return result like this:
```shell script
RESULTS
======================================
timestamp,    min,    max,    average
--------------------------------------
ts1           min1    max1    avg1
...           ...     ...     ...
tsn           minn    maxn    avgn
```

However, in case there was no `PRICES` data for a given hour, your table would have time-chunks missing. For example
```shell script
RESULTS
======================================
timestamp,    min,    max,    average
--------------------------------------
ts1           min1    max1    avg1
ts2           min2    max2    avg2
ts4           min4    max4    avg4
...           ...     ...     ...
tsn           minn    maxn    avgn
```

Here you can see that the third time chunk is missing. This is because there was no price update in the third hour. 
Let's see what different fill values would return:
```sql
SELECT timestamp, min(price) min, max(price) max, avg(price) avg
FROM PRICES
SAMPLE BY 1h
FILL(null, 0, prev);
```

would return:
```shell script
RESULTS
======================================
timestamp,    min,    max,    average
--------------------------------------
ts1           min1    max1    avg1
ts2           min2    max2    avg2
ts3           NULL    0       avg2   <<< FILL VALUES
ts4           min4    max4    avg4
...           ...     ...     ...
tsn           minn    maxn    avgn
```

And the following:
```sql
SELECT timestamp, min(price) min, avg(price) avg
FROM PRICES
SAMPLE BY 1h
FILL(25.5, linear);
```

Would return:
```shell script
RESULTS
======================================
timestamp,    min,    average
--------------------------------------
ts1           min1    avg1
ts2           min2    avg2
ts3           25.5    (avg2+avg4)/2       <<< FILL VALUES
ts4           min4    avg4
...           ...     ...
tsn           minn    avgn
```
