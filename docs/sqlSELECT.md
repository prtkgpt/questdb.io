---
id: select
title: SELECT
sidebar_label: SELECT
---

`SELECT` allows you to specify list of columns and expressions to be selected and evaluated from a table.

## Syntax
![select syntax](/static/img/select-statement.svg)

:::tip
The `TABLE` can either be a in your database (in which case you would pass the table's name),
or the result of a sub query.
:::

## Simple Select

### All columns
QuestDB supports `SELECT * FROM tablename`. When selecting all, you can also omit most of the statement and simply pass 
the table name. 

The two examples below are equivalent

```sql title="QuestDB dialect"
ratings;
```

```sql title="Traditional SQL equivalent"
SELECT * FROM ratings;
````



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

:::note
Alias names and column names must be unique.
:::

```sql
SELECT movieId alias1, rating alias2 
FROM ratings
```


## Aggregation

:::info
Supported aggregation functions are listed [here](functionsAggregation.md).
:::

### Aggregation by group

QuestDB evaluates aggregation functions without need for traditional `GROUP BY`. Simply use a mix of column
names and aggregation functions in a `SELECT` clause. You can have any number of discrete value columns and
any number of aggregation functions.

```sql title="QuestDB dialect"
SELECT movieId, avg(rating), count() 
FROM ratings;
```

```sql title="Traditional SQL equivalent"
SELECT movieId, avg(rating), count() 
FROM ratings 
GROUP BY movieId;
```


### Aggregation arithmetic

Aggregation functions can be used in arithmetic expressions. The following computes `mid` of rating values for
every movie.

```sql
SELECT movieId, (min(rating) + max(rating))/2 mid, count() count 
FROM ratings;
```

:::tip
Whenever possible, it is recommended to perform arithmetics `outside` of aggregation functions as this can have 
a dramatic impact on performance. For example, `min(value/2)` is going to execute considerably slower than `min(value)/2` 
although both alternative will return the same result
:::

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


### Exact timestamp 

Use `=` operator and UTC date string for exact timestamp matches:

~~~ sql
SELECT ratings WHERE timestamp = '2010-01-12T00:02:26.000Z'
~~~
QuestDB SQL optimiser will create more efficient plan when data is time series naturally ordered by timestamp.

### Interval timestamp

:::tip
QuestDB supports interval timestamp search with comparison operators. However, to obtain best performance, 
we recommend using our timestamp search notation described below
:::

#### Using `>`,`>=`,`<`,`<=` operators:

~~~ sql
SELECT ratings 
WHERE 
    timestamp > '2010-01-12T00:00:00.000Z' 
    and 
    timestamp < '2010-01-12T00:59:59.999Z' 
~~~


#### Using `in` operator: 

~~~ sql
SELECT ratings 
WHERE timestamp in ('2010-01-12T00:00:00.000Z', '2010-01-12T00:59:59.999Z') 
~~~

:::note
`in` is inclusive of edges and supports exactly two UTC timestamps.
:::

#### Using QuestDB timestamp search notation

:::tip
This timestamp search method is recommended.
:::

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

| letter | meaning |
|---|---|
|`s` | second |
|`m` | minute |
|`h` | hour |
|`d` | day |
|`M` | month |
|`y`| |year|

:::tip
You can use multipliers for the above intervals. For example `WHERE timestamp = '2010-01-12T14;24h'` is equivalent to 
`WHERE timestamp = '2010-01-12T14;1d'`
:::

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

:::tip
Best practice for floating point values would be to store as LONG integer using scaling factors 
to avoid rounding-related issues.
:::

### Search using aggregation results

Subqueries can be used to filter on aggregation results in QuestDB SQL. It is fairly simple because of
the optional nature of `select .. from`. 
 
The following example selects all movies that received over 50,000 ratings.

``` sql title="QuestDB dialect"
(SELECT movieId x, (min(rating) + max(rating))/2 mid, count() count from ratings) 
WHERE count > 50000
```

```sql title="Traditional SQL equivalent"
SELECT movieId, (min(rating) + max(rating))/2 mid, count() count from ratings
GROUP BY movieId
HAVING count() > 50000
```

## ORDER BY

### Usage
`ORDER BY` is used to sort the results of a query in ascending or descending order.

:::caution
Ordering data requires holding it in RAM. For large operations, we suggest you check you have sufficient memory to perform the operation.
:::

### Syntax
```sql
SELECT COLUMN1, COLUMN2...
FROM TABLENAME
ORDER BY COLUMN1 [ASC]|DESC, COLUMN2 [ASC]|DESC ...;
```

:::tip
Default order is `ASC`. You can omit to order in ascending order.
:::


### Examples
Order by one column in ascending order:
```sql title="Omitting ASC will default to ascending order"
ratings ORDER BY userId;
```

```sql title="Ordering in descending order"
ratings ORDER BY userId DESC;
```

```sql title="Multi-level ordering"
ratings ORDER BY userId, rating DESC;
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

:::tip
SELECT DISTINCT can be used in conjunction with more advanced queries and filters.
:::

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

:::note
In other implementations of SQL, this is sometimes replaced by statements such as `OFFSET` or `ROWNUM`
Our implementation of `LIMIT` encompasses both in one statement.
:::

### Syntax
Statements with `LIMIT` follow this syntax:

```sql
SELECT column1, column2, ...
FROM table 
LIMIT NUM_ROWS;
```

Where
`NUM_ROWS` is the number of rows you want to return with the query.

:::tip Limit will by default start from the TOP of the table. If you would like to get results
from the BOTTOM of the table, then `l` should be a `negative number`.
:::

### Examples
The following will return the TOP 5 results.
```sql
SELECT * FROM ratings LIMIT 5;
```

The following will return the BOTTOM 5 results:
```sql
SELECT * FROM ratings LIMIT -5;
```

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

## LATEST BY

### Overview
`LATEST BY` is used to retrieve the latest entry by timestamp for a given key or combination of keys

:::note
To use `LATEST BY`, one column needs to be designated as `timestamp`. Find out more in the **[designated timestamp](designatedTimestamp.md)** section.
:::

:::note
latest by performance note: QuestDB will search time series from newest values to oldest. For single SYMBOL column in latest by clause QuestDB will know all distinct values upfront. Time series scan will end as soon as all values are matched. For all other field types, or multiple fields QuestDB will scan entire time series. Although scan is very fast you should be aware that in certain setups, performance will degrade on hundreds of millions of records.
:::



### Syntax
```sql
SELECT columns
FROM table 
LATEST BY column_name 
```

:::note
By default, QuestDB executes `where` clauses before `latest by`. To execute `where` after `latest by`, you need 
to use sub-queries using brackets. See the following two queries as example.
:::

### Examples
```sql title="Latest balance by customer and currency"
SELECT cust_id, balance_ccy, balance 
FROM balances 
LATEST BY cust_id, balance_ccy;
```

```sql title="Latest balance by customer and currency, with filters"
SELECT cust_id, balance_ccy, balance 
FROM balances 
LATEST BY cust_id, balance_ccy 
WHERE cust_id=1 AND balance > 500;
```


:::note
The below two queries illustrate how to change the execution order in a query by using brackets. This makes it possible 
to simply answer two different questions.
:::

```sql title="Select the latest balances which were above 800"
balances latest by cust_id, balance_ccy
WHERE balance > 800;
```

```sql title="Select latest balances, then filter to only keep balances aboge 800"
(balances latest by cust_id, balance_ccy) --note the brackets
WHERE balance > 800;
```

## SAMPLE BY 

### Overview
`SAMPLE BY` is used on time-series data to summarise large datasets into aggregates of homogeneous time chunks.

:::note
To use `SAMPLE BY`, one column needs to be designated as `timestamp`. Find out more in the **[designated timestamp](designatedTimestamp.md)** section.
:::

### Syntax
```sql
SELECT columns
FROM table 
SAMPLE BY nSAMPLE_SIZE
```

WHere `SAMPLE_SIZE` is the unit of time by which you wish to aggregate your results, and `n` is the number of
 time-chunks that will be summarised together. 

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

Available options for `FILL_OPTION` are

|Option | Description|
|---|---|
|`NONE`| Will not fill. In case there is no data, the time-chunk will be skipped in the results. This means your table could potentially be missing intervals. |
|`NULL`| Fills with `null` |
|`PREV`| Fills using the previous value |
|`LINEAR`| Fills by linear interpolation of the 2 surrounding points |
|`x`| Fills with the constant defined (replace the `x` by the value you want. For example `fill 100.05`  |

:::note
Fill is used on aggregations such as sum(), count() etc.
:::

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
