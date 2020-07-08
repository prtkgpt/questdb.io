---
id: serverConf
title: Server Configuration Properties
sidebar_label: Configuration Properties
---


QuestDB server configuration can be set in the `server.conf` configuration file.
When a key is absent from the configuration file, the default value is used.

### Customising the configuration

To override a default value with a custom value, add the key in the configuration file as follows
```shell script
aaa.bbb.ccc.ddd=myValue
```

For example 
```shell script
shared.worker.count=5
```

:::note
A restart of QuestDB is required to pickup the new configuration
:::

### Available keys and default values

#### Worker config
|Property|Default value|Description|
|---|---|---|
|shared.worker.count|2|Maximum number of threads used by the HTTP server|
|shared.worker.affinity|||
|shared.worker.haltOnError|false||

#### HTTP server config
|Property|Default value|Description|
|---|---|---|
|http.enabled|true||
|http.connection.pool.initial.capacity|16||
|http.connection.string.pool.capacity|128||
|http.multipart.header.buffer.size|512||
|http.multipart.idle.spin.count|10_000||
|http.receive.buffer.size|1024 * 1024||
|http.request.header.buffer.size|32 * 2014||
|http.response.header.buffer.size|32 * 1024||
|http.worker.count|0||
|http.worker.affinity|httpWorkerCount||
|http.worker.haltOnError|false||
|http.send.buffer.size|2 * 1024 * 1024||
|http.static.index.file.name|index.html||
|http.frozen.clock|false||
|http.allow.deflate.before.send|false||
|http.keep-alive.timeout|5||
|http.keep-alive.max|10_000||
|http.static.pubic.directory|public||
|http.net.active.connection.limit|256||
|http.net.event.capacity|1024||
|http.net.io.queue.capacity|1024||
|http.net.idle.connection.timeout|5 * 60 * 1000L||
|http.net.interest.queue.capacity|1024||
|http.net.listen.backlog|256||
|http.net.snd.buf.size|2 * 1024 * 1024||
|http.net.rcv.buf.size|2 * 1024 * 1024||
|http.text.date.adapter.pool.capacity|16||
|http.text.json.cache.limit|16384||
|http.text.json.cache.size|8192||
|http.text.max.required.delimiter.stddev|0.1222d||
|http.text.max.required.line.length.stddev|0.8||
|http.text.metadata.string.pool.capacity|128||
|http.text.roll.buffer.limit|1024 * 4096||
|http.text.roll.buffer.size|1024||
|http.text.analysis.max.lines|1000||
|http.text.lexer.string.pool.capacity|64||
|http.text.timestamp.adapter.pool.capacity|64||
|http.text.utf8.sink.size|4096||
|http.json.query.connection.check.frequency|1_000_000||
|http.json.query.float.scale|10||
|http.bind.to|0.0.0.0:9000||

