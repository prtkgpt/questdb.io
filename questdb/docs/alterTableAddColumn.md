---
id: alterTableAddColumn
title: ALTER TABLE ADD COLUMN
sidebar_label: ALTER TABLE ADD COLUMN
---


## Synopsis

Adds new empty column to existing table

## Syntax

		
![alter table syntax](/static/img/alter-table.svg)

![add column syntax](/static/img/alter-table-add-column.svg)

## Description

Single column is added instantly and is not back-populated even if table contains data. Please refer our guide to [the data types](datatypes.md).
Adding a new column does not lock the table for reading and also does not wait on any reads to finish.

While single column is added atomically, adding multiple columns is not an atomic operation. QuestDB will stop adding remaining columns on the list on the first failure.
It is therefore possible to add some columns and not others.

## Example
The following example adds a new column called `comment` that is of `STRING` type to the table `ratings`

```sql
ALTER TABLE ratings ADD COLUMN comment STRING
```

If you adding `symbol` column you can also specify symbol related options, for example:

```sql
ALTER TABLE ratings ADD COLUMN comment SYMBOL NOCACHE INDEX
```

Both `nocache` and `index` keywords are optional