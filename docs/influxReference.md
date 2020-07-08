---
id: influxReference
title: Influx Line Protocol Reference
---


QuestDB is able to ingest data over **Influx Line Protocol**. Existing systems already publishing line protocol
need not change at all. Although QuestDB uses relational model, line protocol parser will automatically create
tables and add missing columns.

For the time being QuestDB can listen for UDP packets, either multicast or unicast. TCP and HTTP support for line
protocol is on our road map. Find an example of how to use this [here](influxSenderLibrary.md)

:::info
QuestDB listens for multicast on `232.1.2.3:9009`. The address change or switch to unicast can be done via configuration. If you run QuestDB via Docker
start container as `run --rm -it -p 9000:9000 -p 8812:8812 -p 9009:9009 --net=host questdb/questdb`  and publish
multicast packets with TTL of at least 2.
:::

### Syntax
Influx Line Protocol follows this syntax

```shell script title="ILP syntax"
table_name,tagset valueset  timestamp
```

where:

| Element               | Definition                                                                                 |
|-----------------------|--------------------------------------------------------------------------------------------|
| `table_name`            | Name of the table where QuestDB will write data.                                           |
| `tagset`                | Array of string key-value pairs  separated by commas that represent the reading's associated metadata|
| `values`                | Array of key-value pairs separated by commas that represent the readings. The keys are string, values can be numeric or boolean|
| `timestamp`             | UNIX timestamp. By default in microseconds. Can be changed in the configuration (see below) |

:::tip
When the `table_name` does not correspond to an existing table, QuestDB will create the table on the fly using the name
provided. Column types will be automatically recognized and assigned based on the data.
:::

#### Examples
Let's assume the following data:

|timestamp             | city            | temperature           | humidity              | make              |
|----------------------|-----------------|-----------------------|-----------------------|-------------------|
|1465839830100400000   | London          | 23.5                  | 0.343                 | Omron             |
|1465839830100600000   | Bristol         | 23.2                  | 0.443                 | Honeywell         |
|1465839830100700000   | London          | 23.6                  | 0.358                 | Omron             |


Line protocol to insert this data in the `readings` table would look like this:
```shell script
readings,city=London,make=Omron temperature=23.5,humidity=0.343 1465839830100400000
readings,city=Bristol,make=Honeywell temperature=23.2,humidity=0.443 1465839830100600000
readings,city=London,make=Omron temperature=23.6,humidity=0.348 1465839830100700000
```

:::note
There are only 2 spaces in each line. First between the `tagset` and `values`. Second between
`values` and `timestamp`.
:::

### Dealing with irregularly-structured data
:::info
QuestDB can support on-the-fly data structure changes with minimal overhead. Should users decide to send
varying quantities of readings or metadata tags for different entries, QuestDB will adapt on the fly.
:::

Influx line protocol makes it possible to send data under different shapes. Each new entry may contain certain 
metadata tags or readings, and others not. Whilst the example just above
highlights structured data, it is possible for Influx line protocol users to send data as follows.

```shell script
readings,city=London temperature=23.2 1465839830100400000
readings,city=London temperature=23.6 1465839830100700000
readings,make=Honeywell temperature=23.2,humidity=0.443 1465839830100800000
```

Note that on the third line, 
- a new `tag` is added: "make"
- a new `field` is added: "humidity"

After writing two entries, the data would look like this

|timestamp             | city            | temperature           |
|----------------------|-----------------|-----------------------|
|1465839830100400000   | London          | 23.5                  |
|1465839830100700000   | London          | 23.6                  | 

The third entry would result in the following table

|timestamp             | city            | temperature           | humidity              | make              |
|----------------------|-----------------|-----------------------|-----------------------|-------------------|
|1465839830100400000   | London          | 23.5                  | NULL                  | NULL              |
|1465839830100700000   | London          | 23.6                  | NULL                  | NULL              |
|1465839830100800000   | NULL            | 23.2                  | 0.358                 | Honeywell         |

:::tip
Adding columns on the fly is no issue for QuestDB. New columns will be created in the affected partitions, and only
populated if they contain values. Whilst we offer this function for flexibility. However, we recommend that users try to minimise 
structural changes to maintain operational simplicity. 
:::

### Configuration
The following configuration parameters can be added to the configuration file to customise the interaction using 
Influx line protocol. The configuration file is found under `/questdb/conf/questdb.conf`

:::info
For more information on configuration keys, refer to the [configuration reference](serverConf.md).
:::

| Property                       | Type           | Default value  | Description                                         |
|--------------------------------|----------------|----------------|-----------------------------------------------------|
|`line.udp.join`               | `string`       |*"232.1.2.3"*   | Multicast address receiver joins. This values is ignored when receiver is in "unicast" mode   |
|`line.udp.bind.to`            | `string`       |*"0.0.0.0:9009"* | IP address of the network interface to bind listener to and port. By default UDP receiver listens on all network interfaces|
|`line.udp.commit.rate`       | `long`         |*1000000*        | For packet bursts the number of continuously received messages after which receiver will force commit. Receiver will commit irrespective of this parameter when there are no messages.                 |
|`line.udp.msg.buffer.size`    | `long`         |*2048*          | Buffer used to receive single message. This value should be roughly equal to your MTU size.                |
|`line.udp.msg.count`          | `long`         |*10000*        | Only for Linux. On Linix QuestDB will use recvmmsg(). This is the max number of messages to receive at once.                                                    |
|`line.udp.receive.buffer.size`| `long`         |*8388608*       | UDP socket buffer size. Larger size of the buffer will help reduce message loss during bursts.                                                    |
|`line.udp.enabled`            | `boolean`      |*true*          | Flag to enable or disable UDP receiver                                                    |
|`line.udp.own.thread`         | `boolean`      |*false*         | When "true" UDP receiver will use its own thread and busy spin that for performance reasons. "false" makes receiver use worker threads that do everything else in QuestDB.                                                    |
|`line.udp.own.thread.affinity`         | `int`      |*-1*    |  -1 does not set thread affinity. OS will schedule thread and it will be liable to run on random cores and jump between the. 0 or higher pins thread to give core. This propertly is only valid when UDP receiver uses own thread. |
|`line.udp.unicast`            | `boolean`      |*false*         | When true, UDP will me unicast. Otherwise multicast |
|`line.udp.timestamp`          | `string` | "n" | Input timestamp resolution. Possible values are "n", "u", "ms", "s" and "h". |
|`line.udp.commit.mode`        | `string` | "nosync" | Commit durability. Available values are "nosync", "sync" and "async"   |

