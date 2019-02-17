---
title: Simulando ambiente da AWS com o localstack
layout: post
permalink: simulando-aws-com-localstack
comments: true
categories: [aws, java, tools]
tags: [aws, sqs, java, docker]
image:
  feature: localstack.png  
---
Fala galera, beleza?

No post de hoje vou mostrar como simular alguns recursos da aws em sua máquina local utilizando o [localstack](https://localstack.cloud/). O lema do projeto é "Desenvolva e teste seus aplicativos na nuvem offline" e já me salvou muito quando fiquei sem acesso a internet. 

Além de fornecer um ambiente offline, o localstack é muito bom para ambientes onde o desenvolvedor não tem acesso as configurações da AWS, por exemplo por questões de políticas de segurança da empresa.

Como exemplo de utilização deste post, vou mostrar na prática a leitura de uma fila [sqs](https://aws.amazon.com/sqs/) utilizando um projetinho java com o [aws sdk](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/welcome.html). Bora lá? =)
<!--more-->

# Subindo o localstack

A primeira ação que tomaremos será de subir o localstack na nossa máquina. Nesse post, vou utilizar a imagem docker disponibilizada pela galera do localstack. Para facilitar nossa vida, há um arquivo docker-compose disponível no [github do projeto](https://github.com/localstack/localstack/blob/master/docker-compose.yml).

Como usaremos somente o serviço de fila, delimitei no docker-compose abaixo que somente o SQS será habilitado e estara respondendo na porta 4576. 

```yaml
version: '2.1'

services:
  localstack:
    image: localstack/localstack
    ports:
      - "4576:4576"
      - "8080:8080"
    environment:
      - SERVICES=sqs
```

Para subir o container utilize o comando abaixo:

```sh
$ docker-compose up
```

Uma vez que o localstack esteja rodando na sua máquina, você poderá acessar a interface web através da url http://localhost:8080. 

# Criando uma fila com o aws-cli

Para testar se o sqs está funcionando, será necessário instalar o [aws-cli](https://aws.amazon.com/cli/) que é a interface de linha de comando da aws.

Os possíveis comandos para manipular uma fila podem ser visto [neste link](https://docs.aws.amazon.com/cli/latest/reference/sqs/index.html).

Exemplo de como criar uma fila utilizando o endpoint local:

```sh
$ aws --endpoint-url=http://localhost:4576 sqs create-queue --queue-name teste
{
    "QueueUrl": "http://localhost:4576/queue/teste"
}
```

Exemplo de envio de uma mensagem para a fila:
```sh
$ aws --endpoint-url=http://localhost:4576 sqs send-message --queue-url http://localhost:4576/queue/teste --message-body "Mensagem de teste"
{
    "MD5OfMessageBody": "4449beea32141ebd982d823daa49a542", 
    "MD5OfMessageAttributes": "d41d8cd98f00b204e9800998ecf8427e", 
    "MessageId": "e9dcd4ab-871b-4dd4-a7b7-8426a8bfb5e0"
}
```

Exemplo de leitura de mensagens da fila:
```sh
$ aws --endpoint-url=http://localhost:4576 sqs receive-message --queue-url http://localhost:4576/queue/teste --max-number-of-messages 10                                                              
{
    "Messages": [
        {
            "Body": "Mensagem de teste", 
            "ReceiptHandle": "e9dcd4ab-871b-4dd4-a7b7-8426a8bfb5e0#2c7aaba2-3385-459b-9dd2-d4e7fc0d6ac7", 
            "MD5OfBody": "4449beea32141ebd982d823daa49a542", 
            "MessageId": "e9dcd4ab-871b-4dd4-a7b7-8426a8bfb5e0"
        }
    ]
}

```

Agora já temos um ambiente com SQS montado em nossa máquina. A seguir, vamos fazer a leitura dessa fila em um projeto java.

# Criando nosso projeto para ler as mensagens

Para criar o projeto vou utilizar o mínimo de recurso possível, portanto vamos utilizar somente a lib oficial [aws sdk 2](https://docs.aws.amazon.com/sdk-for-java/v2/developer-guide/welcome.html).

A seguir, o exemplo do pom:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.gabrielfeitosa</groupId>
    <artifactId>localstack-sqs-consume</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>software.amazon.awssdk</groupId>
            <artifactId>sqs</artifactId>
            <version>2.4.8</version>
        </dependency>
    </dependencies>
</project>
```

E para finalizar, segue a classe com a implementação da leitura da fila **teste**:
```java
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;

import java.net.URI;

public class SqsConsume {


    public static void main(String[] args) {

        SqsClient client = SqsClient.builder()
                .region(Region.US_EAST_1)
                .endpointOverride(URI.create("http://localhost:4576"))
                .build();

        var queueUrl = "http://localhost:4576/queue/teste";

        ReceiveMessageRequest receiveMessageRequest = ReceiveMessageRequest.builder()
                .queueUrl(queueUrl)
                .waitTimeSeconds(5)
                .maxNumberOfMessages(5)
                .build();

        while (true) {
            client.receiveMessage(receiveMessageRequest)
                    .messages()
                    .forEach( message -> {
                        System.out.println(message.body());
                    });
        }
    }
}

```

Bem simples não? Não testei todos os recursos do localstack, mas acredito que ele pode ajudar bastante no dia a dia dependendo do contexto que você estiver. 

Para os amantes de testes, a galera do localstack disponibilizou a lib [localstack-utils](https://mvnrepository.com/artifact/cloud.localstack/localstack-utils) que dá para integrar com o JUnit. No [meu github](https://github.com/gabrielfeitosa/localstack-sqs-java), disponibilizei um exemplo mais completo.

Bom, por hoje é isso galera, espero que tenham gostado. Se curtiu, não deixe de compartilhar! 😉

Abraços e até a próxima.
