<template>
  <q-field
    :error="$v.dValue.$error"
    :error-label="mensagemErro"
    :disabled="desabilitar"
    :helper="mensagemAjuda"
    class="g-select"
    style="padding-right: 10px;"
  >
    <q-select
      v-if="multi"
      multiple
      chips
      separator
      v-bind:value="value"
      :options="itensConvertidos"
      :float-label="etiqueta"
      :disable="desabilitar"
      :color=cor
    />
    <q-select
      v-else
      v-bind:value="value"
      @input="atualizarModelo($event)"
      :options="itensConvertidos"
      :float-label="etiqueta"
      :disable="desabilitar"
      @change="change"
      filter
      autofocus-filter
    />
  </q-field>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import util from './util'

export default {
  name: 'g-select',
  props: {
    // Representa o objeto referenciado por v-model
    value: {
      type: [String, Number, Array, Boolean],
      default: ''
    },
    itens: {
      type: Array,
      default: () => []
    },
    multi: {
      type: Boolean,
      default: false
    },
    cor: {
      type: String,
      default: ''
    },
    nome: {
      type: String,
      default: ''
    },
    etiqueta: {
      type: String,
      default: ''
    },
    icone: {
      type: String,
      default: ''
    },
    desabilitar: {
      type: Boolean,
      default: false
    },
    validacao: {
      type: String,
      default: ''
    },
    itemEtiqueta: {
      type: [String, Number, Boolean],
      default: () => ['', null, false]
    },
    itemValor: {
      type: [String, Number, Boolean],
      default: () => ['', null, false]
    },
    mensagemAjuda: {
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
      mensagemErro: '',
      itensConvertidos: []
    }
  },
  validations () {
    var dValue = {}
    // As regras de validação são separadas por '|'
    var validacoes = this.validacao.split('|')
    // Agregar a validação de acordo com o que é informado pelo usuário
    validacoes.forEach(v => {
      if (v.includes('required')) dValue.required = required
    })
    return {dValue}
  },
  methods: {
    atualizarModelo (value) {
      if (!value) value = null
      this.dValue = value
      // Emite o valor do número através do evento de input
      this.$emit('input', value)
      this.validar()
    },
    validar () {
      // Alterar cor do campo e exibir mensagem de erro, caso campo inválido
      this.$v.dValue.$touch()
      if (this.$v.dValue.required === false) {
        this.mensagemErro = 'Campo obrigatório não informado'
      }
      return !this.$v.dValue.$invalid
    },
    reiniciarValidacao () {
      this.$v.dValue.$reset()
    },
    converterItens (valor) {
      // Convertendo array para o formato que o componente reconhece ({value: 'valor', label: 'etiqueta'})
      this.itensConvertidos = Array.from(valor, p => {
        return this.itemValor
          ? {value: util.getItemRecursivo(this.itemValor, p),
            label: util.getItemRecursivo(this.itemEtiqueta, p).toString()}
          : ({value: p, label: p.toString()})
      })
      if (!this.multi) this.itensConvertidos.unshift({value: '', label: ''})
    },
    // Retorna a etiqueta do item selecionado
    itemEtiquetaSelecionado () {
      if (!this.itens) {
        return null
      }
      var lista = this.itens.filter(p => p[this.itemValor] === this.value)
      if (!lista) {
        return null
      }
      // Retornando a etiqueta do item selecionado pelo usuário
      return lista[0][this.itemEtiqueta]
    }
  },
  watch: {

    itens (valor) {
      this.converterItens(valor)
    },
    value (value) {
      this.dValue = value
      this.validar()
    }
  },
  mounted () {
    this.converterItens(this.itens)
  }
}
</script>
