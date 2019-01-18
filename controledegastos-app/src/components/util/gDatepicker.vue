<template>
  <div class="col-11" style="padding-right: 10px"
    v-bind:class="['q-field row no-wrap items-start q-field-floating q-field-no-label'
                    , (mensagemErro) ? 'q-field-with-error col-11' : '']"
  >
    <div class="col-12">
      <div class="q-field-content col-xs-12 col-sm" >
        <div v-bind:class="[ 'datepicker-valor'
                            , 'q-if row no-wrap'
                            , 'relative-position'
                            , 'q-input'
                            , 'q-if-has-label'
                            , (mensagemErro) ? 'q-if-error' : ''
                            , (desabilitar) ? 'q-if-disabled' : '']">
          <div class="col-12 q-if-inner col row no-wrap items-center relative-position" style="margin-bottom: 0px;">

            <div class="col-12">
              <q-datetime
                v-model="data"
                @input="atualizarModelo($event)"
                language="pt-br"
                :float-label="etiqueta"
                :format="formatoTexto"
                :disable="desabilitar"
                input-class="col q-input-target g-datepicker"
                :min="dataMin"
                :max="dataMax"
              >
              </q-datetime>
            </div>
            <div class="col-1 text-right">
              <q-btn
                class="datepicker-botao"
                @click="limparData"
                :disabled="desabilitar"
                v-show="data != null" flat
                color="black"
              >
                <q-icon name="close" size="20px" :disabled="desabilitar"/>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="q-field-bottom row no-wrap" v-show="mensagemErro">
          <div class="q-field-error col">{{mensagemErro}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from './util'

export default {
  name: 'g-input',
  props: {
    // value representa o objeto referenciado por v-model
    value: {
      type: [String, Number, Date],
      default: null
    },
    formatoTexto: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    formatoObjeto: {
      type: String,
      default: 'yyyy-mm-dd'
    },
    etiqueta: {
      type: [String, Number],
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
    dataMin: {
      type: String,
      default: null
    },
    dataMax: {
      type: [String, Date],
      default: null
    },
    mensagemAjuda: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data: null,
      dataMinBkp: null,
      dataMaxBkp: null,
      dValue: this.value,
      mensagemErro: '',
      state: {
        disabled: {},
        highlighted: {
          dates: [ // Highlight an array of dates
            new Date()
          ]
        }
      }
    }
  },
  methods: {
    atualizarModelo (value) {
      this.data = value
      var dateFormat = require('dateformat')
      if (this.data) {
        // Emite o valor do número através do evento de input
        this.$emit('input', dateFormat(this.data, this.formatoObjeto))
      } else {
        this.$emit('input', null)
      }
      this.validar()
    },
    limparData () {
      this.atualizarModelo(null)
    },
    validar () {
      // É OBRIGATÓRIO
      if (this.validacao.includes('required')) {
        // É VÁLIDO
        if (!this.data) this.mensagemErro = 'O campo data é obrigatório'
        else this.mensagemErro = ''
      }
      return !this.mensagemErro
    },
    reiniciarValidacao () {
      this.mensagemErro = null
    },
    atribuirData (value) {
      this.data = util.criarData(value)
    }
  },
  watch: {
    value (value) {
      if (value) this.atribuirData(value)
      else this.data = null
      this.validar()
    },
    dataMin (value) {
      let minima = util.criarData(value)
      this.dataMinBkp = minima
      // DESABILITAR DATA MÍNIMA
      if (this.dataMaxBkp === null) {
        this.state.disabled = {
          to: minima
        }
      } else {
        this.state.disabled = {
          to: minima,
          from: this.dataMaxBkp
        }
      }
      // ATRIBUIR A DATA MÍNIMA AO CAMPO
      if (this.data && minima > this.data) this.data = minima
    },
    dataMax (value) {
      let maxima = util.criarData(value)
      this.dataMaxBkp = maxima
      // DESABILITAR DATA MÁXIMA
      if (this.dataMinBkp === null) {
        this.state.disabled = {
          from: maxima
        }
      } else {
        this.state.disabled = {
          to: this.dataMinBkp,
          from: maxima
        }
      }
      // ATRIBUIR A DATA DESTE CORRENTE CALENDÁRIO COM A DATA DO CALENDÁRIO QUE REPRESENTA A DATA MÁXIMA
      if (this.data && maxima < this.data) this.data = maxima
    }
  },
  mounted () {
    if (this.value) this.atribuirData(this.value)
  }
}
</script>
<style>
  .g-datepicker {
    width: 195px !important;
    color: black !important;
    cursor: pointer;
  }
  .datepicker-botao {
    min-height: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    width: 20px !important;
    padding-left: -20px;
  }
  .datepicker-icon {
    cursor: pointer;
  }
  .datepicker-valor {
    padding-bottom: 1px !important;
  }
</style>
