---
title: 'Socket.io e AngularJS: Comunicação em tempo real'
date: 2015-12-29T13:04:01+00:00
layout: post
permalink: /socketio-angularjs-comunicacao-realtime/
comments: true
categories:
  - AngularJs
  - NodeJS
tags:
  - angular
  - angularjs
  - backend
  - express
  - frontend
  - javascript
  - nodejs
  - socket
  - socket.io
  - websocket
---
Fala galera, beleza?

No último post falei um pouco sobre <a href="http://gabrielfeitosa.com/angularjs-refresh-periodico/" target="_blank">refresh periódico</a> com o AngularJS, quem ainda não leu ta perdendo, viu!? Corre e ler&#8230; =)

Após esse post, algumas pessoas falaram da questão do porquê não usei websocket!

**&#8220;Pô Gabriel, websocket é muito melhor para um chat, não?&#8221;** 

Sim, concordo. Mas a intenção do post anterior era somente falar sobre **refresh periódico**. Assim, como vocês que mandam aqui mesmo, vamos falar um pouco sobre **comunicação bidirecional**? Oxe, e não é sobre websocket? Calma meu fi, leia o resto. =)

Já ouviu falar sobre o <a href="http://socket.io/" target="_blank">socket.io</a>? É por causa dele que mencionei a comunicação bidirecional e não o websocket!

<!--more-->

## Porquê o **socket.io?**

Se você leu o post falando sobre <a href="http://gabrielfeitosa.com/angularjs-refresh-periodico/" target="_blank">refresh periódico</a>, mencionei o pooling que o twitter faz para verificar se há novas atualizações para o usuário. Porém, essa estratégia pode não ser eficaz para outros cenários. Por exemplo, um chat.

Nos dias de hoje a maioria dos browsers já implementam o suporte a WebSockets (duvida? confere no <a href="http://caniuse.com/websockets" target="_blank">Can I Use</a>), porém a biblioteca do socket.io abstrai isso para nós! Devido essa abstração, resolvi falar sobre ele e não sobre websocket.

O Socket.io é feito em JavaScript e possui uma API muito simples de ser utilizada. Além disso, ele funciona em qualquer plataforma, navegador ou dispositivo. Ou seja, pode usar e abusar que ele funciona! Já usou o <a href="https://trello.com/" target="_blank">Trello</a>? Ele usa socket.io. =)

Uma das features bacanas do socket.io é a lógica de reconexão que ele provêm, caso isso não seja útil para você dê uma olhada no <a href="https://github.com/socketio/engine.io" target="_blank">engine.io</a> que é a camada de websocket do socket.io.

No site tem alguns <a href="http://socket.io/demos/chat/" target="_blank">demos</a> bem bacanas. O código desses demos estão disponíveis no github e servem de exemplos para nós.

Então, vamos ao código?

Para o exemplo de hoje, escrevi o backend utilizando o <a href="http://nodejs.org/" target="_blank">nodejs</a>. Além disso, usei o framework <a href="http://expressjs.com/" target="_blank">express</a> e socket.io no lado servidor. Já no lado cliente, o framework adotado foi o angularjs e o socket.io.

Imagine que você vai a um bar e pede uma feijoada + uma cerveja bem gelada. A cerveja, as vezes, vem rapidinho, mas a comida&#8230; Para acabar com a agonia do cliente bebedor, vamos dar a ele o prazer de saber como anda o status do seu pedido.

Os fontes estão no <a href="https://github.com/gabrielfeitosa/pedidos-socket-io" target="_blank">github</a> e o exemplo pode ser visto rodando no <a href="https://gf-pedidos-socket.herokuapp.com/" target="_blank">heroku</a>.

Vamos ao código?

## Backend

O gist abaixo possui o código responsável pelo lado servidor. Basicamente ele implementa a solicitação dos pedidos via socket.io e realiza em um determinado intervalo de tempo o atendimento dos pedidos. Além disso, utilizei a API do express para informar que irei utilizar arquivos estáticos que estão dentro do diretório **public** (linha 9), pois o frontend está lá dentro**. **

{% highlight javascript linenos%}
'use strict';

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 5000;

app.use(express.static('public'));

var pedidos = [];
var id = 0;

