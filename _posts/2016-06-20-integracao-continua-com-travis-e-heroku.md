---
title: Integração contínua com Travis e Heroku
date: 2016-06-20T12:38:41+00:00
layout: post
permalink: /integracao-continua-com-travis-e-heroku/
comments: true
categories:
  - AngularJs
  - Java
  - Tools
tags:
  - angularjs
  - ci
  - heroku
  - integracao-continua
  - java
  - spring-boot
  - travis
---
Fala galera, beleza?

Você ainda roda, de forma manual, bons e velhos _scripts_ para por sua aplicação em produção? É chato ter que alterar os arquivos de configuração toda vez que precisa modificar o ambiente? Que tal descomplicar e deixar tudo isso automatizado de verdade? Tá parecendo venda de produto pirata né? Hehehe&#8230; Mas é só um post sobre **integração contínua**!

Vamos falar um pouco sobre como fazer integração contínua por meio do <a href="https://travis-ci.org/" target="_blank"><strong>Travis-CI</strong></a> e realizando o _deploy_ no **<a href="https://www.heroku.com/" target="_blank">Heroku</a>.** Como exemplo, vamos utilizar um sisteminha de **Tarefas** feito com **<a href="http://projects.spring.io/spring-boot/" target="_blank">Spring Boot</a>** e a camada de visão com **AngularJS**. Em um futuro não muito distante, falarei um pouco sobre as maravilhas do Spring Boot, mas, hoje, vamos focar nessa danada de integração contínua.
<!--more-->
## Integração Contínua

O que é? O que come? Para que serve? Veja no novo post do Gabriel Feitosa =)

Muita gente ainda se pergunta no que a integração contínua pode auxiliar no processo de entrega, mesmo se ainda trabalhar com a velha forma **cascata** ** **(sim, infelizmente ainda hoje tem muita gente entregando _software_ assim).

Geralmente, associamos a integração contínua somente as metodologias ágeis. Afinal, foi por causa da necessidade de disponibilizar os _softwares_ de maneira rápida, contínua e com qualidade, que se tornou indispensável integrar o que é produzido ao que é entregue.

Uma pergunta para responder em nossas cabeças: quando fazemos um bom trabalho, gostamos de ter um _feedback_/elogio do nosso chefe, ou não? Pois é, o nosso _software_ também é sentimental. A integração contínua é a maneira mais prática de dar um **_feedback_ instantâneo** para nosso sistema e, sem ser egoístas, para nós mesmos.

Funciona assim, faço meu código, depois dou o _commit_ no repositório, o processo de _build_ é iniciado, os testes são executados e, se houver falhas, elas serão expostas. Simples, rápido e sem dor. Opa, vão ficar sabendo que comitei sem rodar os testes, isso não é legal!!! Mas é CLARO que é legal meu amigo, já imaginou se você envia esse seu código para homologação e na hora do usuário testar ele não funciona ou se vai direto para produção? Seria muito pior, não?

Para nosso exemplo, vamos usar um repositório no Github. O Travis-CI irá escutar este repositório e sempre que houver mudança executará o processo de _build_ e fará o _deploy_ no Heroku.

## Travis-CI

Como mencionei acima, o Travis será nossa aplicação de integração contínua. Ele é gratuito para projetos públicos, caso você queira usá-lo para projetos privados, porém, é necessário pagar. Tem uma documentação muito rica que pode ser vista <a href="https://docs.travis-ci.com/" target="_blank">aqui</a>.

Uma vez logado, vamos informar ao Travis qual o repositório do Github ele escutará. Para isto, dentro do _dashboard_ vamos adicionar um novo repositório, conforme imagem abaixo:<figure id="attachment_564" style="max-width: 1024px" class="wp-caption alignnone">

![Adicionar novo repositório ao travis](/img/travis-novo-repositorio.png)

