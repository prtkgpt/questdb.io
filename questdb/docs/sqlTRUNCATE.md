---
id: truncate
title: TRUNCATE TABLE
sidebar_label: TRUNCATE TABLE
---

## TRUNCATE TABLE
`TRUNCATE TABLE` is used to permanently delete the contents of a table without deleting the table itself.

### Syntax
`TRUNCATE TABLE` uses the following syntax

```sql
TRUNCATE TABLE 'TABLE_NAME';
```

### Examples
```sql
TRUNCATE TABLE ratings;
```

> When you would like to delete both the data and the table structure, use **[DROP](sqlDROP.md)**.