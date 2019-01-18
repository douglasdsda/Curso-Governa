import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../../store'
import util from './util'

Vue.use(VueResource)
const http = Vue.http

export default {
  // Envia requisição HTTP (método GET) a ser redirecionado para o servidor de relatório (Jaspersoft Server)
  // utilizando a url passada como parâmetro a qual identifica o relatório cadastrado.
  // # url: endereço URL do relatório para o qual será redirecionado
  httpGetRelatorioJaspersoftServerNovaAba (url) {
    let urlFinal = process.env.API
      .concat('/relatorio?')
      .concat('referencia=')
      .concat(util.paraBase64(url))

    window.open(urlFinal, '_blank')
  },
  // Envia requisição HTTP (método GET) que realizará o redirecionamento utilizando a url do
  // relatório e o token de autenticação passados como parâmetros.
  // # url          : endereço URL do relatório que será redirecionada.
  httpGetRelatorioNovaAba (url) {
    let urlObj
    try {
      urlObj = new URL(url)
    } catch (e) {
      // url passada como parâmetro não é válida
      // recuperando a url corrente
      let urlBase = new URL(window.location.href)
      // compondo a url do relatório
      url = urlBase.origin + url
    }
    urlObj = new URL(url)
    let urlFinal = urlObj.protocol
      .concat('//')
      .concat(urlObj.hostname)
      .concat(':')
      .concat(urlObj.port)
      .concat('/relatorioAPI?')
      .concat('url=')
      .concat(util.paraBase64(url))
      .concat('&token=')
      .concat(util.paraBase64(store.getters.token))

    window.open(urlFinal, '_blank')
  },
  // Envia requisição HTTP (método GET) e retorna um objeto Promise
  // # url: endereço para o qual será enviada a requisição
  httpGetPromise (url) {
    var cabecalho = this.getCabecalhoAutorizacao()
    return http.get(url, cabecalho)
  },
  // Envia requisição HTTP (método GET)
  // # url          : endereço para o qual será enviada a requisição
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpGet (url, callbackFunc) {
    // var cabecalho = this.getCabecalhoAutorizacao()
    http.get(url).then(data => {
      callbackFunc(data)
    }, err => {
      this.exibirErro(err)
    })
  },
  // Envia requisição HTTP (método GET mascarado com o sufixo de termos)
  // # url          : endereço para o qual será enviada a requisição
  // # termo        : valor a ser passado para a API como comparacao
  // # termo        : filtro de busca
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpGetTermoFiltro (url, termo, filtro, callbackFunc) {
    url = url
      .concat('?termoBase64=')
      .concat(util.paraBase64(termo))
      .concat('&')
      .concat(filtro)

    let cabecalho = this.getCabecalhoAutorizacao()

    http.get(url, cabecalho).then(data => {
      callbackFunc(data)
    }, err => {
      this.exibirErro(err)
    })
  },
  // Envia requisição HTTP (método GET mascarado com o sufixo de termos)
  // # url          : endereço para o qual será enviada a requisição
  // # termo        : valor a ser passado para a API como comparacao
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpGetTermo (url, termo, callbackFunc) {
    url = url
      .concat('/termo/')
      .concat(util.paraBase64(termo))
    let cabecalho = this.getCabecalhoAutorizacao()
    http.get(url, cabecalho).then(data => {
      callbackFunc(data)
    }, err => {
      this.exibirErro(err)
    })
  },
  // Envia requisição HTTP (método POST)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpPost (url, dadoJson, callbackFunc) {
  //  var cabecalho = this.getCabecalhoAutorizacao()

    http.post(url, dadoJson).then(data => {
      callbackFunc(data)
    }, err => {
      this.exibirErro(err)
    })
  },
  // Retorna um promise de envio de requisição HTTP (método POST)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  httpPostPromise (url, dadoJson) {
    var cabecalho = this.getCabecalhoAutorizacao()
    return http.post(url, dadoJson, cabecalho)
  },
  // Envia requisição HTTP (método GET) exibindo o Loading (carregando)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpGetCarregando (url, callbackFunc) {
    util.mostrarCarregando()
    var cabecalho = this.getCabecalhoAutorizacao()
    http.get(url, cabecalho).then(data => {
      callbackFunc(data)
      util.esconderCarregando()
    }, err => {
      this.exibirErro(err)
      util.esconderCarregando()
    })
  },
  // Envia requisição HTTP (método POST) exibindo o Loading (carregando)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpPostCarregando (url, dadoJson, callbackFunc) {
    util.mostrarCarregando()
    var cabecalho = this.getCabecalhoAutorizacao()
    http.post(url, dadoJson, cabecalho).then(data => {
      callbackFunc(data)
      util.esconderCarregando()
    }, err => {
      this.exibirErro(err)
      util.esconderCarregando()
    })
  },
  // Envia requisição HTTP (método PUT)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpPut (url, dadoJson, callbackFunc) {
    http.put(url, dadoJson).then(data => {
      callbackFunc(data)
    }, err => {
      this.exibirErro(err)
    })
  },
  // Retorna um promise de envio de requisição HTTP (método PUT)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  httpPutPromise (url, dadoJson) {
    // var cabecalho = this.getCabecalhoAutorizacao()
    return http.put(url, dadoJson)
  },
  // Envia requisição HTTP (método PUT) exibindo o Loading (carregando)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpPutCarregando (url, dadoJson, callbackFunc) {
    util.mostrarCarregando()
    var cabecalho = this.getCabecalhoAutorizacao()
    http.put(url, dadoJson, cabecalho).then(data => {
      callbackFunc(data)
      util.esconderCarregando()
    }, err => {
      this.exibirErro(err)
      util.esconderCarregando()
    })
  },
  // Envia requisição HTTP (método DELETE)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # dadoJson     : Dado trafegado no corpo da mensagem (formato JSON)
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpDelete (url, callbackFunc) {
    // var cabecalho = this.getCabecalhoAutorizacao()
    http.delete(url).then(data => {
      callbackFunc(data)
    }, err => {
      this.exibirErro(err)
    })
  },
  // Envia requisição HTTP (método DELETE) exibindo o Loading (carregando)
  // # url          : endereço do servidor para o qual a requisição é enviada
  // # callbackFunc : função callback invocada após o retorno do servidor
  httpDeleteCarregando (url, callbackFunc) {
    util.mostrarCarregando()
    var cabecalho = this.getCabecalhoAutorizacao()
    http.delete(url, cabecalho).then(data => {
      callbackFunc(data)
      util.esconderCarregando()
    }, err => {
      this.exibirErro(err)
      util.esconderCarregando()
    })
  },
  // Retorna cabeçalho com a autorização especificada
  getCabecalhoAutorizacao () {
    var cabecalho = {}
    if (store.getters.token) {
      cabecalho = {
        headers: {
          // 'Authorization': 'Bearer ' + store.getters.token // TODO - DESCOMENTAR
        }
      }
    }
    return cabecalho
  },
  // Exibe a mensagem de erro no dialog
  // # erro        : objeto que encapsula dados do erro
  // # toast : referência do toast utilizado para exbir mensagens de erro ou avisos
  exibirErro (erro) {
    var titulo, mensagem
    if (erro.status === 400) {
      // util.exibirToastAviso(erro.body[0].mensagem)
      var errosArray = erro.body
      errosArray.forEach(item => {
        console.log(item.mensagemDesenvolvedor)
        util.exibirToastAviso(item.mensagemUsuario)
      })
    } else if (erro.status === 401) {
      // Redirecionar para a tela de login
      util.exibirToastAviso('Não autorizado')
      this.$router.push('/')
    } else if (erro.status === 500) {
      console.log(erro.status + ' - erro interno no servidor' + erro)
      // Redirecionar para a tela de login
      util.exibirDialog('Servidor indisponível', 'Servidor indisponível no momento, tente novamente mais tarde.')
    } else {
      if (erro.status === 0) {
        titulo = 'Servidor sem comunicação'
      } else {
        titulo = erro.status + ' - erro ao enviar requisição'
      }
      mensagem = JSON.stringify(erro)
      util.exibirDialog(titulo, mensagem)
    }
  }
}
