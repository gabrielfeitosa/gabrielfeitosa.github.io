---
title: Como rodar uma aplicação java com o docker
date: 2017-04-04T20:01:00+00:00
layout: post
permalink: /como-rodar-uma-aplicacao-java-com-o-docker/
comments: true
categories:
  - Docker
  - Java
  - Tools
tags:
  - backend
  - container
  - devops
  - docker
  - java
  - spring
  - spring-boot
image:
  feature: javadocker.png
---
Fala galera, beleza?

Depois de um longo tempo  me dedicando a outros projetos, estou me reorganizando com o intuito de voltar a escrever para o blog.

Começarei contando uma historinha&#8230; Sabe aquela velha frase &#8220;Na minha máquina esta aplicação roda&#8221;? Pois é, quem nunca passou por isso? Cansei das vezes em que precisei analisar o porquê de um sistema não subir em outro ambiente e, no final, o problema era uma simples configuração.

No post de hoje, vamos aprender a rodar uma aplicação Java em um _container_ <a href="https://www.docker.com/" target="_blank">Docker</a>. Para isso, vou utilizar a _app_ desenvolvida no post sobre **<a href="http://gabrielfeitosa.com/integracao-continua-com-travis-e-heroku/" target="_blank">Integração contínua com Travis e Heroku</a>**.

Se você ainda não sabe o que é o Docker, dá uma espiada no post <a href="https://aws.amazon.com/pt/docker/" target="_blank">O que é o docker?</a>.
<!--more-->
## Docker

Se você realmente leu o post _O que é o docker?_, já entendeu que trata-se de uma tecnologia de código aberto, que permite manipular aplicações dentro de _containers_. Isso possibilita empacotar o nosso software dentro de uma unidade, contendo todo o necessário para a sua execução. Desse modo, conseguimos rodar esse container em qualquer lugar em que  o _docker_ esteja instalado.

Portanto, chega de dar desculpas. Com o Docker, podemos implantar aplicações rapidamente, de modo confiável e estável, em qualquer ambiente.

Uma maravilha, não?

### O arquivo Dockerfile

A grosso modo, este é o arquivo pelo qual podemos definir como será o nosso container. Vamos analisar o Dockerfile abaixo:

{% highlight docker linenos%}
FROM openjdk:8u121-jre-alpine
ADD target/mytask.jar mytask.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -jar /mytask.jar"]
{% endhighlight %}

Linha 1 - **FROM** informa qual imagem base será utilizada para gerar a nossa imagem**;** 
  
Linha 2 - **ADD** adiciona um arquivo local para dentro da nova imagem;
  
Linha 3 - **EXPOSE** expõe as portas do container. No nosso caso, a 8080 é a porta da aplicação;
  
Linha 4 - **ENTRYPOINT** informa qual comando será executado quando o container for iniciado.

Vamos utilizar uma imagem que já possui o Java instalado na versão 8 (**openjdk:8u121-jre-alpine**). O conteúdo depois do &#8220;**:&#8221;** (dois pontos) é onde definimos a tag da imagem. Há várias versões da imagem openjdk no <a href="https://hub.docker.com/_/openjdk/" target="_blank">Docker Hub</a>.

Percebam também que precisaremos adicionar o **jar** da aplicação dentro da imagem (linha 2). Antes, porém, precisamos executar o comando do _**maven**_ para gerar o nosso **jar**:

```bash
$ mvn clean package
```

Feito isso, estamos prontos para executar o comando de build do Docker e criar a nossa primeira imagem:

```bash
$ docker build -t mytask .
```

Com esse comando, estamos criando uma nova imagem e atribuindo um nome a ela, chamaremos de **mytask**. Esse comando deverá ser executado na raiz do projeto, pois é onde o arquivo Dockerfile se encontra. Caso a imagem definida no **FROM** do Dockerfile não exista, seu download será realizado para a máquina hospedeira.

Para verificar se a imagem foi construída com sucesso, execute o comando **docker images **no seu terminal e verifique se ela foi criada.

## Subindo o container

Agora que temos uma imagem com o nosso software, vamos iniciar o container **mytask-container** executando o comando a seguir:

```bash
$ docker run -it -p 8080:8080 --name mytask-container mytask
```

O comando **run** irá subir um container com o nome (-name) **mytask-container,** baseado na imagem **mytask**.  Esse container será executado na porta 8080, definido pelo mapeamento feito com o parâmetro **-p. **

Já o parâmetro **-it,** irá alocar um terminal** **para o container e tornará o processo interativo. Para mais detalhes sobre os parâmetros consulte a <a href="https://docs.docker.com/engine/reference/run/" target="_blank">documentação oficial</a>.

Agora você poderá acessar o endereço **http://localhost:8080**, no browser, e verificar a aplicação rodando. Simples, não?

Nos próximos posts, veremos como melhorar as configurações do container para subir a aplicação de outras formas. Percebam que, da forma utilizada, precisaremos gerar uma imagem para cada profile da aplicação, o que não é legal.

O post de hoje foi só um aperitivo de como usar o Docker para subir nossas aplicações. Espero que tenham curtido!  😎

E você, já usa o Docker no seu dia a dia? Compartilhe a sua experiência nos comentários&#8230;

Abraços e até a próxima!