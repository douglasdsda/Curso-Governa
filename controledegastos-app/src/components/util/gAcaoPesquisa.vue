<template>
  <div class="row">
    <div class="text-left col-sm-11" >
    <!-- Botão de Limpar Pesquisa -->
      <!-- Botão de Pesquisar -->
      <q-btn
        icon="fa-search"
        color="secondary"
        @click="pesquisar"
        :disable="desabilitar"
      >
        Pesquisar
      </q-btn>
      <q-btn
        icon="fa-eraser"
        @click="limpar"
        flat
        :disable="desabilitar"
        v-show="false"
      >
        Limpar
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    limpar: {
      type: Function
    },
    pesquisar: {
      type: Function
    },
    desabilitar: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.fixed {
  z-index: 10
}
</style>
