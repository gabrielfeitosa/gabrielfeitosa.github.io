---
title: PgHero
layout: post
permalink: 
comments: true
categories: [tools]
tags: [database, bancodedados, postgres, pghero]  
---
Sabe aquelas consultas geradas automaticamente pelo seu framework ORM predileto? E aquelas queries "malucas" que fazemos e não verificamos o plano de execução? Estamos fazendo full scan na tabela ou usando o índice certo? Então, isso tudo pode onerar a saúde do banco de dados e ficamos sem entender o porque da aplicação está cada vez mais lenta.

Se você se identifica com isso, tanto quanto eu, então não se avexe. Neste post, olharemos como usar o [pghero](https://github.com/ankane/pghero) para monitorar a performance das queries executadas no PostgresSQL.
<!--more-->


# Subindo o LocalStack

A primeira ação que tomaremos será subir o LocalStack na nossa máquina. Vou utilizar a imagem docker oficial disponibilizada por eles. Para facilitar nossas vidas, há um arquivo docker-compose disponível no [github do projeto](https://github.com/localstack/localstack/blob/master/docker-compose.yml).

Como usaremos somente o serviço de fila, delimitei no docker-compose abaixo que somente o SQS será habilitado e responderá na porta 4576. 

```yaml
version: '3'

services:
  postgres:
    image: postgres
    environment:
      POSTGRES_PASSWORD: "postgres"
    ports:
      - "5432:5432"
  pghero:
    image: ankane/pghero
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
    ports:
      - "8080:8080"
```

Para subir os container, utilize o comando abaixo:

```sh
$ docker-compose up
```

Uma vez que o PgHero estiver rodando na sua máquina, você poderá acessar a interface web através da url http://localhost:8080. 

...
Bom, por hoje é isso galera, espero que tenham gostado! Se curtiu, não deixe de compartilhar! 😉

Abraços e até a próxima.