#### Cairo config
|Property|Default value|Description|
|---|---|---|
|cairo.sql.copy.root|null||
|cairo.sql.backup.root|null||
|cairo.sql.backup.dir.datetime.format|null||
|cairo.sql.backup.dir.tmp.name|tmp||
|cairo.sql.backup.mkdir.mode|509||
|cairo.root|db||
|cairo.commit.mode|||
|cairo.create.as.select.retry.count|5||
|cairo.default.map.type|fast||
|cairo.default.symbol.cache.flag|false||
|cairo.default.symbol.capacity|256||
|cairo.file.operation.retry.count|30||
|cairo.idle.check.interval|5 * 60 * 1000L||
|cairo.inactive.reader.ttl|-10000||
|cairo.inactive.writer.ttl|-10000||
|cairo.index.value.block.size|256)||
|cairo.max.swap.file.count|30||
|cairo.mkdir.mode|509||
|cairo.parallel.index.threshold|100000||
|cairo.reader.pool.max.segments|5||
|cairo.spin.lock.timeout|1_000_000||
|cairo.cache.rows|16||
|cairo.cache.blocks|4||
|cairo.character.store.capacity|1024||
|cairo.character.store.sequence.pool.capacity|64||
|cairo.column.pool.capacity|4096||
|cairo.compact.map.load.factor|0.7||
|cairo.expression.pool.capacity|8192||
|cairo.fast.map.load.factor|0.5||
|cairo.sql.join.context.pool.capacity|64||
|cairo.lexer.pool.capacity|2048||
|cairo.sql.map.key.capacity|2048 * 1024||
|cairo.sql.map.page.size|4 * 1024 * 1024||
|cairo.model.pool.capacity|1024||
|cairo.sql.sort.key.page.size|4 * 1024 * 1024||
|cairo.sql.sort.light.value.page.size|1048576||
|cairo.sql.hash.join.value.page.size|16777216||
|cairo.sql.latest.by.row.count|1000||
|cairo.sql.hash.join.light.value.page.size|1048576||
|cairo.sql.sort.value.page.size|16777216||
|cairo.work.steal.timeout.nanos|10_000||
|cairo.parallel.indexing.enabled|true||
|cairo.sql.join.metadata.page.size|16384||
|cairo.sql.analytic.column.pool.capacity|64||
|cairo.sql.create.table.model.pool.capacity|16||
|cairo.sql.column.cast.model.pool.capacity|16||
|cairo.sql.rename.table.model.pool.capacity|16||
|cairo.sql.with.clause.model.pool.capacity|128||
|cairo.sql.insert.model.pool.capacity|64||
|cairo.sql.copy.model.pool.capacity|32||
|cairo.sql.copy.buffer.size|2 * 1024 * 1024||
|cairo.sql.copy.formats.file|/text_loader.json|);|
|cairo.date.locale|en||
|cairo.timestamp.locale|en||



#### Influx Line Protocol config
| Property                       | Type           | Default value  | Description                                         |
|--------------------------------|----------------|----------------|-----------------------------------------------------|
|line.udp.join               | `string`       |*"232.1.2.3"*   | Multicast address receiver joins. This values is ignored when receiver is in "unicast" mode   |
|line.udp.bind.to            | `string`       |*"0.0.0.0:9009"* | IP address of the network interface to bind listener to and port. By default UDP receiver listens on all network interfaces|
|line.udp.commit.rate       | `long`         |*1000000*        | For packet bursts the number of continuously received messages after which receiver will force commit. Receiver will commit irrespective of this parameter when there are no messages.                 |
|line.udp.msg.buffer.size    | `long`         |*2048*          | Buffer used to receive single message. This value should be roughly equal to your MTU size.                |
|line.udp.msg.count          | `long`         |*10000*        | Only for Linux. On Linix QuestDB will use recvmmsg(). This is the max number of messages to receive at once.                                                    |
|line.udp.receive.buffer.size| `long`         |*8388608*       | UDP socket buffer size. Larger size of the buffer will help reduce message loss during bursts.                                                    |
|line.udp.enabled            | `boolean`      |*true*          | Flag to enable or disable UDP receiver                                                    |
|line.udp.own.thread         | `boolean`      |*false*         | When "true" UDP receiver will use its own thread and busy spin that for performance reasons. "false" makes receiver use worker threads that do everything else in QuestDB.                                                    |
|line.udp.own.thread.affinity         | `int`      |*-1*    |  -1 does not set thread affinity. OS will schedule thread and it will be liable to run on random cores and jump between the. 0 or higher pins thread to give core. This propertly is only valid when UDP receiver uses own thread. |
|line.udp.unicast            | `boolean`      |*false*         | When true, UDP will me unicast. Otherwise multicast |
|line.udp.timestamp          | `string` | "n" | Input timestamp resolution. Possible values are "n", "u", "ms", "s" and "h". |
|line.udp.commit.mode        | `string` | "nosync" | Commit durability. Available values are "nosync", "sync" and "async"   |

