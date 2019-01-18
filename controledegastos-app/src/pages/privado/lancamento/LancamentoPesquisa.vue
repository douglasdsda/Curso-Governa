<template>
    <div>
        <g-breadcrumb :paginas="paginaStatus.caminhoMigalha"/>
        <q-card>
            <q-card-main>
                <div class="row">
                    <div class="col-sm-4 col-xs-6">
                        <g-input
                            ref="refCodigo"
                            tipo="text"
                            etiqueta="Código"
                            validacao="numeric"
                            :foco="false"
                            :chamarFuncaoNoEnter="pesquisarPrimeiraPagina"
                            v-model="lancamento.codigo">
                        </g-input>
                    </div>
                    <div class="col-sm-4 col-xs-6">
                        <g-input
                            ref="refNome"
                            tipo="text"
                            etiqueta="Descrição"
                            validacao="text"
                            :foco="false"
                            :chamarFuncaoNoEnter="pesquisarPrimeiraPagina"
                            v-model="lancamento.descricao">
                        </g-input>
                    </div>
                     <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refTipo"
                            etiqueta="Tipo lançamento"
                            :foco="false"
                            :itens="tipoLancamentoArray"
                            item-valor="codigo"
                            item-etiqueta="descricao"
                            v-model="lancamento.tipo">
                        </g-select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refCategoria"
                            etiqueta="Categoria"
                            :foco="false"
                            :itens="categoriaArray"
                            item-valor="codigo"
                            item-etiqueta="nome"
                            v-model="lancamento.categoria.codigo">
                        </g-select>
                    </div>
                    <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refPessoa"
                            etiqueta="Pessoa"
                            :foco="false"
                            :itens="pessoaArray"
                            item-valor="codigo"
                            item-etiqueta="nome"
                            v-model="lancamento.pessoa.codigo">
                        </g-select>
                    </div>
                </div>
                <br/>
                <div class="row">
                    <div class="col-sm-6 text-left">
                        <q-btn
                            icon="fas fa-search"
                            color="warning"
                            @click="pesquisarPrimeiraPagina">
                            &nbsp;&nbsp;Pesquisar
                        </q-btn>
                    </div>
                    <div class="col-sm-6 text-right">
                        <q-btn
                            icon="fas fa-plus"
                            color="primary"
                            @click="abrirPaginaLancamentoCadastrar">
                            &nbsp;&nbsp;Novo
                        </q-btn>
                    </div>
                </div>
            </q-card-main>
        </q-card>
        <br/>
        <g-datatable
            ref="refResultadoPesquisaLancamento"
            :getFiltroPesquisa="getFiltroPesquisa"
            :colunas=colunasLancamentoDataTable
            :api="apiLancamento"
            v-model="pagina"
            :operacoes="operacoes"
            :exibirColunaOperacoes="true"
            :elementosPorPagina="elementosPorPagina"
            :carregamentoInicial="false">
        </g-datatable>
    </div>
</template>
<script>
import api from 'components/util/api'
import msg from 'components/util/msg'
import util from 'components/util/util'
import utilHttp from 'components/util/utilHttp'
import GInput from 'components/util/gInput'
import GSelect from 'components/util/gSelect'
import GDatatable from 'components/util/gDatatable'
import GBreadcrumb from 'components/util/gBreadcrumb'

