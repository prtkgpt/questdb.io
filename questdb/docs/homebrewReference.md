---
id: homebrewReference
title: Homebrew Reference
sidebar_label: Homebrew Reference
---


QuestDB is distributed via Homebrew to use on MacOS. This is useful when you want to perform fast analytics 
on data files using your own local machine. This requires a 64-bit MacOS machine. 

## Setup

Follow the steps below to install and uninstall the QuestDB service using Homebrew.

#### Installing the service
```shell script
brew install questdb
```

#### Uninstalling the service
```shell script
brew uninstall questdb
```

#### Root directory

By default, QuestDB `root_directory` will be the following
```shell script
/usr/local/var/questdb/
```

## Using QuestDB

```shell script
questdb [start|stop|status] [-d dir] [-f] [-t tag] 
```

|Command | Description |
|-----|------|
|[start](#start)| Starts the service. Default service name is `QuestDB`  |
|[stop](#stop) | Stops the service |
|[status](#status) | Shows service status. This command is useful for troubleshooting problems with the service. It prints `RUNNING` or `INACTIVE` if the service is start or stopped respectively |


### Start 
`start` - starts the questdb service.

```shell script
questdb start
```

#### Behaviour
QuestDB will start and run in the background and continue running even if you close the session. You will need to actively [stop it](#stop).


#### Default directories
By default, QuestDB [root directory](rootDirectoryStructure.md) will be the following
```shell script
/usr/local/var/questdb/
```


#### Options
- `-d` - specify QuestDB's `root_directory`. 
- `-f` - force reload the web console. The web console is cached otherwise and the HTML page will not be reloaded automatically in case it has been changed.
- `-t` - specify a service tag. You can use this option to run several services and administer them separately.

##### Examples
<!--DOCUSAURUS_CODE_TABS-->
<!-- Start (-d) -->
```shell script
questdb start -d '/home/user/my_new_root_directory'
```
<!-- Start (-d -t) -->
```shell script
questdb start -d '/home/user/my_new_root_directory' -t 'mytag' 
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Stop
`stop` - stops the default `questdb` service, or the service specified with the `-t` option.

#### Examples
<!--DOCUSAURUS_CODE_TABS-->
<!--Stop (default)-->
```shell script
questdb stop
```
<!--Stop (specific tag)-->
```shell script
questdb stop -t 'my-questdb-service'
```
<!--END_DOCUSAURUS_CODE_TABS-->


### Status
`status` shows service status. This command is useful for troubleshooting problems with the service. It prints `Running` or `Not running` if the service is start or stopped respectively. On Unix systems, it also prints the `PID`

#### Examples
<!--DOCUSAURUS_CODE_TABS-->
<!--Status (default)-->
```shell script
questdb status
```
<!--Status (specific tag)-->
```shell script
questdb status -t 'my-questdb-service'
```
<!--END_DOCUSAURUS_CODE_TABS-->
