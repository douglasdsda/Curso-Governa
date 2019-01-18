import { Dialog, Notify } from 'quasar'

export const iconeTamanho = '40px'

var Base64 = require('js-base64').Base64

export default {
  getDescricaoMes (mes) {
    var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return meses[mes]
  },
  getMesesLista () {
    var meses = [{nome: 'Janeiro', value: 1},
      {nome: 'Fevereiro', value: 2},
      {nome: 'Março', value: 3},
      {nome: 'Abril', value: 4},
      {nome: 'Maio', value: 5},
      {nome: 'Junho', value: 6},
      {nome: 'Julho', value: 7},
      {nome: 'Agosto', value: 8},
      {nome: 'Setembro', value: 9},
      {nome: 'Outubro', value: 10},
      {nome: 'Novembro', value: 11},
      {nome: 'Dezembro', value: 12}]
    return meses
  },
  FormatString (obj) {
    if (!obj) {
      return ''
    }
    return obj.toString().trim()
  },
  // Pega o subitem do objeto json, retornando null se nada for encontrado
  // #path, caminho no item eq: 'pessoa.mae.nome'
  // #object, objeto refente
  // ##retorno, null se nada for encontrado.
  getItemRecursivo (path, object) {
    if (!path || !object) return null
    // Se nenhum estiver vazio, monta o Path
    path.split('.').forEach(o => {
      object = object[o]
    })
    return object
  },
  // Remove dos componentes o resultado da validação anterior
  // #refs: referência para os componentes
  reiniciarValidacaoComponentes (refs) {
    // Validar os componentes referenciados
    Object.keys(refs).forEach(c => {
      if (typeof refs[c].reiniciarValidacao === 'function') {
        refs[c].reiniciarValidacao()
      }
    })
  },
  // Valida os componentes de uma página. Chama a validação de cada componente e exibe a mensagem,
  // caso os valores preenchidos são inválidos
  // #refs: referência para os componentes da página
  // ##retorno: 'true', se são válidos, 'false' caso contrário
  validarComponentes (refs) {
    var invalido = 0
    // Validar os componentes referenciados
    Object.keys(refs).forEach(c => {
      if (refs[c] !== undefined && typeof refs[c].validar === 'function' && !refs[c].validar()) {
        // Componente inválido
        invalido++
      }
    })
    if (invalido === 1) {
      // Apenas um componente inválido
      this.exibirToastAviso('Favor corrigir campo inválido')
      return false
    } else if (invalido > 1) {
      // Múltiplos componentes inválidos
      this.exibirToastAviso('Favor corrigir os campos inválidos')
      return false
    }
    return true
  },
  formatarCpf (cpf) {
    if (cpf.length === 11) {
      cpf = cpf.substring(0, 3).concat('.')
        .concat(cpf.substring(3, 6)).concat('.')
        .concat(cpf.substring(6, 9)).concat('-')
        .concat(cpf.substring(9, 11))
    }
    return cpf
  },
  formatarCnpj (cnpj) {
    if (cnpj.length === 14) {
      cnpj = cnpj.substring(0, 2).concat('.')
        .concat(cnpj.substring(3, 6)).concat('.')
        .concat(cnpj.substring(6, 9)).concat('/')
        .concat(cnpj.substring(9, 12)).concat('-')
        .concat(cnpj.substring(12, 14))
    }
    return cnpj
  },

  // Valida o CPF de uma pessoa.
  validarCpf (cpf) {
    cpf = cpf.replace(/[^\d]+/g, '')
    var soma = 0
    var resto
    var digitosIguais = true

    for (var i = 0; i < cpf.length - 1; i++) {
      if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
        digitosIguais = false
        break
      }
    }

    if (digitosIguais === false) {
      for (i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
      }

      resto = (soma * 10) % 11

      if ((resto === 10) || (resto === 11)) resto = 0
      if (resto !== parseInt(cpf.substring(9, 10))) return false

      soma = 0
      for (i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
      }

      resto = (soma * 10) % 11

      if ((resto === 10) || (resto === 11)) resto = 0
      if (resto !== parseInt(cpf.substring(10, 11))) return false

      return true
    } else {
      return false
    }
  },
  // Valida o cnpj
  validarCnpj (cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '')
    if (cnpj === '') return false
    if (cnpj.length !== 14) {
      return false
    }
    // Elimina CNPJs invalidos conhecidos
    if (cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999') {
      return false
    }
    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== Number(digitos.charAt(0))) {
      return false
    }
    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== Number(digitos.charAt(1))) {
      return false
    }
    return true
  },
  // Valida o telefone
  validarTelefone (tel) {
    tel = tel.replace(/[^\d]+/g, '')
    var totalDigitos = tel.length
    if (totalDigitos >= 10) {
      return true
    } else {
      return false
    }
  },
  // Valida o cep
  validarCep (cep) {
    cep = cep.replace(/[^\d]+/g, '')

    var totalDigitos = cep.length

    if (totalDigitos === 8) {
      return true
    } else {
      return false
    }
  },
  // Valida o Inep
  validarInep (inep) {
    inep = inep.replace(/[^\d]+/g, '')
    var totalDigitos = inep.length
    if (totalDigitos === 8) {
      return true
    } else {
      return false
    }
  },
  // Valida se o numero eh maior que zero
  validarNumeroMaiorQueZero (numero) {
    numero = numero.replace(/[^\d]+/g, '')
    var totalDigitos = numero.length
    if (totalDigitos > 0) {
      if (Number(numero) > 0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  // Valida a hora
  validarHora (horaValor) {
    let horaMinuto = horaValor.split(':')
    if (horaMinuto.length > 1) {
      let hora = horaMinuto[0]
      let minuto = horaMinuto[1]
      let horaInt = parseInt(hora)
      let minInt = parseInt(minuto)
      if (horaInt > 23) {
        return false
      } else if (minInt > 59) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  },
  // Valida a hora geral
  validarHoraGeral (horaValor) {
    let horaMinuto = horaValor.split(':')
    if (horaMinuto.length > 1) {
      let minuto = horaMinuto[1]
      let minInt = parseInt(minuto)
      if (minInt > 59) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  },
  validarCNS (vlrCNS) {
    if (vlrCNS.length !== 15) return false
    if (vlrCNS === '000000000000000') return false
    var resultado
    var provisorio = [7, 8, 9]
    var primeiro = parseInt(vlrCNS.substring(0, 1))
    if (provisorio.indexOf(primeiro) >= 0) {
      return this.validarCNSProv(vlrCNS)
    }
    var pis = vlrCNS.substring(0, 11)
    var soma = (((Number(pis.substring(0, 1))) * 15) +
              ((Number(pis.substring(1, 2))) * 14) +
              ((Number(pis.substring(2, 3))) * 13) +
              ((Number(pis.substring(3, 4))) * 12) +
              ((Number(pis.substring(4, 5))) * 11) +
              ((Number(pis.substring(5, 6))) * 10) +
              ((Number(pis.substring(6, 7))) * 9) +
              ((Number(pis.substring(7, 8))) * 8) +
              ((Number(pis.substring(8, 9))) * 7) +
              ((Number(pis.substring(9, 10))) * 6) +
              ((Number(pis.substring(10, 11))) * 5))
    var resto = soma % 11
    var dv = 11 - resto
    if (dv === 11) dv = 0
    if (dv === 10) {
      soma = (((Number(pis.substring(0, 1))) * 15) +
              ((Number(pis.substring(1, 2))) * 14) +
              ((Number(pis.substring(2, 3))) * 13) +
              ((Number(pis.substring(3, 4))) * 12) +
              ((Number(pis.substring(4, 5))) * 11) +
              ((Number(pis.substring(5, 6))) * 10) +
              ((Number(pis.substring(6, 7))) * 9) +
              ((Number(pis.substring(7, 8))) * 8) +
              ((Number(pis.substring(8, 9))) * 7) +
              ((Number(pis.substring(9, 10))) * 6) +
              ((Number(pis.substring(10, 11))) * 5) + 2)
      resto = (soma % 11)
      dv = (11 - resto)
      resultado = pis + '001' + String(dv)
    } else {
      resultado = pis + '000' + String(dv)
    }
    return (vlrCNS === resultado)
  },
  validarCNSProv (vlrCNS) {
    var pis = vlrCNS.substring(0, 15)
    var soma = ((parseInt(pis.substring(0, 1), 10)) * 15) +
               ((parseInt(pis.substring(1, 2), 10)) * 14) +
               ((parseInt(pis.substring(2, 3), 10)) * 13) +
               ((parseInt(pis.substring(3, 4), 10)) * 12) +
               ((parseInt(pis.substring(4, 5), 10)) * 11) +
               ((parseInt(pis.substring(5, 6), 10)) * 10) +
               ((parseInt(pis.substring(6, 7), 10)) * 9) +
               ((parseInt(pis.substring(7, 8), 10)) * 8) +
               ((parseInt(pis.substring(8, 9), 10)) * 7) +
               ((parseInt(pis.substring(9, 10), 10)) * 6) +
               ((parseInt(pis.substring(10, 11), 10)) * 5) +
               ((parseInt(pis.substring(11, 12), 10)) * 4) +
               ((parseInt(pis.substring(12, 13), 10)) * 3) +
               ((parseInt(pis.substring(13, 14), 10)) * 2) +
               ((parseInt(pis.substring(14, 15), 10)) * 1)
    var resto = soma % 11
    return resto === 0
  },
  // Cria objeto data com timezone local
  // # data : Data no formato yyyy-MM-dd
  criarData (data) {
    if (!data) return
    let dat = new Date(data)
    dat.setTime(dat.getTime() + dat.getTimezoneOffset() * 60000)
    return dat
  },
  // Formata objeto data (ex. dd/mm/yyyy)
  // # data : Objeto data a ser formatado
  // # formato : Define o formato que a data terá
  formatarData (data, formato) {
    if (!data) { return }
    let dateFormat = require('dateformat')
    return dateFormat(data, formato)
  },
  // Retorna a quantidade de horas de diferença entre duas datas
  dataDiferencaMinutos (data1, data2) {
    let dif = (data2 - data1) / 6e4
    return parseInt(dif)
  },
  // Retorna a quantidade de horas de diferença entre duas datas
  dataDiferencaHoras (data1, data2) {
    let dif = (data2 - data1) / 36e5
    return parseInt(dif)
  },
  // Retorna a quantidade de dias de diferença entre duas datas
  dataDiferencaDias (data1, data2) {
    let dif = (data2 - data1) / (1000 * 60 * 60 * 24)
    return parseInt(dif)
  },
  // Retorna a quantidade de meses de diferença entre duas datas
  dataDiferencaMeses (data1, data2) {
    var meses = (data2.getFullYear() - data1.getFullYear()) * 12
    meses -= data1.getMonth() + 1
    meses += data2.getMonth()
    return meses <= 0 ? 0 : meses
  },
  // Retorna a quantidade de anos de diferença entre duas datas
  dataDiferencaAnos (data1, data2) {
    var ageDifMs = data2 - data1
    var ageDate = new Date(ageDifMs) // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  },
  // Retorna a descrição da diferença entre duas datas em minutos, horas, dias, meses e anos
  dataDiferencaDescricao (data1, data2) {
    // Define há quanto tempo a mensagem foi criada, sua idade em horas / dias.
    let texto = '{0} {1}{2}'
    let horaMin = this.dataDiferencaMinutos(data1, data2)
    if (horaMin <= 60) {
      texto = texto
        .replace('{0}', horaMin)
        .replace('{1}', 'minuto')
        .replace('{2}', horaMin > 1 ? 's' : '') // plural
      return texto
    }
    let horaQtd = this.dataDiferencaHoras(data1, data2)
    if (horaQtd <= 24) {
      texto = texto
        .replace('{0}', horaQtd)
        .replace('{1}', 'hora')
        .replace('{2}', horaQtd > 1 ? 's' : '') // plural
      return texto
    }
    let diaQtd = this.dataDiferencaDias(data1, data2)
    if (diaQtd <= 31) {
      texto = texto
        .replace('{0}', diaQtd)
        .replace('{1}', 'dia')
        .replace('{2}', diaQtd > 1 ? 's' : '') // plural
      return texto
    }
    let mesQtd = this.dataDiferencaMeses(data1, data2)
    if (mesQtd <= 12) {
      texto = texto
        .replace('{0}', mesQtd)
        .replace('{1}', 'mes')
        .replace('{2}', mesQtd > 1 ? 'es' : '') // plural
      return texto
    }
    let anosQtd = this.dataDiferencaAnos(data1, data2)
    texto = texto
      .replace('{0}', anosQtd)
      .replace('{1}', 'ano')
      .replace('{2}', anosQtd > 1 ? 's' : '') // plural
    return texto
  },
  // Exibir dialog com mensagem relevante para usuário
  // #titulo: título do dialog
  // #mensagem: texto direcionado ao usuário
  exibirDialog (titulo, mensagem) {
    Dialog.create({
      title: titulo,
      message: mensagem,
      buttons: [
        {
          label: 'Fechar',
          color: 'primary'
        }
      ]
    })
  },
  exibirConfirmacaoExclusao (titulo, mensagem, callback) {
    Dialog.create({
      title: titulo,
      message: mensagem,
      ok: {
        label: 'Sim, excluir',
        color: 'negative'
      },
      cancel: {
        label: 'Não',
        color: 'black'
      }
    }).then(() => {
      callback(callback)
    })
  },
  // exibe modal de escolha
  // #titulo: titulo do modal
  // #mensagem: texto direcionado ao usuário
  // #item1: texto do botao apresentado para escolha.
  // #item2: texto do botao apresentado para escolha.
  exibirConfirmacaoEscolhaDoisItens (titulo, mensagem, item1, item2, callback) {
    Dialog.create({
      title: titulo,
      message: mensagem,
      buttons: [
        {
          label: item1,
          color: 'primary',
          handler () {
            callback(item1)
          }
        },
        {
          label: item2,
          color: 'primary',
          handler () {
            callback(item2)
          }
        }
      ]
    })
  },
  // Exibir toast, mensagem temporizada, contendo texto de operação realizada com sucesso.
  // #mensagem: texto direcionado ao usuário
  exibirToastSucesso (mensagem) {
    Notify.create({
      message: mensagem,
      type: 'positive',
      position: 'bottom-left',
      timeout: 5000
    })
  },
  // Exibir toast, mensagem temporizada, contendo texto informativo.
  // #mensagem: texto direcionado ao usuário
  exibirToastInfo (mensagem) {
    Notify.create({
      message: mensagem,
      type: 'info',
      position: 'bottom-left',
      timeout: 5000
    })
  },
  // Exibir toast, mensagem temporizada, contendo texto informado que alguma falha ocorreu.
  // #mensagem: texto direcionado ao usuário
  exibirToastFalha (mensagem) {
    Notify.create({
      message: mensagem,
      type: 'negative',
      position: 'bottom-left',
      timeout: 5000
    })
  },
  // Exibir toast, mensagem temporizada, contendo aviso ao usuário.
  // #mensagem: texto direcionado ao usuário
  exibirToastAviso (mensagem) {
    Notify.create({
      message: mensagem,
      type: 'warning',
      position: 'bottom-left',
      timeout: 5000
    })
  },
  // Remove acentos de um texto.
  // #textoComAcentos: texto cotendo acentos que serão removidos
  // ##retorno: texto com caracteres sem acentuação
  removerAcentos (textoComAcentos) {
    var string = textoComAcentos
    var mapaAcentosHex = {
      a: /[\xE0-\xE6]/g,
      A: /[\xC0-\xC6]/g,
      e: /[\xE8-\xEB]/g,
      E: /[\xC8-\xCB]/g,
      i: /[\xEC-\xEF]/g,
      I: /[\xCC-\xCF]/g,
      o: /[\xF2-\xF6]/g,
      O: /[\xD2-\xD6]/g,
      u: /[\xF9-\xFC]/g,
      U: /[\xD9-\xDC]/g,
      c: /\xE7/g,
      C: /\xC7/g,
      n: /\xF1/g,
      N: /\xD1/g
    }

    for (var letra in mapaAcentosHex) {
      var expressaoRegular = mapaAcentosHex[letra]
      if (typeof string === 'string') string = string.replace(expressaoRegular, letra)
    }

    return string
  },
  // Remove acentos e converte caracteres minúsculos em maiúsculos.
  // #texto: texto a ser convertido
  // ##retorno: texto com caracteres maiúsculos e sem acentuação
  removerAcentosMaiusculo (texto) {
    let textoSemAcento = this.removerAcentos(texto)
    return textoSemAcento.toUpperCase()
  },
  // Retorna filtro contendo o código da relação ano letivo e escola, além de conter o código
  // do profissional
  getFiltroAnoLetivoEscolaProfissional (self) {
    let filtro = 'codAnoLetivoEscola={0}&codProfissional={1}'
      .replace('{0}', self.$store.getters.escolaAnoLetivoCorrente.codAnoLetivoEscola)
      .replace('{1}', self.$store.getters.codProfissional)
    return filtro
  },
  // Retorna o filtro contendo o código do profissional Autenticado
  getFiltroProfissionalAutenticado (self) {
    return '&codProfissional='.concat(this.getCodProfissionalAutenticado(self))
  },
  // Retorna o código da escola atual
  getCodEscola (self) {
    return self.$store.getters.codEscolaCorrente
  },
  // Retorna o nome do profissional
  getNomProfissional (self) {
    return self.$store.getters.nomProfissional
  },
  // Retorna o ano de referência do ano letivo
  geAnoLetivoNumAnoReferencia (self) {
    return self.$store.getters.escolaAnoLetivoCorrente.anoLetivo.numAnoReferencia
  },
  // Retorna o código do profissional Autenticado
  getCodProfissionalAutenticado (self) {
    return self.$store.getters.codProfissional
  },
  // Retorna dados da escola corrente, aquela que foi selecionada no momento da autenticação
  getEscolaCorrente (self) {
    return self.$store.getters.escolaAnoLetivoCorrente.escola.escola
  },
  // Adiciona objeto no Local Storage
  // # chave: identificador do objeto no Local Storage
  // # objeto: objeto que será armazenado no Local Storage
  adicionarNoStorage (chave, objeto) {
    localStorage.setItem(chave, JSON.stringify(objeto))
  },
  // Recupera do Local Storage o objeto previamente inserido
  // # chave: identificador do objeto no Local Storage
  recuperarDoStorage (chave) {
    return JSON.parse(localStorage.getItem(chave))
  },
  // Remove o objeto do Local Storage
  // # chave: identificador do objeto no Local Storage
  removerDoStorage (chave) {
    return localStorage.removeItem(chave)
  },
  // Bloqueia e exibe carregando da tela
  mostrarCarregando () {
    // Events.$emit('app-carregando', true)
  },
  // Desbloqueia a tela e esconde o "carregando"
  esconderCarregando () {
    // Events.$emit('app-carregando', false)
  },
  // Substitui 'PONTO' por 'VIRGULA' e fixa quantidade de casas decimais
  formatarNumero (numero, casaDecimal) {
    return Number(numero).toFixed(casaDecimal).replace('.', ',')
  },
  // Calcula a média ponderada
  calculaMediaPonderada (valor, peso) {
    if (valor === 0) return Number(0, 0)
    return this.formatarNumero(valor / peso, 2)
  },
  // Retorna para a página anterior através de dados do caminho de migalha definido no paginaStatus
  retornarCaminhoMigalhaPaginaAnterior (self) {
    if (self.paginaStatus.caminhoMigalha.length < 2) {
      console.error('Não é possível retornar para a página anterior, pois o tamanho do caminho de migalha é menor que 2: ' + self.paginaStatus.caminhoMigalha.length)
    }
    self.$router.push({ name: self.paginaStatus.caminhoMigalha[self.paginaStatus.caminhoMigalha.length - 2].rotaNome })
  },
  // Converte minutos em horas
  paraHoras (valor) {
    if (Number(valor) > 59) {
      let min = valor % 60
      let hor = (valor - min) / 60
      if (min < 10) min += '0'

      return String(hor).concat(':').concat(String(min))
    } else return 0
  },
  // Converte horas (hhhh:mm) em minutos
  paraMinutos (valor) {
    if (valor.toString() !== '') {
      let horaMinuto = valor.split(':')

      return (Number(horaMinuto[0]) * 60) + Number(horaMinuto[1])
    } else return 0
  },
  // Converte texto p/ numero
  paraNumero (texto) {
    if (texto) return texto.replace(/[^\d]+/g, '')
    return ''
  },
  // Converte texto para base64
  paraBase64 (texto) {
    return Base64.encode(texto)
  },
  // Converte texto de base64 para texto comum
  deBase64 (textoBase64) {
    return Base64.decode(textoBase64)
  }
}
