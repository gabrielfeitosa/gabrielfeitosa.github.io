---
title: 'AngularJS: Aplicação em tempo real &#8211; Refresh periódico'
date: 2015-11-11T20:43:47+00:00
layout: post
permalink: /angularjs-refresh-periodico/
comments: true
categories:
  - AngularJs
  - Java
tags:
  - angularjs
  - java
  - jax-rs
  - realtime
  - rest
  - timeout
---
Fala galera, beleza?

Depois de um mês atípico (muito trabalho e organizando casamento) e um começo de mês com ombro deslocado, estou de volta para delírio de vocês heheheh (menos né?!).

Hoje vou falar sobre aplicações em tempo real utilizando o padrão ajax de **atualização periódica** (periodic refresh) e como o AngularJS pode nos ajudar a implementá-lo. Deixa eu te fazer uma pergunta, você gostaria de ficar apertando **F5** para verificar se há uma nova notificação no Facebook? Ou se chegou aquele e-mail que você tanto esperava no Gmail? Eu acho que não, né?

A fim de tornar a experiência do usuário a mais agradável possível, muitas aplicações utilizam dados em tempo real (ou quase) e até criam uma certa dependência dessa tecnologia, pois sem ela jamais teriam se popularizado.
  
<!--more-->

Vamos ver esse refresh em funcionamento? Você tem Twitter? Se sim, acesse ele e depois abra o console do browser (aperte **F12, **abestado!). Na aba **network**, você pode verificar que periodicamente o twitter faz um GET, para checar se há alguma novidade a ser exibida ao usuário. Conforme mostra a figura abaixo:

![Twiter Console](/img/twitter_console1.png)

Para exemplificar, vamos criar uma simples sala de bate-papo. Para o backend, utilizei a plataforma Java e para o frontend, a implementação foi feita com AngularJS usando o service **<a href="https://docs.angularjs.org/api/ng/service/$timeout" target="_blank">$timeout</a>****.**

## $timeout

A galera do AngularJS resolveu encapsular o <span class="symple-highlight symple-highlight-gray "><a href="http://www.w3schools.com/jsref/met_win_settimeout.asp" target="_blank">window.setTimeout</a></span> dentro desse _service_. Quando o $timeout é chamado, ele retorna uma _promise_ que será resolvida quando o delay for concluído e a função de _timeout_, caso exista, for executada.

Esse _service_ tem a seguinte estrutura:

`$timeout([fn], [delay], [invokeApply], [Pass]);`

  * **fn:** A função a ser executada quando o delay acabar;
  * **delay: **O tempo limite em milissegundos. Valor default é zero.
  * **invokeApply: **Se o parâmetro for marcado como **false **o modelo de _durty checking _será ignorado, caso contrário, a função de tempo limite (fn) será chamada dentro do bloco <a href="https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply" target="_blank">$apply</a>.
  * **Pass: **Aqui você pode passar parâmetros para a função a ser executada (fn).

O $timeout ainda nos fornece uma maneira de cancelar as tarefas que estão agendadas. Para isso, há o método **$timeout.cancel([promise])**. Ele** **recebe como parâmetro uma _promise _e, como resultado da execução, essa _promise_ será resolvida com uma rejeição (_rejection_).

## Backend com Java

Para o backend, usei os frameworks **<a href="http://resteasy.jboss.org/" target="_blank">RestEasy</a>** para expor a API e o provider <a href="https://docs.jboss.org/resteasy/docs/3.0.13.Final/userguide/html_single/#json" target="_blank"><strong>Jackson</strong></a> para consumir e produzir os objetos em JSON. Além disso, o projeto está com maven, utiliza Java 8 e está sendo executado no Tomcat. Ahhh! Ia esquecendo, está hospedado no <a href="http://heroku.com" target="_blank">heroku</a>.

A aplicação implementada é bem simples, mas como não é o foco desse post, fiz só o necessário para o frontend funcionar. <span style="line-height: 1.71429; font-size: 1rem;">Os fontes do projeto estão no </span><a style="line-height: 1.71429; font-size: 1rem;" href="https://github.com/gabrielfeitosa/blog_exemplos/tree/master/java/chat" target="_blank">github</a><span style="line-height: 1.71429; font-size: 1rem;">.</span>

