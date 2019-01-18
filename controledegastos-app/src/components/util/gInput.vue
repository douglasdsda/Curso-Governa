<template>
  <q-field
    :error="$v.dValue.$error"
    :error-label="mensagemErro"
    :count="dTamanho"
    :disabled="desabilitar"
    :helper="mensagemAjuda"
    class="g-input"
    style="padding-right: 10px;"
  >
    <q-input
      v-bind:value="value"
      @input="atualizarModelo($event)"
      :float-label="etiqueta"
      @blur="validar"
      :disable="desabilitar"
      :type="tipo"
      :color="cor"
      :align="alinhar"
      :no-pass-toggle="true"
      :min-rows="linhasMinimo"
      :inverted=invertido
      :max-height="alturaMaxima"
      :max-length="dTamanho"
      @keyup.13="chamarFuncaoNoEnter"
      @keydown="validaInsercaoNoKeydown"
      :autofocus="foco"
      @change="change"
    />
  </q-field>
</template>

<script>
import util from 'components/util/util'
import {
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  alpha,
  alphaNum,
  numeric,
  email
} from 'vuelidate/lib/validators'
import decimal from 'vuelidate/lib/validators/decimal'
const cpfValido = (value) => (value === '' || util.validarCpf(value) === true)
const cnpjValido = (value) => (value === '' || util.validarCnpj(value) === true)
const telefoneValido = (value) => (value === '' || util.validarTelefone(value) === true)
const cepValido = (value) => (value === '' || util.validarCep(value) === true)
const inepValido = (value) => (value === '' || util.validarInep(value) === true)
const numeroDiferenteZeroValido = (value) => (value === '' || util.validarNumeroMaiorQueZero(value) === true)
const horaValido = (value) => (value === '' || util.validarHora(value) === true)
const horaGeralValido = (value) => (value === '' || util.validarHoraGeral(value) === true)
const cnsValido = (value) => (value === '' || util.validarCNS(value) === true)

