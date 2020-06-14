---
id: insert
title: INSERT 
sidebar_label: INSERT
---

## Synopsis
 
Inserts data into a database table

## Syntax

![insert data](/static/img/insert-into-table.svg)

## Examples

### Inserting values
```sql
INSERT INTO trades values(to_timestamp('2019-10-17T00:00:00', 'yyyy-MM-ddTHH:mm:ss'),'AAPL',255,123.33,'B');
```

### Inserting values specifying columns
```sql
INSERT INTO trades (timestamp, symbol, quantity, price, side) values(to_timestamp('2019-10-17T00:00:00', 'yyyy-MM-ddTHH:mm:ss'),'AAPL',255,123.33,'B');
```

Note that columns can be omitted during `INSERT` in which case value will be `NULL`

```sql
INSERT INTO trades (timestamp, symbol, price) values(to_timestamp('2019-10-17T00:00:00', 'yyyy-MM-ddTHH:mm:ss'),'AAPL','B');
```

### Inserting query results
```sql
INSERT INTO confirmed_trades 
    SELECT timestamp, instrument, quantity, price, side
    FROM unconfirmed_trades
    WHERE trade_id = '47219345234'
;
```

> Note that using this method, you may insert one or several results at once depending on the output of your query.