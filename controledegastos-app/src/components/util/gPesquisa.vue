<template>
  <div>
    <q-card v-if="showCardPesquisa">
      <q-card-main>
        <q-collapsible class="gvn-collapse-filtro" icon="fa fa-filter" label="Pesquisa avançada" v-show="showBuscaAvancada">
          <slot></slot>
        </q-collapsible>
        <div class="row title">
          <div class="termo" v-if="showTermoPesquisa">
            <q-search
              class="gvn-q-search"
              v-model="termo"
              placeholder="Pesquisar"
              :debounce=1
              :max-length="tamanhoTermoPesquisa"
              @keyup.13="pesquisarTermo()"
              :clearable="false"
            />
          </div>
        </div>
        <div class="row mrg-t-10" v-show="showBotoesPesquisa">
          <div class="col-8 text-left">
            <!-- Botão de Pesquisar e Limpar -->
            <q-btn
              icon="fa fa-search"
              color="secondary"
              @click="pesquisar">
              Pesquisar
            </q-btn>
            <q-btn
              icon="fa fa-eraser"
              @click="limparFiltros"
              flat>
              Limpar
            </q-btn>
          </div>
          <div class="col-4 text-right">
            <q-btn v-show="imprimir !== null"
              icon="fa fa-print"
              @click="imprimirF"> 
              Imprimir
            </q-btn>
            <q-btn v-show="novo !== null"
              icon="fa fa-plus"
              color="primary"
              @click="novoF"> 
              Novo
            </q-btn>
          </div>
        </div>
      </q-card-main>
      <!-- BARRA DE PROCESSAMENTO -->
      <div style="height: 1px !important">
        <q-progress :indeterminate="true" v-show="progresso" />
      </div>
    </q-card>

    <div class="mrg-t-0">
      <g-datatable
        ref="refPesquisaResultado"
        v-model="pagina"
        :colunas=colunasPropriedade
        :operacoes=operacoes
        :api=apiPesquisa
        :apiRelatorio="apiRelatorio"
        :getFiltroPesquisa="getFiltros"
        :elementosPorPagina=elementosPorPagina
        :exibirColunaOperacoes=exibirColunaOperacoes
        :confVisualizar=confVisualizar
        :confEditar=confEditar
        :confExcluir=confExcluir
        :carregamentoInicial=carregamentoInicial
        :scrollHorizontal=scrollHorizontal
        :acaoPosPesquisa=acaoPosPesquisa
      />
    </div>
  </div>
</template>

<script>
  import util from 'components/util/util'
  export default {
    data () {
      return {
        pagina: 1,
        termo: '',
        progresso: false
      }
    },
    methods: {
      limpar () {
        this.$refs['refPesquisaResultado'].limpar()
      },
      limparFiltros () {
        this.termo = ''
        if (this.limparFiltroLocal) {
          this.limparFiltroLocal()
        }
        this.$refs['refPesquisaResultado'].pesquisar(1)
      },
      pesquisar () {
        this.$refs['refPesquisaResultado'].pesquisar(1)
      },
      pesquisarTermo () {
        this.$refs['refPesquisaResultado'].pesquisar(1)
      },
      getFiltros () {
        var filtro = '&termoBase64=' + util.paraBase64(this.termo)
        if (this.filtroAdicional) filtro += this.filtroAdicional()

        return filtro
      },
      dados () {
        return this.$refs['refPesquisaResultado'].dados
      }
    },
    props: {
      limparFiltroLocal: {
        type: Function
      },
      imprimir: {
        type: Function,
        default: null
      },
      novo: {
        type: Function,
        default: null
      },
      filtroAdicional: {
        type: Function
      },
      elementosPorPagina: {
        type: Number,
        default: null
      },
      colunasPropriedade: {
        type: Array,
        default: () => []
      },
      operacoes: {
        type: Array,
        default: () => []
      },
      apiPesquisa: {
        type: String,
        default: ''
      },
      apiRelatorio: {
        type: String,
        default: ''
      },
      visualizar: {
        type: Object,
        default: () => {}
      },
      editar: {
        type: Object,
        default: () => {}
      },
      excluir: {
        type: Object,
        default: () => {}
      },
      carregamentoInicial: {
        type: Boolean,
        default: () => true
      },
      exibirColunaOperacoes: {
        type: Boolean,
        default: () => true
      },
      confVisualizar: {
        type: Object,
        default: () => ({
          clique: () => alert('Sem ação'),
          permissao: () => false,
          visivel: () => false
        })
      },
      confEditar: {
        type: Object,
        default: () => ({
          clique: () => alert('Sem ação'),
          permissao: () => false,
          visivel: () => false
        })
      },
      confExcluir: {
        type: Object,
        default: () => ({
          clique: () => alert('Sem ação'),
          permissao: () => false,
          visivel: () => false
        })
      },
      showCardPesquisa: {
        type: Boolean,
        default: () => true
      },
      showTermoPesquisa: {
        type: Boolean,
        default: () => true
      },
      showBotoesPesquisa: {
        type: Boolean,
        default: () => true
      },
      showBuscaAvancada: {
        type: Boolean,
        default: () => true
      },
      scrollHorizontal: {
        type: Boolean,
        default: () => false
      },
      acaoPosPesquisa: {
        type: Function,
        default: () => {}
      },
      tamanhoTermoPesquisa: {
        type: Number,
        default: null
      }
    },
    computed: {
      novoF: function () {
        return this.novo || (() => alert(';('))
      },
      imprimirF: function () {
        return this.imprimir || (() => alert(';('))
      }
    },
    mounted () {
    }
  }
</script>

<style>
  .title {
    display: flex;
  }

  .termo {
    flex: 1;
  }

  .novo {
    margin-left: 25px;
    width: 105px !important;
  }

  .gvn-q-search  i:last-child  {
    display: none;
  }

  /* GAMBIARRA, PARA MUDAR A COR DO ICONE DO COLAPSE (NÃO ME MATE, PF) */
  .gvn-collapse-filtro .q-item-division {
    background: #E7ECF2;
  }

  .gvn-collapse-filtro .q-item-division:hover {
    background: #4F6984;
  }

  .gvn-collapse-filtro .q-item-division:hover .q-item-icon {
    color: white !important;
  }

  .gvn-collapse-filtro .q-item-division:hover .q-item-label {
    color: white !important;
  }

  .gvn-collapse-filtro .q-item-icon{ 
    color: #4F6984;
  }

  .gvn-collapse-filtro .q-item-label {
    color: #4F6984;
  }
</style>