---
id: fill
title: FILL
sidebar_label: FILL
---

Specifies fill behavior for missing data for as part of a [SAMPLE BY](sampleBy.md) aggregation query.

### Syntax
![fill syntax](/static/img/doc/diagrams/fill.svg)

#### Options

There are as many `fillOption` as there are `aggreate` columns in your query.

|fillOption | Description|
|---|---|
|`NONE`| Will not fill. In case there is no data, the time-chunk will be skipped in the results. This means your table could potentially be missing intervals. |
|`NULL`| Fills with `null` |
|`PREV`| Fills using the previous value |
|`LINEAR`| Fills by linear interpolation of the 2 surrounding points |
|`x`| Fills with the constant defined (replace the `x` by the value you want. For example `fill 100.05`  |


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