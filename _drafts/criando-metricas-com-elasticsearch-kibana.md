---
title: Criando relatórios dinâmicos com ElasticSearch e Kibana
layout: post
permalink: 
comments: true
categories:
  - Tools
  - Golang
  - DevOps
tags:
  - golang
  - elasticsearch
  - kibana
  - docker
  - devops
  
---
Fala galera, beleza?

Recentemente estava fazendo uma consultoria, o tal do freela, e me deparei com uma situação boa. O desafio da empresa estava na necessitando de analisar os eventos trafegados para os exchanges no [rabbitmq](https://www.rabbitmq.com/) e gerar insumos para tomada de decisões.  

Os eventos tinha diversas origens, em torno de 7 sistemas, que enviavam dados para o rabbitmq. Apesar de ter vários sistemas envolvidos, boa parte deles seguiam um padrão que dava para extrair informações e gerar relatórios dinâmicos. Os dados a serem extraidos eram bem simples, basicamente consistia em fazer contagem de eventos por tipo, verificar quem gera mais dados em determinado período de tempo, entre outros temas que não convém explorar aqui.

O time de devs já tinha posto algumas ideias na mesa, entre elas a construção de um sistema para criar relatórios ou enviar os dados para um banco de dados e extrair as informaçoes com [ETL](https://pt.wikipedia.org/wiki/Extract,_transform,_load). Havia uma terceira opçao, porém já descartada, que seria alterar os sistemas origens e os dados serem retirados direto da fonte.

Como eu já fazia "parte" da galera, resolvi opinar e verificar se uma quarta ideia menos intrusiva seria viável para o cenário deles. Então, sem mais delongas, o post de hoje vai ser como o ElasticSearch junto do Kibana ajudaram a das métricas para tomada de decisões com um custo bem baixo e em um tempo excessivamente pequeno. 
<!--more-->

Antes de mais nada, no post não vou abordar a leitura de dados do RabbitMQ. Para isso, temos vários post de referência internet afora. 

### Configurando o ElasticSearch

Nossa primeira tarefa será configurar o ES. 
A primeira ação necessária para o nosso teste é instalar o plugin [SonarQube Scanner for Jenkins](https://plugins.jenkins.io/sonar). Para isso, clique em **Manage Jenkins** > **Manage Plugins**. Uma vez o plugin instalado, vamos configurar o endereço do Sonar no menu **Manage Jenkins** > **Configure System.**

![Exemplo da configuração do SonarQube no Jenkins](/img/jenkins_sonar.png) 

Até aqui bem simples, não?

Agora vamos criar um novo job do tipo **pipeline** e vamos adicionar o seguinte script groovy.

{% highlight groovy linenos%}
node {
  stage('Repositório') { 
    git 'https://github.com/gabrielfeitosa/avaliacao-candidato.git'
  }
  stage('Build') {
    withSonarQubeEnv('sonar') {
      def mvnHome = tool 'maven-3.5.0'
      sh "'${mvnHome}/bin/mvn' -f backend/pom.xml clean package sonar:sonar"
    }
  }
}

stage("Quality Gate") { 
  timeout(time: 5, unit: 'MINUTES') { 
    def qualityGate = waitForQualityGate() 
      if (qualityGate.status != 'OK') {
        error "O código não está de acordo com as regras do Sonar: ${qualityGate.status}"
      }
  }
}
{% endhighlight%}

Esse script possui três estágios: **Repositório, Build e Quality Gate.** No primeiro estágio, será realizado o clone do código a ser analisado, no meu teste estou analisando um projeto que está no meu github. Já o estágio de Build, está iniciando o processo de construção do código com o maven. Perceba que estou usando a função **withSonarQubeEnv,** ela pertence ao plugin que instalamos e é a responsável por armazenar os dados de análise do sonar. Esses dados serão usados na função **waiForQualityGate,** que por sua vez fica aguardando os dados da análise do sonar. Para finalizar, o estágio do Quality Gate, responsável por aguardar a análise do Sonar e informar se ela foi satisfatória ou não.

A configuração no Jenkins está pronta. Agora, precisamos de uma pequena configuração no Sonar.

## Configurando o SonarQube

A configuração do Sonar é bem simples, vamos precisar cadastrar um webhook para ser disparado quando a análise do projeto for concluída. Para isso, acesse o menu de **Administration > webhook**. Uma vez na tela, vamos informar para o Sonar que o endereço que ele deverá chamar é o **\<sua instância do jenkins>/sonarqube-webhook/.**

![Configuração do webhook no sonar](/img/sonar_webhook.png)

Com essa pequena configuração, estamos aptos a quebrar o build no Jenkins caso as exigências do Sonar não sejam atendidas.

## Testando

Para realizar o teste, execute o job com as mesmas configurações que estão neste post. O build será realizado com sucesso, pois todas as exigências do Sonar foram atendidas. Para continuar o teste, adicione ao Quality Gate uma exigência de cobertura de código de 95%, pois o projeto está com 93,5%. Assim, o build irá quebrar.

![Exemplo de build de pipeline no Jenkins](/img/Jenkins_build.png)

Com a integração do Jenkins e o SonarQube nós podemos melhorar a maneira com que nos preocupamos com a qualidade do código que escrevemos, entendido?

Bom, por hoje é isso galera, espero que tenham gostado. Se curtiu, não deixe de compartilhar! 😉

Abraços e até a próxima.

Arquivo docker-compose.yml

{% highlight docker%}
version: "3"
services:

  sonar:
    image: sonarqube:6.5
    ports:
      - 9000:9000
      - 9092:9092
  jenkins:
    image: jenkins/jenkins:lts
    ports:
      - 8080:8080
      - 50000:50000
{% endhighlight %}