<template>
  <div class="row"
    style="padding-right: 10px;">
    <div class="col-12">
      <q-field
          :disabled="desabilitar"
          :error="mensagemErro.length > 0"
          :error-label="mensagemErro"
          :count="dTamanho"
        >
        <q-input
          ref="inputText"
          v-model="termo"
          @blur="validarBlur"
          color="primary"
          :float-label="etiqueta"
          :placeholder="placeholder"
          @change="change"
          :max-length="dTamanho"
          @keyup.13="chamarFuncaoNoEnter"
          :disable="desabilitar">
            <q-autocomplete
              :min-characters="0"
              ref="autoComplete"
              @search="search"
              @selected="select"
              :max-results="20"
              :debounce="1"
              :separator="true"
              :disabled="desabilitar"
            />
        </q-input>
      </q-field>
    </div>
    <div class="col-12 text-right margin-neg">
      <q-btn
        class="clear-botao"
        @click="limpar"
        :disabled="desabilitar"
        v-show="itemSelecionado"
        flat
      >
        <q-icon name="fa fa-times" size="20px" :disabled="desabilitar" style="color: grey;"/>
      </q-btn>
    </div>
  </div>
</template>

<script>
import util from 'components/util/util'
import utilHttp from 'components/util/utilHttp'

export default {
  name: 'g-autocomplete',
  data () {
    return {
      dValue: this.value,
      termo: '', // TERMO DE PESQUISA
      mensagemErro: '',
      itemSelecionado: false,
      dTamanho: this.tamanho
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    sufixo: {
      type: [String, Number],
      default: ''
    },
    icone: {
      type: String,
      default: ''
    },
    tamanho: {
      type: Number,
      default: null
    },
    desabilitar: {
      type: [Boolean, String],
      default: false
    },
    acaoPosSelecao: {
      type: Function
    },
    placeholder: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      default: ''
    },
    valor: {
      type: String,
      default: ''
    },
    descricaoPrimaria: {
      type: String,
      default: ''
    },
    descricaoSecundaria: {
      type: String,
      default: ''
    },
    descricaoTerciaria: {
      type: String,
      default: ''
    },
    validacao: {
      type: String,
      default: ''
    },
    etiqueta: {
      type: String,
      default: ''
    },
    permitirTextoLivre: {
      type: [Boolean, String],
      default: false
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
    change: {
      type: Function,
      default: () => {}
    },
    // FUNÇÃO A SER CHAMADA QUANDO O USUÁRIO PRESSIONAR O ENTER (13)
    chamarFuncaoNoEnter: {
      type: Function,
      default: () => {}
    },
    filtroAdicional: {
      type: Function,
      default: () => { return null }
    }
  },
  methods: {
    validarBlur () {
      if (!this.permitirTextoLivre) {
        if (!this.dValue) this.atualizarModelo(null)
        else if (this.dValue && this.$refs['inputText'].value.trim() !== this.dValue.value.trim()) this.dValue = null
      } else this.validar()
    },
    validar () {
      if (this.validacao.includes('required')) {
        if (this.permitirTextoLivre === false && !this.dValue) {
          this.mensagemErro = 'Campo obrigatório não informado'
          return false
        } else if (this.permitirTextoLivre === true && (this.termo === null || this.termo.length === 0)) {
          this.mensagemErro = 'Campo obrigatório não informado'
          return false
        } else this.mensagemErro = ''
      }
      return true
    },
    limpar () {
      this.dValue = null
      this.itemSelecionado = false
    },
    select (object) {
      this.itemSelecionado = true
      this.dValue = object
      if (this.acaoPosSelecao) {
        this.acaoPosSelecao(object)
      }
    },
    search (termo, done) {
      // ADICIONA O SUFIXO COMO PARAMETROS EXTRAS
      if (this.sufixo) {
        termo = termo.concat('|').concat(this.sufixo)
      }

      // Recuperando o filtro adicional
      let filtro = this.filtroAdicional()

      if (termo) {
        if (filtro) {
          // Além do termo foi definido outros filtros
          utilHttp.httpGetTermoFiltro(this.api, termo, filtro, (resposta) => {
            this.searchCallback(resposta, done)
          })
        } else {
          // Busca apenas pelo termo
          utilHttp.httpGetTermo(this.api, termo, (resposta) => {
            this.searchCallback(resposta, done)
          })
        }
      }
    },
    // Tratamento da resposta
    searchCallback (resposta, done) {
      if (resposta.ok) {
        let tokens = resposta.body.map(o => {
          return {
            valor: util.FormatString(util.getItemRecursivo(this.valor, o)), // CHAVE DE CONTROLE INTERNO DO REGISTRO SELECIONADO
            valorObjeto: o, // CHAVE DE CONTROLE INTERNO DO REGISTRO SELECIONADO
            label: util.FormatString(util.getItemRecursivo(this.descricaoPrimaria, o)), // LABEL TITULO EM DESTAQUE
            sublabel: util.FormatString(util.getItemRecursivo(this.descricaoSecundaria, o)), // LABEL INFERIOR
            stamp: util.FormatString(util.getItemRecursivo(this.descricaoTerciaria, o)), // LABEL DA DIREITA
            value: util.FormatString(util.getItemRecursivo(this.descricaoPrimaria, o)) // VALOR QUE SERÁ CARREGADO PARA O CAMPO TEXTO AO SER SELECIONADO
          }
        })
        done(tokens)
      }
    },
    atualizarModelo (value) {
      this.$refs['inputText'].$emit('input', value ? value.value : '')
      this.$emit('input', value ? value.valor : '')
      this.validar()
    },
    getTermo () {
      return this.termo
    },
    carregar (valor, termo) {
      if (valor || termo) {
        this.$emit('input', valor)
        this.$refs['inputText'].$emit('input', termo)
        this.dValue = {
          valor: valor,
          value: termo
        }

        this.itemSelecionado = true
      }
    }
  },
  watch: {
    dValue (valor) {
      let novoValor = valor
      // RETIRAR ACENTOS
      if (this.removerAcentuacao) novoValor = util.removerAcentos(valor)
      // DEIXA MAIUSCULO
      if (this.converterParaMaiusculo && typeof novoValor === 'string') novoValor = novoValor.toUpperCase()
      this.atualizarModelo(novoValor)
    },
    termo (valor) {
      if (this.permitirTextoLivre === true && this.dValue && valor !== this.dValue.label) {
        if (this.removerAcentuacao) valor = util.removerAcentos(valor)
        if (this.converterParaMaiusculo && typeof valor === 'string') valor = valor.toUpperCase()

        this.itemSelecionado = false
        // Emite valor vazio, pois a descrição do campo não é a mesma do item selecionado
        this.$emit('input', '')
      }
    }
  }
}
</script>

<style>
.margin-neg {
  margin-top: -33px
}

.clear-botao {
  min-height: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  width: 20px !important;
}
</style>
