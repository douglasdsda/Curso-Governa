<template>
    <div class="row">
        <div class="col-sm-9 col-lg-10">
            <q-search
              v-model="model2"
              placeholder="Pesquisar"
              :clearable="false"
               />
        </div>
        <div class="col-sm-3 col-lg-2 text-right" v-if="visivel">
            <q-btn
                icon="fa-plus"
                color="tertiary"
                @click="novo"
                :disable="desabilitar"
                >
                Inserir
            </q-btn>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    visivel: {
      type: Boolean,
      default: true
    },
    desabilitar: {
      type: Boolean,
      default: false
    },
    novo: {
      type: Function
    },
    operacao: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      model2: ''
    }
  }
}
</script>

<style>
.gTitleLabel{
  padding-top: 40px;
  color: #4F6984;
  font-size: 18px
}
</style>
