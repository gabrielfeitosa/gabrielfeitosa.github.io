---
title: 'Bower: Gerenciamento de pacotes no front-end'
date: 2015-09-28T13:43:27+00:00
layout: post
permalink: /gerenciando-pacotes-no-frontend-com-o-bower/
comments: true
categories:
  - Tools
tags:
  - bower
  - frontend
  - tools
---
Fala galera, beleza?

Hoje vamos falar sobre gerenciamento de pacotes com o Bower. Uma das coisas que mais me irritou quando comecei a desenvolver _front-end_, usando somente módulos javascript, foi justamente o gerenciamento das dependências desses módulos. Como eu tenho raízes no _Java_, já estava acostumado a ter o _<a href="https://maven.apache.org/" target="_blank">Maven</a>_ ou o _<a href="https://gradle.org/" target="_blank">Gradle</a>_ gerenciando toda essa parafernália de libs para mim. Depois de muito trabalho manual, acessando sites e baixando os javascripts (ou pegando somente a referência) conheci finalmente o **Bower**.

Vale ressaltar que o Bower não é somente um gerenciador de módulos javascript, é também um gerenciador de dependências para _front-end_. Mas qual a diferença? A diferença é que para ele não interessa se tem javascript, css, html, imagem etc. dentro de um pacote, o que importa é que o código está encapsulado, normalmente acessível ao público e hospedado em um repositório _git_.

<!--more-->

> O Bower nada mais é do que um gerenciador de pacotes.

Também é importante frisar que o Bower é apenas um gerenciador de pacotes e nada mais. Ele não oferece, por exemplo, a capacidade de concatenar ou minificar código.

Agora chega de papo e vamos ver como ele funciona!

## Instalação

Antes de mais nada, é necessário ter o <a href="https://nodejs.org" target="_blank">nodejs</a> instalado, caso não o tenha a instalação é muito simples, basta acessar o <a href="https://nodejs.org/en/download/" target="_blank">site</a> e fazer o download.

Com o _nodejs_ instalado, vamos fazer a instalação do Bower através do <a href="https://www.npmjs.com/" target="_blank">npm</a>. O _npm_ é o gerenciador de pacotes do _nodejs_, mas você não precisará instalá-lo, uma vez que ele já vem empacotado junto ao _nodejs_.

```bash
$ npm install -g bower
```

Com este comando executado no terminal estamos mandando o npm instalar o Bower. Uma observação importante é a utilização do  <span class="symple-highlight symple-highlight-gray "><strong>-g</strong> </span>, que informa ao npm para instalar o _bower_ globalmente. Assim, ele poderá ser usado como uma _feature_ do sistema e não de um projeto específico.

## Iniciando um projeto com o Bower

Como exemplo, vamos criar um projeto web simples. Nosso projeto possui a seguinte estrutura:

![Projeto exemplo](/img/projeto_bower_exemplo.png)

Para adicionar o Bower, vá até a pasta do projeto e digite o seguinte comando:

```bash
$ bower init
```

O Bower irá iniciar um wizard para gerar o arquivo **bower.json**. Ele fará algumas perguntas como o nome do projeto, qual a versão, solicitará uma descrição, entre outras informações. Neste exemplo utilizei todas as configurações _default_:

{% highlight json%}
{
  "name": "bower-exemplo",
  "version": "0.0.0",
  "homepage": "https://github.com/gabrielfeitosa/blog_exemplos",
  "authors": [
    "Gabriel Feitosa <gabfeitosa@gmail.com>"
  ],
  "description": "",
  "main": "",
  "moduleType": [],
  "license": "MIT"
}
{% endhighlight %}

<a href="http://bower.io/docs/creating-packages/#bowerjson" target="_blank">Aqui</a> você encontra mais informações sobre as tags do arquivo bower.json.

## Procurando Pacotes

Agora que você já sabe iniciar o bower no seu projeto, é chegada a hora de procurar os pacotes que deseja usar. Para isso o Bower dispõe do comando abaixo:

```bash
$ bower search "nome do pacote"
```

Caso você não use o termo **"nome do pacote"**, todos os pacotes serão listados. Se você não gosta de fazer a pesquisa no terminal, assim com eu, há a opção de pesquisar o pacote no <a href="http://bower.io/search/" target="_blank">site do bower</a>.

## Instalando Pacotes

Uma vez que já sabemos o nome do pacote a ser instalado &#8211; no nosso exemplo será o **angularjs** -, vamos solicitar sua instalação ao Bower.

```bash
$ bower install angularjs --save
```

Ao executar esse comando estamos dizendo ao Bower para instalar o pacote do angularjs. Ele será instalado dentro do diretório **bower_components**, como na imagem abaixo.

![Pacote instalado no bower](/img/projeto_bower_exemplo2.png)

Também é possível notar que passei o argumento `--save`. Ele indica que queremos salvar essa dependência dentro do arquivo _bower.json_. O novo arquivo bower.json, já com a dependência do angularjs, pode ser visto no gist abaixo:

{% highlight json%}
{
  "name": "bower-exemplo",
  "version": "0.0.0",
  "homepage": "https://github.com/gabrielfeitosa/blog_exemplos",
  "authors": [
    "Gabriel Feitosa <gabfeitosa@gmail.com>"
  ],
  "description": "",
  "main": "",
  "moduleType": [],
  "license": "MIT",
  "dependencies": {
    "angular": "angularjs#~1.4.6"
  }
}
{% endhighlight %}

Há outras formas de instalar os pacotes, como editar o _bower.json_ e adicionar as dependências que necessitamos. Na sequência é só executar o comando abaixo para que as dependências que ainda não foram instaladas sejam baixadas para o diretório bower_components:

```bash
$ bower install
```

## Atualizando e Removendo Pacotes

Se há uma nova versão disponível de um pacote que estamos usando, o Bower pode fazer essa atualização de uma forma bem simples:

```bash
$ bower update
```

Com esse comando solicitamos ao _bower_ que atualize todos os pacotes que estão como dependência dentro do arquivo _bower.json_.

Por fim, temos a opção de desinstalar um pacote utilizando o comando _uninstall_:

```bash
$ bower uninstall angularjs
```

Se quisermos remover também a referência do bower.json precisamos utilizar a flag `--save`.

Há outros comandos que não abordei aqui como o **list**, que serve para listar os pacotes locais e informar se há uma versão mais atual do pacote que estamos usando. Neste <a href="http://bower.io/docs/api/#commands" target="_blank">link</a> você pode ver quais os outros comandos disponíveis.

E por hoje é isso pessoal. O Bower é uma excelente ferramenta para mantermos as nossas bibliotecas sempre atualizadas e organizadas, vamos utilizá-lo.

Abraços e até a próxima!