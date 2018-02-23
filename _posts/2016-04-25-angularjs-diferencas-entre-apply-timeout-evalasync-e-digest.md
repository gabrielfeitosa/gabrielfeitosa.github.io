---
title: 'AngularJS: Diferenças entre $apply, $timeout, $evalAsync e $digest'
date: 2016-04-25T11:16:03+00:00
layout: post
permalink: /angularjs-diferencas-entre-apply-timeout-evalasync-e-digest/
comments: true
categories:
  - AngularJs
tags:
  - angular
  - angularjs
  - frontend
  - javascript
  - performance
---
Fala galera, beleza?

Após alguns meses sem nenhuma novidade por aqui, estou tentando retornar a rotina de publicações&#8230; A ausência foi por um bom motivo: <span style="line-height: 1.71429; font-size: 1rem;">estive desenvolvendo, e ainda estou, um projeto social chamado </span><a style="line-height: 1.71429; font-size: 1rem;" href="http://doecaridade.com" target="_blank"><span style="color: #ff0000;">♥</span>Doe Caridade</a>.<span style="line-height: 1.71429; font-size: 1rem;"> Mas em breve eu volto a falar sobre ele, pois pretendo abrir o código fonte.</span>

O post de hoje é sobre as diferenças entre o **$apply**, **$timeout**, **$evalasync** e **$digest**. Para entendermos um pouco mais como o AngularJS funciona é importante conhecê-las e saber como e quando usá-las.
<!--more-->

## $apply()

Algumas vezes é necessário executar operações fora do escopo do AngularJS. No post sobre <a href="http://gabrielfeitosa.com/socketio-angularjs-comunicacao-realtime/" target="_blank">Socket.io e AngularJS: Comunicação em tempo real</a>, por exemplo, falei sobre a execução do $apply para poder atualizar o escopo do AngularJS todas as vezes que o _frontend_ recebia dados do _backend_ através do socket.io.

Para que essas operações realizadas fora do escopo tenham efeito é preciso fazer com que o escopo do AngularJS seja atualizado. Então, uma das funções que executa esse papel é a $apply.

Ela é a responsável por executar **todos **os observadores do escopo da aplicação. Isso quer dizer que cada vez que a função for chamada, **todo **o ciclo de vida da aplicação será atualizado.

Muito cuidado, no entanto, com o excesso de utilização do $apply, pois ele é um processo pesado e pode levar a problemas de desempenho da aplicação.

Outro ponto a ser mencionado é que o AngularJS possui um **único** ciclo. Isso quer dizer que essa função não pode ser invocada enquanto houver um ciclo em progresso. Caso isso ocorra, o seguinte erro será lançado _**$digest already in progress** (para saber mais acesse esse **<a href="https://docs.angularjs.org/error/$rootScope/inprog" target="_blank">link</a>**).** **_

## $timeout()

O $timeout é uma maneira mais fácil de resolver operações que são executadas fora do escopo do AngularJS. No post sobre <a href="http://gabrielfeitosa.com/angularjs-refresh-periodico/" target="_blank">AngularJS: Aplicação em tempo real – Refresh periódico</a> falei um pouco sobre ele, vale a pena conferir.

Uma grande vantagem dessa função é que não receberemos a exceção de que o ciclo do AngularJS está em progresso. Por baixo dos panos, o $timeout informa ao _framework_ que ao terminar o ciclo atual há um _timeout_ esperando para ser executado. Assim, não haverá conflito entre o ciclo atual e a execução do _timeout_.

## $evalAsync()

Essa função é uma espécie de irmão mais esperto do $timeout. A diferença básica entre elas é que o $evalAsync pode ser avaliado na execução do escopo atual ou no próximo ciclo do AngularJS. <a href="http://www.bennadel.com/blog/2605-scope-evalasync-vs-timeout-in-angularjs.htm" target="_blank">Aqui</a> tem um post bacana do Ben Nadel falando sobre $evalAsync e $timeout.

## $digest()

É através da $digest() que o AngularJS percebe as mudanças entre o _model_ e a view. Em cada ciclo $digest os observadores são executados.

Ao contrário da função $apply, que executa $digest a partir do $rootScope para os seus filhos, a função $digest() inicia o ciclo $digest dentro do escopo em que ele foi executado até seus filhos. Essa grande diferença pode reduzir a quantidade de observadores implementados pela aplicação.

Porém, apesar do ganho de performance com o uso dessa função, o desenvolvedor deve ficar atento se o escopo pai utiliza as novas informações, pois ele não é atualizado e as expressões podem ficar defasadas.

Entender como é o funcionamento do ciclo do AngularJS é importante para saber tratar problemas de performance. Neste post mostrei opções que se aplicadas corretamente podem melhorar o desempenho da sua aplicação.

Por hoje é só galera.

Abraços e até a próxima!

&nbsp;