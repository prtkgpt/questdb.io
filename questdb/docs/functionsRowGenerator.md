---
id: functionsRowGenerator
title: Row Generator
sidebar_label: Row Generator
---


## long_sequence
- `long_sequence(iterations)` - generates rows.
- `long_sequence(iterations, seed1, seed2)` - generates rows with deterministic randomness.

#### Arguments
-`iterations`: is a `long` representing the number of rows to generate.
-`seed1` and `seed2` are `long64` representing both parts of a `long128` seed.

#### Description

##### Row generation
`long_sequence(iterations)` is used to:
- Generate a number of rows defined by `iterations`.
- Generate a column `x:long` of monotonically increasing long integers starting from 1, which 
can be accessed for queries.

> do not be afraid to generate very large datasets for your testing e.g billions of rows or more if your disk allows.

##### Random number seed
When `long_sequence` is used conjointly with [random generators](functionsRandomValueGenerators.md), these values are 
usually generated at random. It is sometimes useful to generate deterministic datasets which allows to perform testing 
on vasts amounts of data without actually moving large files around. Using the same seed on any machine at any time will 
consistently produce the same results for all random functions.

#### Examples
- Generating multiple rows

```sql
SELECT x, rnd_double() FROM long_sequence(5);
```

| x         | rnd_double        |
|-----------|-------------------|
| 1         | 0.3279246687      |
| 2         | 0.8341038236      |
| 3         | 0.1023834675      |
| 4         | 0.9130602021      |
| 5         | 0.718276777       |

- Accessing row number via `x` column

```sql
SELECT x, x*x FROM long_sequence(5);
```

| x       | x*x     |
|---------|---------|
| 1       | 1       |
| 2       | 4       |
| 3       | 9       |
| 4       | 16      |
| 5       | 25      |


- Using with a seed
```sql
SELECT rnd_double() from long_sequence(2,128349234,4327897);
```

> The results below will be the same on any machine at any time as long as they use the same seed in long_sequence.

| rnd_double|
|---|
|0.8251337821991485|
|0.2714941145110299|