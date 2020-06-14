---
id: dockerReference
title: Docker reference
---


Docker is a convenient method to have QuestDB running very quickly via simple commands. You will of course need Docker
to be installed on your system. QuestDB has images for Windows and Linux along with a manifest to automatically
download correct image for your target architecture.

> Using Docker means QuestDB will be running in a virtualized environment with up to 20% performance penalty.

You can find our docker repository **<a href="https://hub.docker.com/r/questdb/questdb" target="_blank">here</a>**.

#### Supported platforms
- Linux
- Windows

## Pulling the image
#### Latest
```shell script
docker pull questdb/questdb
```

#### Specific tag
```shell script
docker pull questdb/questdb:4.2.1
```

## Using the image
You can use the Docker image in two ways:
- [Run as a container](#run-as-a-container)
- [Run as an interactive sandbox](#run-as-an-interactive-sandbox)

>The interactive sandbox will create a container on the fly and start it. Once stopped, the container will be
removed and the data deleted.

#### Ports & security

QuestDB requires that you open ports to allow for interactions with the HTTP server and the Postgres wire.
If you do not want to open either of these ports, you can alter the [port options](#-p-ports). However doing so may limit your interaction with QuestDB.

### Run as a container

#### Create a container

```shell script
docker create --name questdb -p 9000:9000 -p 8812:8812 questdb/questdb
```

If you would like to use a specific release tag, you can specify it as follows when creating the container:

```shell script
docker create --name questdb -p 9000:9000 -p 8812:8812 questdb/questdb:4.2.1
```

##### Options

<table class="alt">
<thead>

<th>Option</th>
<th>Comments</th>

</thead>
<tbody>
<tr>
<td><code>--name</code></td>
<td>Name of your container. e.g <code>--name questdb</code></td>
</tr>
<tr>
<td><code>-p</code> (optional)</td>
<td>Allows Docker to expose a port e.g <code>-p 9000:9000</code> will expose port 9000.
Though the parameter is optional, not opening the ports will limit interactions with the database.</td>
</tr>
<tr>
<td><code>-v</code> (optional)</td>
<td>Specify a path where QuestDB will save your data directly on the host machine e.g <code>-v /local/dir:/root/.questdb/db</code></td>
</tr>
</tbody>
</table>

##### -p ports
- `-p 9000:9000` opens port 9000 for the HTTP API and the web console. The web console is available on localhost:9000.
- `-p 8812:8812` opens port 8812 for the PostgresSQL wire protocol.
- `-p 9009:9009` opens port 9009 to listen for UDP Influx line protocol

##### -v volumes
The questdb [root_directory](rootDirectoryStructure.md) will be in the following locations.

| Container OS | Volume |
|-----|-----|
| Linux containers | `/root/.questdb/db` |
| Windows containers | `c:\questdb\db` |

#### Start the container
```shell script
docker start questdb
```

#### Stop the container
```shell script
docker stop questdb
```

#### Display logs
```shell script
docker logs questdb
```

#### Remove a container
```shell script
docker rm questdb
```

### Run as an interactive sandbox

You can run the container as an interactive sandbox with the `-it` option.

#### Differences compared to running a container
- You do not need to create the container beforehand: it will be created on the fly.
- Logs will be displayed in the shell window.
- The container and all the data will be deleted when the container stops.

#### Start the sandbox
```shell script
docker run --rm -it -p 9000:9000 -p 8812:8812 questdb/questdb
```

#### Stop the sandbox
As the process will be running in shell, you can `CTRL + C` to stop it.


### Log into the container

You can log into the container and interact using `cmd` (if your container is windows-based) or `bash`
(if your container is linux-based). If you are using a MacOS or linux machine, this will also be `bash`. If you
are using a Windows machine, it could be either `cmd` or `bash` depending on what type of container you
are running.

**On Linux containers**
```shell script
docker exec -i questdb bash
```

**On Windows containers**
```shell script
docker exec -i questdb cmd
```

Once logged in, you can run commands into the container's VM.
