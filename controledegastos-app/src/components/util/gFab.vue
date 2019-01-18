<template>
  <div class="col-12 text-right pad-20t-h10-80b">
    <q-fab
      push
      direction="left"
      class="fixed"
      style="right: 10px; bottom: 10px"
      color="info"
      icon="fa fa-info"
    >
      <q-fab-action v-if="ajudas" v-for="ajuda in ajudas" v-bind:key="ajuda.id" :color="ajuda.cor" :icon="ajuda.icone">
        <q-tooltip class="gvn-tooltip " anchor="bottom left" self="top left" :offset=[10,5]>
          <h6 :class="ajuda.tituloClasse" class="mrg-v-10">
            <q-icon :class="montaClasseIcone(ajuda.icone)"/>
            &nbsp;&nbsp;{{ajuda.tituloTexto}}
          </h6>
          <span v-if="!ajuda.info">{{ajuda.descricao}}</span>
          <div v-else>
            <p>{{ajuda.descricao}}</p>
            <strong class="gvn-obs">{{ajuda.info}}</strong>
          </div>
        </q-tooltip>
      </q-fab-action>
    </q-fab>
  </div>
</template>

<script>
export default {
  props: {
    // value representa o objeto referenciado por v-model
    ajudas: {
      type: Array,
      default: () => []
    },
    classeIcone: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    montaClasseIcone (icone) {
      if (icone.includes('fas ') || icone.includes('fab ') || icone.includes('far ') || icone.includes('fal ')) return icone
      return 'fa '.concat(icone)
    }
  }
}
</script>
