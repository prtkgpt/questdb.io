---
id: guideBinaries
title: How to use QuestDB with the binaries
sidebar_label: Using the binaries
---


This guides shows how to install QuestDB using the binaries and how to start using the server.

>For complete information on how to use QuestDB's binary, please refer to the [Binaries reference](binariesReference.md)

## Setup QuestDB

You need Java 11 or above. To check installation, use
```shell script
java -version
```

If you do not already have Java installed, download and install the package for your architecture 
 <a href="https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html" target="_blank">here</a>.
 
Then, download the QuestDB binaries by clicking [here](https://github.com/questdb/questdb/releases/download/4.2.1/questdb-4.2.1-bin.tar.gz) to download QuestDB's binaries (4mb)

The binaries come as a tarball. Extract it as follows.
```shell script
tar -xvf questdb-4.2.1-bin.tar.gz
```


## Start QuestDB
Navigate to the directory created in the previous step
```shell script
cd questdb-4.2.1-bin.tar.gz
```

To start the QuestDB server service, simply run the below
<!--DOCUSAURUS_CODE_TABS-->
<!--Linux & MacOS-->
```sql
./questdb.sh start
```
<!--Windows-->
```sql
questdb.exe start
```
<!--END_DOCUSAURUS_CODE_TABS-->

This will use the following [root directories](rootDirectoryStructure.md)
<!--DOCUSAURUS_CODE_TABS-->
<!--Linux -->
```shell script
$HOME/.questdb
```
<!--MacOS -->
```shell script
/usr/local/var/questdb/
```
<!--Windows-->
```shell script
C:\Windows\System32\questdb
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Status
You can use the following to get the status of the QuestDB service. 
```shell script
questdb status
```

## Using QuestDB
Here are some guides to get started using the QuestDB service. These will show you how to import data and run queries
- with the [HTTP API](guidePSQL.md)
- with [psql](guidePSQL.md) over Postgres wire protocol

## Stop QuestDB
Stop the QuestDB service as follows
<!--DOCUSAURUS_CODE_TABS-->
<!--Linux & MacOS-->
```sql
./questdb.sh stop
```
<!--Windows-->
```sql
questdb.exe stop
```
<!--END_DOCUSAURUS_CODE_TABS-->

