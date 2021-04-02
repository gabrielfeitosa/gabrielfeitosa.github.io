---
title: Criando a imagem docker com o maven
date: 2017-04-11T08:30:26+00:00
layout: post
permalink: /criando-a-imagem-docker-com-o-maven/
image:
  feature: docker-maven-1.png
categories:
  - Docker
  - Java
  - Tools
tags:
  - docker
  - java
  - maven
  - tools
---
No post anterior, <a href="https://gabrielfeitosa.com/como-rodar-uma-aplicacao-java-com-o-docker/" target="_blank">Como rodar uma aplicação Java com o Docker</a>, falei um pouco sobre o uso de containers para subir uma aplicação desenvolvida com o framework <a href="https://projects.spring.io/spring-boot/" target="_blank">Spring Boot</a>. Agora que sabemos como criar uma imagem por meio da linha de comando, veremos como fazer isso pelo processo de build do <a href="https://maven.apache.org/" target="_blank">Maven</a>. Para isso, vamos usar o plugin <a href="https://github.com/spotify/docker-maven-plugin" target="_blank">docker-maven-plugin</a> desenvolvido pela galera do Spotify.
<!--more-->

## Alteração no pom

A única alteração no nosso sistema será no pom.xml:
{% highlight xml linenos%}
<plugin>
  <groupId>com.spotify</groupId>
  <artifactId>docker-maven-plugin</artifactId>
  <version>0.4.13</version>
  <configuration>
    <imageName>mytask</imageName>
    <baseImage>frolvlad/alpine-oraclejdk8:slim</baseImage>
    <entryPoint>["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -jar /${project.build.finalName}.jar --spring.profiles.active=${spring.profile}"]
    </entryPoint>
    <resources>
        <resource>
            <targetPath>/</targetPath>
            <directory>${project.build.directory}</directory>
            <include>${project.build.finalName}.jar</include>
        </resource>
    </resources>
    <imageTags>
        <imageTag>${project.version}</imageTag>
        <imageTag>latest</imageTag>
    </imageTags>
  </configuration>
</plugin>
{% endhighlight%}

As configurações necessárias para o uso do plugin são:

  1. **imageName** &#8211; O nome da imagem após o build;
  2. **baseImage** &#8211; O nome da imagem base;
  3. **entryPoint** &#8211; Comando que será executado ao inicializar o container;
  4. **resources** &#8211; Usado para copiar artefatos para dentro do container;
  5. **imageTags** &#8211; As tags da imagem gerada.

## Execução do build com o Maven

Com essa pequena modificação, estamos aptos a criar a imagem direto do build com o Maven. Vamos executar o seguinte comando:

```bash
$ mvn clean package docker:build --batch-mode release:update-versions
```

Com esse comando, estamos solicitando ao plugin a execução do processo de build da imagem com os parâmetros que definimos.

> Adicionei ao comando o <strong>-batch-mode release:update-versions </strong>para que o Maven incremente a versão do pom sem interação com o usuário. Fiz isso para que você possa ver as imagens geradas com a mesma versão do pom (linha 18). Então, todas as vezes que o comando for executado, podemos verificar que uma nova imagem está sendo criada com a mesma versão do projeto.

Uma das facilidades que o plugin nos oferece é a abstração em relação aos comandos necessários para criar a imagem. Há muito mais informações do plugin no <a href="https://github.com/spotify/docker-maven-plugin#use-a-dockerfile" target="_blank">github</a> do projeto, vale a pena dar uma espiada. O código fonte do exemplo está no <a href="https://github.com/gabrielfeitosa/ci-spring-boot" target="_blank">meu github</a>.

Agora que você tem mais uma opção para criar a imagem do Docker, seja por intermédio da linha de comando ou pelo Maven, qual você escolheria e por que?

Por hoje é só galera, abraços e até a próxima!