---
title: 'localtunnel: Disponibilizando acesso a uma aplicação local'
date: 2016-05-10T09:00:05+00:00
layout: post
guid: http://gabrielfeitosa.com/?p=502
permalink: /localtunnel-disponibilizando-acesso-uma-aplicacao-local/
comments: true
categories:
  - Tools
tags:
  - localtunnel
  - tools
  - tunnel
---
E aí galera, beleza?

Se você, assim como eu (sem gracinhas, viu?), já passou por perrengues para disponibilizar uma aplicação local na _web_, este post pode ser muito útil.

Antigamente, para acessar uma aplicação rodando na minha própria máquina, a primeira configuração que fazia era cutucar o roteador ou o modem da velox (vixxxxx!!!) e tentar liberar as portas para a máquina.

Naquele tempo, eu não sabia nem o que era configuração de portas, a sorte eram os buscadores do Yahoo, Altavista, Cadê? e depois o Google (tem gente que não vai nem saber o que é Altavista e Cadê?).

Também Já quebrei muito a cabeça com o <a href="http://www.noip.com/" target="_blank">no-ip</a> para tentar acessar meus &#8220;códigos&#8221; da faculdade (não dá para chamar de aplicação, porque o desenvolvimento era orientado à gambiarra).

Pois bem, os seus e os meus problemas acabaram! Há alguns anos tenho utilizado com bastante facilidade módulos que me auxiliam nessa questão e hoje quero compartilhar com vocês o **<a href="https://localtunnel.me/" target="_blank">localtunnel</a>.**

O localtunnel é uma app bem simples de ser utilizada. Não é necessário configurar &#8220;nada&#8221; no seu _firewall_ e nem no DNS. Acreditem, não é mágica! =)
<!--more-->

## Instalação

Para instalar o localtunnel é necessário ter, antes, o <a href="http://nodejs.org/" target="_blank">node.js</a>. A instalação é feita através do <a href="https://www.npmjs.com/" target="_blank">npm</a>:

```bash
$ npm install -g localtunnel
```

Com este comando o localtunnel será instalado globalmente, assim poderemos acessá-lo de qualquer diretório e em qualquer nível no terminal. Uma vez instalado, poderemos utilizá-lo através do comando **lt**.

Depois de instalarmos podemos verificar qual versão está na nossa máquina:

```bash
$ lt --version
```

## Utilizando o localtunnel

Os comandos do módulo são bem simples e intuitivos. Vamos levar em consideração que temos uma aplicação rodando na porta **8080 (http://localhost:8080) **e queremos disponibilizá-la na web.

Para disponibilizar a aplicação que está rodando nessa porta vamos executar o comando abaixo:

```bash
$ lt -port 8080
```

O localtunnel irá gerar uma URL de forma randômica e ela poderá ser acessada de qualquer lugar. Por exemplo, na minha máquina gerou a URL **https://tplqmjrzbd.localtunnel.me**.

A URL gerada geralmente não é nem um pouco amigável, então imagina dizer para um cliente acessar essa URL?! Mas não se preocupe, nós podemos inserir o parâmetro  <span class="symple-highlight symple-highlight-blue "><strong>-subdomain</strong> </span> para gerar um subdomínio mais legível:

```bash
$ lt -port 8080 -subdomain blogdogabrielfeitosa
```

E a URL gerada será **https://blogdogabrielfeitosa.localtunnel.me**.

Só que não para por ai, ainda podemos criar um proxy para um host externo ao **localhost** através do parâmetro <span class="symple-highlight symple-highlight-blue "><strong> -local-host </strong></span>.

```bash
$ lt -port 8080 -subdomain blogdogabrielfeitosa -local-host gabrielfeitosa.com
```

Como vimos neste post o uso do localtunnel é bem simples e prático. É um módulo muito útil quando precisamos disponibilizar alguma aplicação da máquina sem complicação. Também há outro sistema de túnel muito bom, o <a href="https://ngrok.com/" target="_blank">ngrok</a>, mas ele vai ficar para a próxima!

Então é isso galera, vou ficando por aqui.

Abraços e até a próxima!