A API exposta para uso consiste em:

  * **GET /mensagens:** listar as mensagens do chat;
  * **POST /mensagens**: enviar uma nova mensagem para a sala de bate papo;
  * **DELETE /mensagens**: apagar todas as mensagens da sala;

## Frontend com AngularJS

Agora vamos falar da parte que mais nos interessa. Mas antes, como não sou lá essas coisas na parte de design, peguei a base do template para o chat nesse link <a href="http://bootsnipp.com/snippets/featured/chat" target="_blank">aqui</a> óh.

O gist abaixo apresenta a implementação da lógica necessária para realizar a atualização dos dados do nosso chat. O projeto completo pode ser visto no <a href="https://github.com/gabrielfeitosa/blog_exemplos/tree/master/angularjs/periodic_refresh" target="_blank">github</a> e rodando <a href="https://gabrielfeitosa.github.io/exemplos/angularjs/periodic_refresh/" target="_blank">aqui</a>.

{% highlight javascript linenos%}
(function() {
   angular.module("app")
    .factory("ChatFactory", function($http, $timeout) {
      var promise;
      var URL = "http://gf-chat.herokuapp.com/rest/mensagens/";
      var mensagens = [];
      var aberto = false;
      var contador = 5;

      return {
        entrar: entrar,
        listar: listar,
        cadastrar: cadastrar,
        isAberto: isAberto,
        sair: sair,
        getContador: getContador
      };

      function entrar() {
        aberto = true;
        ativarRefresh()
      }

      function ativarRefresh() {
        contador--;
        if (contador === 0) {
          atualizar();
          contador = 5;
        }
        promise = $timeout(ativarRefresh, 1000);
      }

      function sair() {
        $timeout.cancel(promise);
        aberto = false;
      }

      function atualizar() {
        $http.get(URL)
          .success(function(data) {
            mensagens = data;
          });
      }

      function cadastrar(usuario, texto) {
        var msg = {
          usuario: usuario,
          texto: texto
        }
        $http.post(URL, msg);
      }

      function getContador() {
        return contador;
      }

      function isAberto() {
        return aberto;
      }

      function listar() {
        return mensagens;
      }
    });

})();
{% endhighlight %}

Analisando o gist acima, o acesso ao chat é feito pelo método **entrar** (linha 19). Ele é o responsável por ativar o refresh periódico através do método **ativarRefresh** (linha 24). Perceba que dentro desse método implementei um contador. Esse contador é decrementado a cada um segundo (1000 milissegundos) e quando o seu valor for zero o método **atualizar** (linha 27) será chamado. O contador está sendo utilizado na tela para informar ao usuário quanto tempo falta para a sala ser atualizada.

<span style="line-height: 24.0001px; font-size: 1rem;">Os outros métodos </span><span style="line-height: 24.0001px; font-size: 1rem;">apresentados no gist são</span><span style="line-height: 24.0001px; font-size: 1rem;">:</span>

<ul style="list-style-type: circle;">
  <li>
    <span style="line-height: 24.0001px;"><strong>cadastrar </strong>(linha 45):  responsável por enviar ao servidor uma nova mensagem;</span>
  </li>
  <li>
    <strong>sair</strong> (linha 33): é aqui que o método $timeout.cancel é chamado para finalizar a atualização periódica;
  </li>
  <li>
    <strong>getContador</strong> (linha 53): retornar o contador a fim de informar quanto tempo falta para a próxima atualização do chat;
  </li>
  <li>
    <strong>isAberto</strong> (linha 57): informar se o chat está aberto ou não.
  </li>
  <li>
    <strong>listar</strong> (linha 61): listar as mensagens da sala de bate-papo.
  </li>
</ul>

Então é isso pessoal, essa é uma das formas de termos uma aplicação em tempo real. Fico esperando suas dúvidas e sugestões.

> Só mais duas coisinhas:
 1. Para fazer a barra de rolagem automática do chat usei essa diretiva <a href="https://github.com/Luegg/angularjs-scroll-glue" target="_blank">aqui</a>;
   2. Esse artigo foi baseado em um post do <a href="http://examples.javacodegeeks.com/core-java/real-time-applications-angularjs-java-part-1" target="_blank">Java Code Geeks</a>.
{: .notice}
Abraços e até a próxima!