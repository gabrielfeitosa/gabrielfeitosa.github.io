---
title: Estatísticas do PostgreSql com o PgHero
layout: post
permalink: estatistica-do-postgressql-com-o-pghero
comments: true
categories: [tools]
tags: [database, bancodedados, postgres, pghero]  
date: 2019-04-08T10:00:00Z
---
Sabe aquelas consultas geradas automaticamente pelo seu framework ORM predileto? E aquelas queries "malucas" que fazemos e não verificamos o plano de execução? Estamos fazendo full scan na tabela ou usando o índice certo? Então, isso tudo pode onerar a saúde do banco de dados e ficamos sem entender o porque da aplicação está cada vez mais lenta.

Se você se identifica com isso, tanto quanto eu, então não se avexe. Neste post, olharemos como usar o [pghero](https://github.com/ankane/pghero) para monitorar a performance das queries executadas no PostgresSQL.
<!--more-->

# O que é o PgHero?

![PgHero Dashboard](/img/pghero.png){:height="50%" width="50%"}


Segundo a definição do [repositório do projeto no github](https://github.com/ankane/pghero): 
> A performance dashboard for Postgres

Isso só é possível por causa do coletor de estatísticas do Postgres. Caso deseje entender mais desse universo, [acesse a documentação oficial do Postgres falando sobre o coletor de estatísticas](https://www.postgresql.org/docs/9.6/monitoring-stats.html).

Com o PgHero, podemos descobrir quais as consultas estão levando mais tempo para serem executas, se há ausência de índice em alguma query, quais conexões estão ativas, além de outras tantas funcionalidades.

# Como usar

Há algumas formas de usar o PgHero, mas recomendo que use o Docker. Abaixo temos um arquivo docker-compose para subir uma instância do postgres e do PgHero. A configuração é bem simples, você precisa passar somente os parâmetros de conexâo e o resto é responsabilidade do PgHero.

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

Caso queira ver mais detalhes sobre a instalação com o docker, [acesse a documentação oficial](https://github.com/ankane/pghero/blob/master/guides/Docker.md).

Apesar de ser uma análise bem superficial, a intenção é que você conheça e explore a ferramente. Ela é bem simples, tem me ajudado bastante no dia a dia.

Você já usou? Quais as suas percepções? Conhece alguma ferramenta similar para Postgres ou para outro banco? Comenta aí para trocarmos uma ideia.

Por hoje é isso, espero que tenham gostado! Se curtiu, não deixe de compartilhar! 😉

Abraços e até a próxima.
