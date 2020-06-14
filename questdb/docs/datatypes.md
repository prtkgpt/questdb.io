---
id: datatypes
title: Data types
sidebar_label: Data Types
---

    
The type system is derived from Java types.

| Type Name   | Storage bits | Description                     |
| ----------: | -----------: | ------------------------------- |
| _boolean_    | `1`          | boolean  `true` or `false` |
| _byte_      | `8`          | signed integer  `-128` to `127` |
| _short_     | `16`         | signed integer  `-32768` to `32767` |
| _char_      | `16`         | `unicode` character |
| _int_       | `32`         | signed integer  `0x80000000` to `0x7fffffff` |
| _float_     | `32`         | single precision IEEE 754 floating point value |
| _symbol_    | `32`         | Symbols are stored as 32-bit signed indexes from symbol table. Each index will have a corresponding `string` value. Translation from index to string value is done automatically when data is being written or read. Symbol table is stored separately from column.|
| _string_    | `32+n*16`    | Length-prefixed sequence of UTF-16 encoded characters whose length is stored as signed 32-bit integer with maximum value of `0x7fffffff`.|
| _long_      | `64`         | signed integer  `0x8000000000000000L` to `0x7fffffffffffffffL` |
| _date_      | `64`         | signed offset in **milliseconds** from [Unix Epoch](https://en.wikipedia.org/wiki/Unix_time) |
| _timestamp_ | `64`         | signed offset in **microseconds** from [Unix Epoch](https://en.wikipedia.org/wiki/Unix_time) |
| _double_    | `64`         | double precision IEEE 754 floating point value |
| _binary_    | `64+n*8`     | Length-prefixed sequence of bytes whose length is stored as signed 64-bit integer with maximum value of `0x7fffffffffffffffL`.|
| _long256_   | `256`        | unsigned 256-bit integer |

> `BINARY` field size is limited either by 64-Bit signed int (8388608 peta bytes) or disk size, whichever is smaller.

> `STRING` field size is limited by either 32-bit signed int (1073741824 characters) or disk size, whichever is smaller.