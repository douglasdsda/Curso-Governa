<template>
  <div class="fixo-topo">
    <q-card class="gvn-breadcrumb">
      <ul class="breadcrumb">
        <li v-if="paginas" v-for="pagina in paginas" v-bind:key="pagina.id" @click="abrirPagina(pagina.rotaNome)">
          <a><q-icon :name="pagina.icone" :class="pagina.classe" style="font-size: 20px" /><span>{{pagina.descricao}}</span></a>
        </li>
      </ul>
    </q-card>
  </div>
</template>
<script>
export default {
  props: {
    // value representa o objeto referenciado por v-model
    paginas: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    abrirPagina (rotaNome) {
      this.$router.push({ name: rotaNome })
    }
  }
}
</script>
