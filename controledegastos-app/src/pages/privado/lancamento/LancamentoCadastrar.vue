<template>
    <div>
        <g-breadcrumb :paginas="paginaStatus.caminhoMigalha" />
        <q-card>
            <q-card-main>
                <div class="row">
                    <div class="col-sm-4 col-xs-6">
                        <g-input
                            ref="refCodigo"
                            tipo="text"
                            etiqueta="Código"
                            validacao="numeric"
                            :desabilitar="true"
                            :foco="false"
                            v-model="paginaStatus.lancamento.codigo">
                        </g-input>
                    </div>
                    <div class="col-sm-4 col-xs-6">
                        <g-input
                            ref="refNome"
                            tipo="text"
                            etiqueta="Descrição"
                            validacao="required | text"
                            :foco="false"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.descricao">
                        </g-input>
                    </div>
                     <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refTipo"
                            etiqueta="Tipo lançamento"
                            validacao="required"
                            :foco="false"
                            :itens="tipoLancamentoArray"
                            item-valor="codigo"
                            item-etiqueta="descricao"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.tipo">
                        </g-select>
                    </div>
                </div>
                <div class="row">
                    <div class="row col-sm-4 col-xs-6">
                        <g-datepicker
                            ref="datVencimento"
                            etiqueta="Data Vencimento"
                            validacao="required"
                            :foco="false"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.dataVencimento">
                        </g-datepicker>
                    </div>
                    <div class="row col-sm-4 col-xs-6">
                        <g-datepicker
                            ref="datPagamento"
                            etiqueta="Data Pagamento"
                            :foco="false"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.dataPagamento">
                        </g-datepicker>
                    </div>
                    <div class="col-sm-4 col-xs-6" style="padding-top: 9px">
                        <g-input
                            ref="refValor"
                            tipo="text"
                            etiqueta="Valor Lançamento"
                            validacao="required | decimal"
                            :foco="false"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.valor">
                        </g-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refCategoria"
                            etiqueta="Categoria"
                            validacao="required"
                            :foco="false"
                            :itens="categoriaArray"
                            item-valor="codigo"
                            item-etiqueta="nome"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.categoria.codigo">
                        </g-select>
                    </div>
                    <div class="col-sm-4 col-xs-6">
                        <g-select
                            ref="refPessoa"
                            etiqueta="Pessoa"
                            validacao="required"
                            :foco="false"
                            :itens="pessoaArray"
                            item-valor="codigo"
                            item-etiqueta="nome"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.pessoa.codigo">
                        </g-select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <g-input
                            ref="refValor"
                            tipo="textarea"
                            etiqueta="Observação"
                            validacao="required | maxLength(100)"
                            :alturaMaxima="100"
                            :linhasMinimo="2"
                            :tamanho="100"
                            :foco="false"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="paginaStatus.lancamento.observacao">
                        </g-input>
                    </div>
                </div>
            </q-card-main>
        </q-card>
        <div class="col-12 text-right pad-20t-h10-80b" >
            <q-btn
                round
                class="fixed"
                color="positive"
                icon="check"
                size="lg"
                @click="salvar"
                style="right: 18px; bottom:18px"
                v-show="!paginaStatus.desabilitarEdicao">
                <q-tooltip>Salvar</q-tooltip>
            </q-btn>
        </div>
    </div>
</template>
<script>
import api from 'components/util/api'
import msg from 'components/util/msg'
import util from 'components/util/util'
import utilHttp from 'components/util/utilHttp'
import GInput from 'components/util/gInput'
import GSelect from 'components/util/gSelect'
import GDatepicker from 'components/util/gDatepicker'
import GBreadcrumb from 'components/util/gBreadcrumb'

export default {
  data () {
    return {
      chaveLocalStorage: 'lancamentoCadastrar',
      tipoLancamentoArray: [{codigo: 'RECEITA', descricao: 'RECEITA'},
        {codigo: 'DESPESA', descricao: 'DESPESA'}],
      categoriaArray: [],
      pessoaArray: [],
      paginaStatus: {
        lancamento: {
          categoria: {},
          pessoa: {}
        },
        caminhoMigalha: [
          {
            icone: '',
            descricao: '',
            rotaNome: ''
          }
        ]
      }
    }
  },
  methods: {
    salvar () {
      var self = this
      if (util.validarComponentes(this.$refs)) {
        if (self.paginaStatus.lancamento.codigo === null || self.paginaStatus.lancamento.codigo === undefined) {
          utilHttp.httpPost(api.LANCAMENTO, self.paginaStatus.lancamento, resposta => {
            if (resposta.status === 201) {
              util.exibirToastSucesso(msg.m(2))
              util.retornarCaminhoMigalhaPaginaAnterior(this)
            } else {
              util.exibirToastFalha('Erro ao salvar Categoria')
            }
          })
        } else {
          var filtro = '/'.concat(self.paginaStatus.lancamento.codigo)
          utilHttp.httpPut(api.LANCAMENTO.concat(filtro), self.paginaStatus.lancamento, resposta => {
            if (resposta.status === 200) {
              util.exibirToastSucesso(msg.m(3))
              util.retornarCaminhoMigalhaPaginaAnterior(this)
            }
          })
        }
      }
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
    }
  },
  watch: {
    paginaStatus: {
      handler (valor) {
        if (valor) {
          util.adicionarNoStorage(this.chaveLocalStorage, valor)
        } else util.removerDoStorage(this.chaveLocalStorage)
      },
      deep: true
    }
  },
  mounted () {
    if (this.$route.params.paginaStatus) {
      this.paginaStatus = this.$route.params.paginaStatus
      this.paginaStatus.caminhoMigalha.push({
        icone: this.paginaStatus.operacao.icone,
        descricao: this.paginaStatus.operacao.nome,
        rotaNome: 'lancamentoCadastrar'
      })
    } else if (util.recuperarDoStorage(this.chaveLocalStorage)) {
      this.paginaStatus = util.recuperarDoStorage(this.chaveLocalStorage)
    }

    this.carregarFiltroCategoria()
    this.carregarFiltroPessoa()
  },
  components: {GBreadcrumb, GInput, GSelect, GDatepicker}
}
</script>