io.on('connection', function(socket){
  io.to(socket.id).emit('loja pedidos', pedidos);

  socket.on('loja enviar', function(pedido){
    pedido.id = id++;
    pedido.data = new Date();
    pedido.status = 'Solicitado';
    pedidos[pedido.id] = pedido;
    io.emit('loja pedido', pedido);
    filaSolicitado(pedido.id);
  });

  function filaSolicitado(id){
    var pedido = pedidos[id]; 
    if(verificaSePodeExecutar(pedido.data,3000)){
      pedido.status = 'Em atendimento';  
      io.emit('loja pedido', {id: pedido.id, status: pedido.status});
      filaEmAtendimento(id); 
    }else{
      setTimeout(filaSolicitado,1000, id);  
    }
  }

  function filaEmAtendimento(id){
    var pedido = pedidos[id]; 
    if(verificaSePodeExecutar(pedido.data,7000)){
      pedido.status = 'Atendido';  
      io.emit('loja pedido', {id: pedido.id, status: pedido.status});
    }else{
      setTimeout(filaEmAtendimento,1000, id);  
    }
  }

  function verificaSePodeExecutar(date,time){
    var agora = new Date();
    var diff = (agora - date);
    return diff > time;
  }

});

http.listen(port, function(){
  console.log('Servidor rodando na porta:'+port);
});
{% endhighlight %}

Como dito antes, a API do socket.io é bem simples. Na **linha 14** estamos abrindo a conexão do socket com o client. Então, quando você acessar a tela dos pedidos o frontend abrirá essa conexão com o servidor. Na **linha 15**, estou enviando todos os pedidos já cadastrados somente para um determinado cliente.

Já na **linha 17, **o socket estará ouvindo o evento &#8220;**loja enviar**&#8220;. Ele é o evento responsável por receber os pedidos enviados pelo client. Sempre que um novo pedido é recebido pelo servidor, ele será tratado (recebe os atributos id, status e data) e em seguida (**linha 22**) o pedido é enviado para todos os sockets com conexão aberta. Os demais métodos **filaSolicitado** e **filaEmAtendimento** são os responsáveis pela lógica para mudança de status e envio da atualização para o cliente.

Não entrei em detalhes sobre o código, pois acredito que está tranquilo para atendê-lo. Caso tenha alguma dúvida sobre a API do socket, favor consulte a <a href="http://socket.io/docs/" target="_blank">documentação</a> ou deixe um comentário que responderei com maior prazer.

## Frontend

O código abaixo, representa o controlador responsável pela view no AngularJS. Tentei deixar o código bem simples para exemplificar melhor. Perceba que também usei o socket.io no lado cliente.

{% highlight javascript linenos %}
(function() {
'use strict';

angular.module('app')
	.controller('LojaController', function($scope) {
		var socket = io();
		var vm = this;
		vm.pedido = {};
		vm.pedidos = [];
		
		vm.enviar = enviar;
		
		init();

		function init(){
			socket.on('loja pedidos', function(pedidos){
				vm.pedidos = pedidos;
				$scope.$apply();
			});
			socket.on('loja pedido', function(pedido){
				var encontrou = false;
				for(var x = 0; x < vm.pedidos.length && !encontrou; x++){
					if(vm.pedidos[x].id === pedido.id){
						vm.pedidos[x].status = pedido.status;
						encontrou = true;
					}
				}
				if(!encontrou){
					vm.pedidos.push(pedido);
				}
				$scope.$apply();
			});

		}

		function enviar() {
		    socket.emit('loja enviar', vm.pedido);
		    vm.pedido.item = '';
		}

	});
})();
{% endhighlight %}

De acordo com o gist, na **linha 6** ocorre a abertura da conexão com o servidor. Note que não passei nenhum parâmetro indicando a URL do socket que quero abrir a conexão, pois, por default, ele irá apontar para o meu endereço atual.

Já as **linhas 16 e 20, **estão os listeners que irão receber os dados enviados pelo servidor. O primeiro é usado quando o servidor envia o array com todos os pedidos já cadastrados. Já o segundo, é utilizado quando o servidor envia uma atualização do status de um pedido.

Veja que na **linha 31 **precisei utilizar o **$scope.$apply**,** **isso é necessário devido a atualização do pedido ser realizada fora do escopo do Angular. Então, é preciso informá-lo que ele deve ser atualizado.

Por fim, a função **enviar** (**linha 36**) é a responsável por enviar os dados do cliente para o servidor. Esse envio é feito através do evento **&#8220;loja enviar&#8221;** no socket.

> [Dica]
  É possível debugar o que está sendo trafegado pelo socket. Para isso, abra o console do seu browser (<b>F12</b> abestado!) e digite <b>localStorage.debug = &#8220;*&#8221;;</b> Mais informações podem ser encontradas na <a href="http://socket.io/docs/logging-and-debugging/" target="_blank">documentação oficial</a>.
{: .notice}

As informações de como rodar o projeto deixei no **README.md**.

Então é isso galera, espero que curtam o post.

Como estamos no final do ano, desejo a todos boas festas e que 2016 venha com tudo e nos traga bons códigos!

Abraços e até a próxima.