Em seguida, você será redirecionado para a tela do seu _profile_, onde você poderá escolher qual repositório irá escutar. Neste exemplo, a integração será realizada no repositório [gabrielfeitosa/ci-spring-boot](https://github.com/gabrielfeitosa/ci-spring-boot).

Para que o Travis saiba o que fazer com os fontes do repositório, vamos precisar criar um arquivo na raiz do nosso projeto chamado **.travis.yml.** Este arquivo conterá os passos que deverão ser seguidos para realização da integração contínua.

{% highlight yml linenos%}
language: java
jdk:
 - oraclejdk8
deploy:
 provider: heroku
 api-key: 
  secure: $HEROKU_API_KEY
 app: ci-spring-boot
{% endhighlight %}

No _gist_ acima, informamos que a linguagem que o projeto usa é **Java 8**. O Travis já disponibiliza um _provider_, de forma nativa, para realizarmos o _deploy_ no Heroku. Para liberar o acesso ao Heroku, precisamos informar a nossa chave de acesso _**api-key>secure**_ e qual o nome da **app**.

Perceba que estou utilizando uma variável de ambiente para informar qual a minha chave de acesso ao Heroku. Vamos criar uma variável de ambiente, para isso basta ir nos _settings_ e adicioná-la, conforme figura abaixo:

![Configuração do repositório no Travis](/img/travis-settings-repo.png)

As configurações do Travis estão feitas, viu como foram simples? Todo _commit_ que for feito iniciará o processo de integração contínua. No _dashboard_ você poderá acompanhar o log do build da sua aplicação.

Agora, vamos ver como é fácil configurar o Heroku para que o _deploy_ possa ser realizado.

## Heroku

Para quem não conhece, o Heroku é um <a href="https://pt.wikipedia.org/wiki/Plataforma_como_servi%C3%A7o" target="_blank">PaaS</a> que pode ser utilizado para expor seu sistema na _web_. Ele pode ser usado de forma gratuita ou pode-se optar pelos planos pagos.

Para iniciar, vamos logar/criar uma conta. Depois, dentro do _dashboard_  vamos criar uma nova _app._ Para criar o processo é bem simples, basta informar o nome da aplicação e selecionar a região em que ela será executada:<figure id="attachment_569" style="max-width: 1024px" class="wp-caption aligncenter">

![Criar nova app no heroku](/img/heroku-new-app.png)

O nosso ambiente de desenvolvimento utiliza o banco de dados em memória **h2**. Porém, o Heroku não dá suporte e ele não é recomendado para ser utilizado em produção. Lembre-se, o Heroku será o nosso servidor de produção. Então, vamos adicionar o banco de dados **Postgresql** a nossa aplicação.

Na tela de informações da nossa aplicação, vamos adicionar o Postgresql. Basta informar o nome do add-on e selecioná-lo, conforme tela abaixo:<figure id="attachment_572" style="max-width: 1024px" class="wp-caption aligncenter">

![Adicionando postgresql a aplicação no Heroku](/img/heroku-postgres.png)

Pronto! A configuração está concluída, foi simples não? Agora, só mais algumas observações:

  * Ao adicionar o Postgresql, a variável de ambiente **DATABASE_URL é** automaticamente criada. Ela será utilizada nas configurações de acesso ao banco de dados da nossa aplicação.
  * É necessário criar o arquivo **Procfile **na raiz do projeto, ele conterá as informações que serão utilizadas pelo Heroku para fazer o _deploy._
  * Na figura acima, perceba que há uma linha com o comando **web: java -Dserver.port=$PORT -jar target/ci-spring-boot-0.0.1-SNAPSHOT.jar -Dspring.profiles.active=prod**. Esse comando é o que está dentro do Procfile.
  * Perceba que estou utilizando o parâmetro **-Dspring.profiles.active=prod.** Ele será usado pelo Spring para utilizar o _profile_ **prod.** Esse _profile_ pode ser visto no arquivo** <a href="https://github.com/gabrielfeitosa/ci-spring-boot/blob/master/src/main/resources/application-prod.properties" target="_blank">src/main/resources/application-prod.properties</a>**.

> **[Spring Boot]**
O Spring Boot é um baita projeto da galera do Spring, que vem para auxiliar e facilitar o processo de configuração da aplicação, estabelecendo configurações <em>defaults</em>. Não quis entrar em detalhes, pois em breve farei um post exclusivo sobre o tema.
Abaixo, os<em> profiles</em> que utilizei no projeto. Dentro de <a href="https://github.com/gabrielfeitosa/ci-spring-boot/tree/master/src/main/resources" target="_blank">src/main/resources</a> há 3 arquivos de configuração do Spring Boot:
1. [application.propertie](https://github.com/gabrielfeitosa/ci-spring-boot/blob/master/src/main/resources/application.properties): usei unicamente para definir qual o <em>profile</em> padrão (<strong>dev</strong>);
2. [application-dev.properties](https://github.com/gabrielfeitosa/ci-spring-boot/blob/master/src/main/resources/application-dev.properties): possui as configurações do<em> profile</em> <strong>dev;</strong>
3. [application-prod.properties](https://github.com/gabrielfeitosa/ci-spring-boot/blob/master/src/main/resources/application-prod.properties): possui as configurações do <em>profile</em> <strong>prod;</strong>
Então, sempre que quisermos executar o sistema com um <em>profile</em> diferente do padrão, temos que passar o parâmetro <strong>spring.profiles.active </strong>para que o S<em>pring</em> sobrescreva o valor <em>default </em>a ser utilizado.
Há ainda um 4º arquivo de propriedades que é o utilizado nos testes: <a id="065ee6c616db877d7e0b2ed0bd457d81-2f1830c33179f3302a26b7c352e14e954e88365d" class="js-navigation-open" title="application.properties" href="https://github.com/gabrielfeitosa/ci-spring-boot/blob/master/src/test/resources/application.properties" target="_blank">src/test/resources/application.properties</a>.
{: .notice}

Uma vez que todos esses passos forem feitos, nosso sistema terá o _deploy_ realizado a cada _commit_. Se tudo ocorrer bem, o nosso sistema poderá ser acessado na url [https://ci-spring-boot.herokuapp.com](https://ci-spring-boot.herokuapp.com/). Perceba que o Heroku disponibiliza a url com o mesmo nome da app criada, nesse caso **ci-spring-boot .**

Só para recapitular, sempre que fizermos um _commit, _o Travis irá compilar nosso código e rodar os testes. No exemplo, criei um teste de integração só para exemplificar. Em seguida, se tudo ocorrer conforme esperado com os testes, a aplicação será enviada ao Heroku para ser exposta na _web_.

Agora diz aí, foi fácil ou não foi?

Há uma porção de ferramentas de integração contínua no mercado, como o <a href="https://jenkins.io/" target="_blank">jenkins</a> e o <a href="http://wercker.com/" target="_blank">wercker</a>. Também há outros PaaS bem populares na comunidade, por exemplo o <a href="https://www.openshift.com" target="_blank">OpenShift</a>, <a href="https://cloud.google.com/appengine/" target="_blank">Google App Engine</a> e o <a href="https://aws.amazon.com/pt/" target="_blank">AWS</a>.

O código fonte do exemplo pode ser visto no repositório <a href="https://github.com/gabrielfeitosa/ci-spring-boot" target="_blank">gabrielfeitosa/ci-spring-boot</a>.

Por hoje é só galera.

Abraços e até a próxima!