export default {
  data () {
    return {
      apiLancamento: api.LANCAMENTO_LISTAR_PAGINADO,
      pagina: 1,
      elementosPorPagina: 10,
      lancamento: {
        categoria: {},
        pessoa: {}
      },
      tipoLancamentoArray: [{codigo: 'RECEITA', descricao: 'RECEITA'},
        {codigo: 'DESPESA', descricao: 'DESPESA'}],
      categoriaArray: [],
      pessoaArray: [],
      paginaStatus: {
      },
      colunasLancamentoDataTable: [
        {
          conteudoTipo: '',
          largura: '6%',
          cabecalhoClasse: 'text-center',
          cabecalhoEtiqueta: 'Código',
          conteudoClasse: 'text-center',
          propriedade: 'codigo',
          chave: 'codigo'
        },
        {
          conteudoTipo: '',
          largura: '20%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Descrição',
          conteudoClasse: 'text-left',
          propriedade: 'descricao'
        },
        {
          conteudoTipo: '',
          largura: '10%',
          cabecalhoClasse: 'text-center',
          cabecalhoEtiqueta: 'Dt. Vencimento',
          conteudoClasse: 'text-center',
          propriedade: 'dataVencimento',
          formatar: (valor) => util.formatarData(valor, 'dd/mm/yyyy')
        },
        {
          conteudoTipo: '',
          largura: '10%',
          cabecalhoClasse: 'text-center',
          cabecalhoEtiqueta: 'Dt. Pagamento',
          conteudoClasse: 'text-center',
          propriedade: 'dataPagamento',
          formatar: (valor) => util.formatarData(valor, 'dd/mm/yyyy')
        },
        {
          conteudoTipo: '',
          largura: '8%',
          cabecalhoClasse: 'text-center',
          cabecalhoEtiqueta: 'Tipo',
          conteudoClasse: 'text-center',
          propriedade: 'tipo'
        },
        {
          conteudoTipo: '',
          largura: '10%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Categoria',
          conteudoClasse: 'text-left',
          propriedade: 'categoria.nome'
        },
        {
          conteudoTipo: '',
          largura: '10%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Pessoa',
          conteudoClasse: 'text-left',
          propriedade: 'pessoa.nome'
        }
      ],
      operacoes: [
        {
          cor: 'blue',
          icone: 'fas fa-search',
          tooptip: 'Visualizar pessoa',
          clique: this.visualizarItem,
          permissao: (row) => true,
          visivel: (row) => true
        },
        {
          cor: 'orange',
          icone: 'fas fa-edit',
          tooptip: 'Editar pessoa',
          clique: this.editarItem,
          permissao: (row) => true,
          visivel: (row) => true
        },
        {
          cor: 'red',
          icone: 'fas fa-trash',
          tooptip: 'Excluir pessoa',
          clique: this.excluirItem,
          permissao: (row) => true,
          visivel: (row) => true
        }
      ]
    }
  },
  methods: {
    getFiltroPesquisa () {
      var filtro = ''
      var self = this
      if (self.lancamento.codigo) filtro = filtro.concat('&codigo=').concat(self.lancamento.codigo)
      if (self.lancamento.descricao) filtro = filtro.concat('&descricao=').concat(self.lancamento.descricao)
      if (self.lancamento.tipo) filtro = filtro.concat('&tipo=').concat(self.lancamento.tipo)
      if (self.lancamento.categoria.codigo) filtro = filtro.concat('&categoriaCodigo=').concat(self.lancamento.categoria.codigo)
      if (self.lancamento.pessoa.codigo) filtro = filtro.concat('&pessoaCodigo=').concat(self.lancamento.pessoa.codigo)
      return filtro
    },
    pesquisarPrimeiraPagina () {
      this.$refs['refResultadoPesquisaLancamento'].pesquisar(1)
    },
    carregarFiltroCategoria () {
      utilHttp.httpGet(api.CATEGORIA, resposta => {
        this.categoriaArray = resposta.body
      })
    },
    carregarFiltroPessoa () {
      utilHttp.httpGet(api.PESSOA, resposta => {
        this.pessoaArray = resposta.body
      })
    },
    abrirPaginaLancamentoCadastrar () {
      var newPaginaStatus = {
        lancamento: {
          categoria: {},
          pessoa: {}
        }
      }
      newPaginaStatus.operacao = {
        nome: 'Novo',
        icone: 'fas fa-plus'
      }
      newPaginaStatus.caminhoMigalha = this.paginaStatus.caminhoMigalha
      newPaginaStatus.desabilitarEdicao = false
      this.$router.push({
        name: 'lancamentoCadastrar',
        params: {
          paginaStatus: newPaginaStatus
        }
      })
    },
    visualizarItem (item) {
      delete item.colunas
      this.paginaStatus.lancamento = item
      this.paginaStatus.desabilitarEdicao = true
      this.paginaStatus.operacao = {
        nome: 'Visualizar',
        icone: 'fas fa-search'
      }
      this.$router.push({
        name: 'lancamentoCadastrar',
        params: {
          paginaStatus: this.paginaStatus
        }
      })
    },
    editarItem (item) {
      delete item.colunas
      this.paginaStatus.lancamento = item
      this.paginaStatus.desabilitarEdicao = false
      this.paginaStatus.operacao = {
        nome: 'Editar',
        icone: 'fas fa-edit'
      }
      this.$router.push({
        name: 'lancamentoCadastrar',
        params: {
          paginaStatus: this.paginaStatus
        }
      })
    },
    excluirItem (item) {
      util.exibirConfirmacaoExclusao('EXCLUSÃO', msg.m(5), () => {
        var filtro = '/'.concat(item.codigo)
        utilHttp.httpDelete(api.LANCAMENTO.concat(filtro), resposta => {
          if (resposta.status === 204) {
            util.exibirToastSucesso(msg.m(4))
            this.$refs['refResultadoPesquisaLancamento'].pesquisar(1)
          } else {
            util.exibirToastFalha('Erro ao excluir o lançamento')
          }
        })
      })
    }
  },
  mounted () {
    this.paginaStatus.caminhoMigalha = [
      {
        icone: 'new releases',
        descricao: 'Pesquisa de Lançamento',
        rotaNome: 'lancamentoPesquisa'
      }
    ]

    this.$refs['refResultadoPesquisaLancamento'].pesquisar(1)
    this.carregarFiltroCategoria()
    this.carregarFiltroPessoa()
  },
  components: {GBreadcrumb, GDatatable, GInput, GSelect}
}
</script>
