<template>
  <q-checkbox
    v-bind:value="value"
    @input="atualizarModelo($event)"
    :label="etiqueta"
    :disable="desabilitar"
  >
    <q-tooltip>{{tooltip}}</q-tooltip>
  </q-checkbox>
</template>

<script>
export default {
  name: 'g-checkbox',
  props: {
    // value representa o objeto referenciado por v-model
    value: {
      type: [String, Boolean],
      default: ''
    },
    etiqueta: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    },
    desabilitar: {
      type: [Boolean],
      default: false
    }
  },
  data () {
    return {
      dValue: this.value
    }
  },
  methods: {
    atualizarModelo (value) {
      this.dValue = value
      // Emite o valor do número através do evento de input
      this.$emit('input', this.dValue)
    }
  },
  watch: {
    value (value) {
      this.atualizarModelo(value)
      this.dValue = value
    }
  }
}
</script>
