---
title: 'EJB: TransactionAttribute invocando métodos no mesmo EJB'
date: 2015-08-05T10:56:43+00:00
layout: post
permalink: /ejb-transactionattribute-invocando-metodos-no-mesmo-ejb/
# image: 
categories:
  - Java
tags:
  - ejb
  - java
  - transações
  - transactionattribute
comments: true
---
E aí pessoal, beleza?

Muito se fala da utilidade de usarmos a anotação _**@TransactionAttribute**_, mas pouco se comenta sobre os problemas que podemos encontrar no seu uso e como resolvê-los. Há pouco tempo me deparei com um desses problemas, invocar um método anotado com TransactionAttribute através de outro do mesmo EJB.

**[NOTA]** Se você não está familizarizado com transações e @TransactionAttribute, recomendo a leitura deste [tutorial oficial](http://docs.oracle.com/javaee/6/tutorial/doc/bncij.html), ele auxilia no entendimento do conceito do que é e de como funcionam os diferentes tipos de transações. Tem outros artigos bacanas que podem ser vistos [aqui](http://www.devmedia.com.br/transacoes-no-ejb-enterprise-java-beans/25819), [aqui](https://lucianomolinari.wordpress.com/2012/04/04/entendendo-os-atributos-de-transacao/) e/ou [aqui](http://www.byteslounge.com/tutorials/java-ee-ejb-transaction-propagation-transactionattribute-tutorial).
{: .notice}

<!--more-->
## O problema

No exemplo abaixo, vamos imaginar um cenário onde processamos dados em lote:

{% highlight java linenos%}
@Stateless
public class BatchBeanImpl implements BatchBean { 

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void processarDados() {
     // faz algum processamento com os dados
  }
}
{% endhighlight %}

Para melhorar nossa performance e tratar melhor os erros, vamos dividir a transação principal em várias transações menores. O método principal não será transacionado, pois ele apenas lê dados de algum lugar, então usamos uma transação do tipo **TransactionAttributeType.NEVER**, que indicará que **processarDados** não possuirá transação.

No submétodo _**processaUmaPequenaColecaoDeDados**_, vamos usar o tipo _**TransactionAttributeType.REQUIRES_NEW**_, que indica que uma nova transação será aberta sempre que o método for chamado.

{% highlight java linenos%}
@Stateless
public class BatchBeanImpl implements BatchBean { 

  @TransactionAttribute(TransactionAttributeType.NEVER)
  public void processarDados() {
    //ler dados
    while (aindaTemDadosParaProcessar) {
      processaUmaPequenaColecaoDeDados(colecaoDeDados);
    }
  }

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void processaUmaPequenaColecaoDeDados(List dados) {
     // faz alguma coisa que precisa de uma transação
  }
} 
{% endhighlight %}

Se chamássemos **processarDados**, o que deveria ocorrer? O método **processaUmaPequenaColecaoDeDados** deveria ou não funcionar?

A resposta é que esse código está `errado`, pois **processaUmaPequenaColecaoDeDados** não cria uma nova transação.

Oxem, mas e o **REQUIRES_NEW** não deveria criar uma nova transação?  Sim, deveria. Porém, não é bem assim que funciona. Para que uma nova transação seja criada a invocação do método **processaUmaPequenaDeColecaoDeDados** deve passar pelo proxy, em outras palavras, o método deve ser invocado por uma interface de negócio.

## As soluções

A primeira solução que podemos usar é a injeção do próprio **BatchBean** em si mesmo (_self-inject_). Dessa forma, o comportamento da anotação TransactionAttribute não será ignorado e uma nova transação será criada sempre que o método for invocado.

{% highlight java linenos%}
@Stateless
public class BatchBeanImpl implements BatchBean {

  @EJB
  private BatchBean batchBean; 

  @TransactionAttribute(TransactionAttributeType.NEVER)
  public void processarDados() {
    //ler dados
    while (aindaTemDadosParaProcessar) {
      batchBean.processaUmaPequenaColecaoDeDados(colecaoDeDados);
    }
  }

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void processaUmaPequenaColecaoDeDados(List dados) {
     // faz alguma coisa que precisa de uma transação
  }
} 
{% endhighlight %}

Outra solução, é usar o SessionContext para obter uma referência para o BatchBean.

{% highlight java linenos%}
@Stateless
public class BatchBeanImpl implements BatchBean {

  private BatchBean batchBean;

  @Resource
  private SessionContext ctx;

  @PostConstruct
  public void init() {
      batchBean = ctx.getBusinessObject(BatchBean.class);
  } 

  @TransactionAttribute(TransactionAttributeType.NEVER)
  public void processarDados() {
    //ler dados
    while (aindaTemDadosParaProcessar) {
      batchBean.processaUmaPequenaColecaoDeDados(colecaoDeDados);
    }
  }

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void processaUmaPequenaColecaoDeDados(List dados) {
     // faz alguma coisa que precisa de uma transação
  }
} 
{% endhighlight %}

Não vou entrar no mérito se o design da implementação está bom ou ruim, muito menos entrar nos detalhes para saber qual das duas modalidades é a mais performática. Fica como dever de casa para todos nós. 😉

A transação é uma arma muito poderosa que pode nos ajudar em diversos cenários, porém, não conhecer o seu funcionamento pode fazer com que cometamos erros.

Então é isso pessoal, abraços e até a próxima.

&nbsp;