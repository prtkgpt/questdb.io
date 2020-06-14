---
id: alterTableDropColumn
title: ALTER TABLE DROP COLUMN
sidebar_label: ALTER TABLE DROP COLUMN
---

## Synopsis

Drops column from existing table.

## Syntax

![alter table syntax](/static/img/alter-table.svg)
![drop column syntax](/static/img/alter-table-drop-column.svg)

## Description

Drops (removes) column from existing table. Before the operation can proceed it commits current transaction. Hence transaction
is committed regardless of the success or failure of the drop.  

Dropping column does not lock the table for reading and also does not wait on any reads to finish. Drop column will also attempt to
remove column files from all partitions, thus freeing up disk space right away. On Windows OS that may not be possible and
file remove operation is postponed until files are released by all threads. However logical drop column will succeed on Windows in
presence of active readers.

## Example
The following example deletes the column called `comment` from the table `ratings`

```sql
ALTER TABLE ratings DROP COLUMN comment
```