export default {
  name: 'g-input',
  props: {
    // VALUE REPRESENTA O OBJETO REFERENCIADO POR V-MODEL
    value: {
      type: [String, Number],
      default: ''
    },
    etiqueta: {
      type: String,
      default: ''
    },
    validacao: {
      type: String,
      default: ''
    },
    tamanho: {
      type: Number,
      default: null
    },
    icone: {
      type: String,
      default: ''
    },
    cor: {
      type: String,
      default: ''
    },
    desabilitar: {
      type: [Boolean, String],
      default: false
    },
    mensagemAjuda: {
      type: String,
      default: ''
    },
    tipo: {
      type: String,
      default: 'text'
    },
    alinhar: {
      type: String,
      default: 'left'
    },
    alturaMaxima: {
      type: Number,
      defaul: null
    },
    linhasMinimo: {
      type: Number,
      defaul: null
    },
    // MANTEM O FOCO NO CAMPO QUANDO A PÁGINA TERMINAR DE CARREGAR
    foco: {
      type: Boolean,
      default: false
    },
    // FUNÇÃO A SER CHAMADA QUANDO O USUÁRIO PRESSIONAR O ENTER (13)
    chamarFuncaoNoEnter: {
      type: Function,
      default: () => {}
    },
    // HABILITAR A REMOÇÃO DE ACENTUAÇÃO NO TEXTO DIGITADO PELO USUÁRIO
    removerAcentuacao: {
      type: Boolean,
      default: true
    },
    // HABILITAR A CONVERÇÃO DOS CARACTERES DIGITADOS PARA MAIÚSCULO
    converterParaMaiusculo: {
      type: Boolean,
      default: true
    },
    validacaoCustomizada: {
      type: Function
    },
    mascara: {
      type: String,
      default: ''
    },
    change: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      dValue: this.value,
      dTamanho: this.tamanho,
      mensagemErro: '',
      invertido: this.cor !== ''
    }
  },
  validations () {
    var dValue = {}
    // AS REGRAS DE VALIDAÇÃO SÃO SEPARADAS POR '|'
    var validacoes = this.validacao.split('|')
    // AGREGAR A VALIDAÇÃO DE ACORDO COM O QUE É INFORMADO PELO USUÁRIO

    validacoes.forEach(v => {
      v = v.replace(' ', '')
      if (v === 'required') dValue.required = required
      if (v === 'numeric') dValue.numeric = numeric
      if (v === 'decimal') dValue.decimal = decimal
      if (v.includes('minValue')) dValue.minValue = minValue(v.substring(v.indexOf('(') + 1, v.indexOf(')')))
      if (v.includes('maxValue')) dValue.maxValue = maxValue(v.substring(v.indexOf('(') + 1, v.indexOf(')')))
      if (v.includes('minLength')) dValue.minLength = minLength(v.substring(v.indexOf('(') + 1, v.indexOf(')')))
      if (v.includes('maxLength')) dValue.maxLength = maxLength(v.substring(v.indexOf('(') + 1, v.indexOf(')')))
      if (v === 'email') dValue.email = email
      if (v === 'alpha') dValue.alpha = alpha
      if (v === 'alfaNum') dValue.alphaNum = alphaNum
      if (v.includes('between')) {
        // RECUPERANDO OS PARÂMETROS DE DENTRO DO PARÊNTESE (EX. [10,20] DE 'BETWEEN(10,20)')
        var params = v.match(/\((.*)\)/)[1].split(',')
        dValue.between = between(params[0], params[1])
      }
      if (v === 'cpf') dValue.cpf = cpfValido
      if (v === 'cnpj') dValue.cnpj = cnpjValido
      if (v === 'telefone') dValue.telefone = telefoneValido
      if (v === 'cep') dValue.cep = cepValido
      if (v === 'inep') dValue.inep = inepValido
      if (v === 'numeroDiferenteZero') dValue.numeroDiferenteZero = numeroDiferenteZeroValido
      if (v === 'hora') dValue.hora = horaValido
      if (v === 'horaGeral') dValue.horaGeral = horaGeralValido
      if (v === 'cns') dValue.cns = cnsValido
    })

    return {dValue}
  },
  methods: {
    atualizarModelo (valor) {
      this.dValue = valor
      // Emite o valor do número através do evento de input
      this.$emit('input', this.dValue)
    },
    reiniciarValidacao () {
      this.$v.dValue.$reset()
    },
    validar () {
      // ALTERAR COR DO CAMPO E EXIBIR MENSAGEM DE ERRO, CASO CAMPO INVÁLIDO
      this.$v.dValue.$touch()
      if (this.$v.dValue.email === false) {
        this.mensagemErro = 'Email inválido'
      }
      if (this.$v.dValue.between === false) {
        this.mensagemErro = 'Valor permitido entre ' + this.$v.dValue.$params.between.min + ' e ' + this.$v.dValue.$params.between.max
      }
      if (this.$v.dValue.minLength === false) {
        this.mensagemErro = 'Mínimo permitido de ' + this.$v.dValue.$params.minLength.min + ' caracteres'
      }
      if (this.$v.dValue.maxLength === false) {
        this.mensagemErro = 'Máximo permitido de ' + this.$v.dValue.$params.maxLength.max + ' caracteres'
      }
      if (this.$v.dValue.minValue === false) {
        this.mensagemErro = 'Valor ' + this.$v.dValue.$params.minValue.min + ' é o mínimo permitido'
      }
      if (this.$v.dValue.maxValue === false) {
        this.mensagemErro = 'Valor ' + this.$v.dValue.$params.maxValue.max + ' é o máximo permitido'
      }
      if (this.$v.dValue.alpha === false) {
        this.mensagemErro = 'Campo permite apenas letras'
      }
      if (this.$v.dValue.numeric === false) {
        this.mensagemErro = 'Campo permite apenas números'
      }
      if (this.$v.dValue.decimal === false) {
        this.mensagemErro = 'Campo permite apenas o formato: 00.00'
      }
      if (this.$v.dValue.alphaNum === false) {
        this.mensagemErro = 'Campo permite apenas letras e números'
      }
      if (this.$v.dValue.cpf === false) {
        this.mensagemErro = 'Campo CPF inválido'
      }
      if (this.$v.dValue.cnpj === false) {
        this.mensagemErro = 'Campo CNPJ inválido'
      }
      if (this.$v.dValue.telefone === false) {
        this.mensagemErro = 'Campo telefone inválido'
      }
      if (this.$v.dValue.cep === false) {
        this.mensagemErro = 'Campo CEP inválido'
      }
      if (this.$v.dValue.inep === false) {
        this.mensagemErro = 'Campo INEP inválido'
      }
      if (this.$v.dValue.numeroDiferenteZero === false) {
        this.mensagemErro = 'Campo número inválido'
      }
      if (this.$v.dValue.hora === false) {
        this.mensagemErro = 'Campo hora inválido'
      }
      if (this.$v.dValue.horaGeral === false) {
        this.mensagemErro = 'Campo hora geral inválido'
      }
      if (this.$v.dValue.cns === false) {
        this.mensagemErro = 'Campo CNS inválido'
      }
      if (this.$v.dValue.required === false) {
        this.mensagemErro = 'Campo obrigatório não informado'
      }
      return !this.$v.dValue.$invalid
    },
    mascaraTelefone (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
      valor = valor.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos
      return valor
    },
    mascaraCpf (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      if (valor.length <= 6) {
        valor = valor.replace(/(\d{3})(\d{1})/g, '$1.$2')
      }
      valor = valor.replace(/(\d{3})(\d{3})(\d{1})/g, '$1.$2.$3')
      valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1})/g, '$1.$2.$3-$4')
      return valor
    },
    mascaraCnpj (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      if (valor.length <= 5) {
        valor = valor.replace(/(\d{2})(\d{1})/g, '$1.$2')
      }
      if (valor.length > 5 && valor.length <= 8) {
        valor = valor.replace(/(\d{2})(\d{3})(\d{1})/g, '$1.$2.$3')
      }
      if (valor.length > 8 && valor.length <= 12) {
        valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g, '$1.$2.$3/$4')
      }
      valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/g, '$1.$2.$3/$4-$5')
      return valor
    },
    mascaraNota (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      if (valor.length === 2) {
        valor = valor.replace(/(\d{2})$/, '0,$1') // Coloca a virgula
      } else {
        valor = valor.replace(/(\d{2})$/, ',$1') // Coloca a virgula
        valor = valor.replace(/(\d+)(\d{3},\d{2})$/g, '$1.$2') // Coloca o primeiro ponto
        var qtdLoop = (valor.length - 3) / 3
        var count = 0
        while (qtdLoop > count) {
          count = count + 1
          valor = valor.replace(/(\d+)(\d{3}.*)/, '$1.$2') // Coloca o resto dos pontos
        }
        valor = valor.replace(/^(0)(\d)/g, '$2')
      }
      return valor
    },
    mascaraCep (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      valor = valor.replace(/(\d{2})(\d)/, '$1.$2') // Coloca um ponto entre o segundo e o terceiro dígito
      valor = valor.replace(/(\d{3})(\d{1,3})$/, '$1-$2') // Coloca um hífen entre o quinto e o sexto dígito

      return valor
    },
    mascaraHora (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      if (valor.length === 1) {
        valor = '0:0'.concat(valor) // Une o valor com 0:0 p/ formatar a hora
      } else if (valor.length === 2) {
        valor = valor.replace(/(\d{2})$/, '0:$1') // Coloca dois pontos
      } else {
        valor = valor.replace(/(\d{2})$/, ':$1') // Coloca dois pontos
        valor = valor.replace(/^(0)(\d)/g, '$2')
      }

      return valor
    },
    mascaraNumero (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      return valor
    },
    mascaraNumeroEndereco (valor) {
      var specialChars = '!@#$^&%*()+=[]\\{}|:<>?~`´'
      for (var i = 0; i < specialChars.length; i++) {
        valor = valor.replace(new RegExp('\\' + specialChars[i], 'gi'), '')
      }
      return valor
    },
    validaInsercaoNoKeydown (evt) {
      if (this.mascara === 'numero' || this.mascara === 'telefone' || this.mascara === 'hora' || this.mascara === 'nota' || this.mascara === 'cpf' || this.mascara === 'cnpj' || this.mascara === 'cep' || this.mascara === 'numeroUmaCasaDecimal') {
        if (!evt) {
          evt = window.event
        }
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)) && charCode !== 46 && charCode !== 35 && charCode !== 36 && charCode !== 37 && charCode !== 39) {
          evt.preventDefault()
        } else {
          return true
        }
      }
      if (this.mascara === 'numeroEndereco') {
        if (!evt) {
          evt = window.event
        }
        var CodeChar = (evt.which) ? evt.which : evt.keyCode
        var chr = String.fromCharCode(evt.which)
        if (('1234567890abcdefghijklmnopqrstuvwxyzÁ¼¾½ABCDEFGHIJKLMNOPQRSTUVWXYZªº–/.,'.indexOf(chr) < 0) && CodeChar !== 46 && CodeChar !== 35 && CodeChar !== 36 && CodeChar !== 37 && CodeChar !== 39 && CodeChar !== 8) {
          evt.preventDefault()
        } else {
          return true
        }
      }
    },
    mascaraUmaCasaDecimal (valor) {
      valor = valor.replace(/\D/g, '') // Remove tudo o que não é dígito
      if (valor.length === 1) {
        valor = valor.replace(/(\d{1})$/, '0,$1') // Coloca a virgula
      } else {
        valor = valor.replace(/(\d{1})$/, ',$1') // Coloca a virgula
        valor = valor.replace(/(\d+)(\d{3},\d{1})$/g, '$1.$2') // Coloca o primeiro ponto
        var qtdLoop = (valor.length - 3) / 3
        var count = 0
        while (qtdLoop > count) {
          count = count + 1
          valor = valor.replace(/(\d+)(\d{3}.*)/, '$1.$2') // Coloca o resto dos pontos
        }
        valor = valor.replace(/^(0)(\d)/g, '$2')
      }
      return valor
    }
  },
  watch: {
    value (valor) {
      let novoValor = valor
      // RETIRAR ACENTOS
      if (this.removerAcentuacao) novoValor = util.removerAcentos(valor)
      // DEIXA MAIUSCULO
      if (this.converterParaMaiusculo && typeof novoValor === 'string') novoValor = novoValor.toUpperCase()
      // MASCARA DE TELEFONE
      if (this.mascara === 'telefone') novoValor = this.mascaraTelefone(valor)
      // MASCARA DE CPF
      if (this.mascara === 'cpf') novoValor = this.mascaraCpf(valor)
      // MASCARA DE CNPJ
      if (this.mascara === 'cnpj') novoValor = this.mascaraCnpj(valor)
      // MASCARA DE NOTA
      if (this.mascara === 'nota') novoValor = this.mascaraNota(valor)
      // MASCARA DE CEP
      if (this.mascara === 'cep') novoValor = this.mascaraCep(valor)
      // MASCARA DE HORA
      if (this.mascara === 'hora') novoValor = this.mascaraHora(valor)
      // MASCARA DE SOMENTE NUMEROS
      if (this.mascara === 'numero') novoValor = this.mascaraNumero(valor)
      // MASCARA DE NUMERO ENDERECO
      if (this.mascara === 'numeroEndereco') novoValor = this.mascaraNumeroEndereco(valor)
      // MASCARA DE NUMERO DE UMA CASA DECIMAL
      if (this.mascara === 'numeroUmaCasaDecimal') novoValor = this.mascaraUmaCasaDecimal(valor)

      this.atualizarModelo(novoValor)
      this.dValue = valor
      this.validar()
    }
  },
  mounted () {
    if (this.mascara === 'telefone') this.dTamanho = 15
    if (this.mascara === 'cpf') this.dTamanho = 14
    if (this.mascara === 'cnpj') this.dTamanho = 18
    if (this.mascara === 'cep') this.dTamanho = 10
    if (this.tamanho === null || this.tamanho === undefined || this.tamanho === '') {
      if (this.mascara === 'nota') this.dTamanho = 7
    }
  }
}
</script>

<style>
  table .g-input {
    margin: 0;
  }
</style>
