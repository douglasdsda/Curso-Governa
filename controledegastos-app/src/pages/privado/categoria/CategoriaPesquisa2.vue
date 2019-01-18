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
                            v-model="pessoa.codigo">
                        </g-input>
                    </div>
                    <div class="col-sm-4 col-xs-6">
                        <g-input
                            ref="refNome"
                            tipo="text"
                            etiqueta="Nome"
                            validacao="text"
                            :foco="false"
                            :chamarFuncaoNoEnter="pesquisarPrimeiraPagina"
                            v-model="pessoa.nome">
                        </g-input>
                    </div>
                    <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refAtivo"
                            etiqueta="Ativo"
                            :foco="false"
                            :itens="ativoArray"
                            item-valor="codigo"
                            item-etiqueta="descricao"
                            v-model="pessoa.ativo">
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
                            @click="abrirPaginaPessoaCadastrar">
                            &nbsp;&nbsp;Nova
                        </q-btn>
                    </div>
                </div>
            </q-card-main>
        </q-card>
        <br/>
        <g-datatable
            ref="refResultadoPesquisaPessoa"
            :getFiltroPesquisa="getFiltroPesquisa"
            :colunas=colunasPessoaDataTable
            :api="apiPessoa"
            v-model="pagina"
            :operacoes="operacoes"
            :exibirColunaOperacoes="exibirColunaOperacoes"
            :elementosPorPagina="elementosPorPagina"
            :carregamentoInicial="false">
        </g-datatable>
    </div>
</template>
<script>
import api from 'components/util/api'
import GInput from 'components/util/gInput'
import GSelect from 'components/util/GSelect'
import GDatatable from 'components/util/GDatatable'
import GBreadcrumb from 'components/util/gBreadcrumb'
export default {
  data () {
    return {
      exibirColunaOperacoes: true,
      elementosPorPagina: 10,
      pagina: 1,
      apiPessoa: api.PESSOA_LISTAR_PAGINADO,
      pessoa: {},
      ativoArray: [{codigo: 'false', descricao: 'Inativo'}, {codigo: 'true', descricao: 'Ativo'}],
      paginaStatus: {
        caminhoMigalha: [
          {
            icone: '',
            descricao: '',
            rotaNome: ''
          }
        ]
      },
      colunasPessoaDataTable: [
        {
          conteudoTipo: '',
          largura: '8%',
          cabecalhoClasse: 'text-center',
          cabecalhoEtiqueta: 'Código',
          conteudoClasse: 'text-center',
          propriedade: 'codigo',
          chave: 'codigo'
        },
        {
          conteudoTipo: '',
          largura: '25%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Nome',
          conteudoClasse: 'text-left',
          propriedade: 'nome'
        },
        {
          conteudoTipo: '',
          largura: '6%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Ativo',
          conteudoClasse: 'text-center',
          propriedade: 'ativo'
        },
        {
          conteudoTipo: '',
          largura: '8%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Estado',
          conteudoClasse: 'text-center',
          propriedade: 'endereco.estado'
        },
        {
          conteudoTipo: '',
          largura: '15%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Bairro',
          conteudoClasse: 'text-left',
          propriedade: 'endereco.bairro'
        },
        {
          conteudoTipo: '',
          largura: '20%',
          cabecalhoClasse: 'text-left',
          cabecalhoEtiqueta: 'Logradouro',
          conteudoClasse: 'text-left',
          propriedade: 'endereco.logradouro'
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
      var self = this
      var filtro = ''
      if (self.pessoa.codigo) filtro = filtro.concat('&codigo=').concat(self.pessoa.codigo)
      if (self.pessoa.nome) filtro = filtro.concat('&nome=').concat(self.pessoa.nome)
      if (self.pessoa.ativo) filtro = filtro.concat('&ativo=').concat(self.pessoa.ativo)
      return filtro
    },
    pesquisarPrimeiraPagina () {
      this.$refs['refResultadoPesquisaPessoa'].pesquisar(1)
    },
    abrirPaginaPessoaCadastrar () {

    }
  },
  mounted () {
    this.paginaStatus.caminhoMigalha = [
      {
        icone: 'person',
        descricao: 'Pesquisa de Pessoa',
        rotaNome: 'pessoaPesquisa'
      }
    ]

    this.pesquisarPrimeiraPagina()
  },
  components: {GBreadcrumb, GDatatable, GInput, GSelect}
}
</script>
