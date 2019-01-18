<template>
    <div>
        <g-breadcrumb :paginas="paginaStatus.caminhoMigalha"/>
        <form @submit.prevent="salvar">
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
                                :desabilitar="true"
                                v-model="paginaStatus.pessoa.codigo">
                            </g-input>
                        </div>
                        <div class="col-sm-4 col-xs-6">
                            <g-input
                                ref="refNome"
                                tipo="text"
                                etiqueta="Nome"
                                validacao="text | required"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.nome">
                            </g-input>
                        </div>
                        <div class="col-sm-4 col-xs-6">
                            <g-select
                                ref="refAtivo"
                                etiqueta="Ativo"
                                validacao="required"
                                :foco="false"
                                :itens="ativoArray"
                                item-valor="codigo"
                                item-etiqueta="descricao"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.ativo">
                            </g-select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4 col-xs-4">
                            <g-input
                                ref="refCep"
                                tipo="text"
                                etiqueta="Cep"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.cep">
                            </g-input>
                        </div>
                        <div class="col-sm-4 col-xs-4">
                            <g-input
                                ref="refEstado"
                                tipo="text"
                                etiqueta="Estado"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.estado">
                            </g-input>
                        </div>
                        <div class="col-sm-4 col-xs-4">
                            <g-input
                                ref="refCidade"
                                tipo="text"
                                etiqueta="Cidade"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.cidade">
                            </g-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4 col-xs-6">
                            <g-input
                                ref="refBairro"
                                tipo="text"
                                etiqueta="Bairro"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.bairro">
                            </g-input>
                        </div>
                        <div class="col-sm-4 col-xs-6">
                            <g-input
                                ref="refLogradouro"
                                tipo="text"
                                etiqueta="Logradouro"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.logradouro">
                            </g-input>
                        </div>
                        <div class="col-sm-4 col-xs-6">
                            <g-input
                                ref="refComplemento"
                                tipo="text"
                                etiqueta="Complemento"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.complemento">
                            </g-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4 col-xs-6">
                            <g-input
                                ref="refNumero"
                                tipo="text"
                                etiqueta="Numero"
                                validacao="text"
                                :foco="false"
                                :desabilitar="paginaStatus.desabilitarEdicao"
                                v-model="paginaStatus.pessoa.endereco.numero">
                            </g-input>
                        </div>
                    </div>
                </q-card-main>
            </q-card>
        </form>
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
import GBreadcrumb from 'components/util/gBreadcrumb'

export default {
  data () {
    return {
      chaveLocalStorage: 'pessoaCadastrar',
      ativoArray: [{codigo: 'false', descricao: 'Inativo'}, {codigo: 'true', descricao: 'Ativo'}],
      paginaStatus: {
        desabilitarEdicao: false,
        pessoa: {
          endereco: {}
        },
        operacao: {
          descricao: '',
          icone: ''
        }
      }
    }
  },
  methods: {
    salvar () {
      var self = this
      if (util.validarComponentes(this.$refs)) {
        if (self.paginaStatus.pessoa.codigo === null || self.paginaStatus.pessoa.codigo === undefined) {
          utilHttp.httpPost(api.PESSOA, self.paginaStatus.pessoa, resposta => {
            util.exibirToastSucesso(msg.m(2))
            util.retornarCaminhoMigalhaPaginaAnterior(this)
          })
        } else {
          var filtro = '/'.concat(self.paginaStatus.pessoa.codigo)
          utilHttp.httpPut(api.PESSOA.concat(filtro), self.paginaStatus.pessoa, resposta => {
            util.exibirToastSucesso(msg.m(3))
            util.retornarCaminhoMigalhaPaginaAnterior(this)
          })
        }
      }
    },
    buscarEnderecoWebServiceCep () {
      var self = this
      var filtro = ''
        .concat('https://viacep.com.br/ws/')
        .concat(self.paginaStatus.pessoa.endereco.cep).concat('/json/')

      utilHttp.httpGet(filtro, resposta => {
        if (!resposta.body.erro) {
          self.paginaStatus.pessoa.endereco.cep = resposta.body.cep
          self.paginaStatus.pessoa.endereco.estado = resposta.body.uf
          self.paginaStatus.pessoa.endereco.cidade = resposta.body.localidade
          self.paginaStatus.pessoa.endereco.bairro = resposta.body.bairro
          self.paginaStatus.pessoa.endereco.logradouro = resposta.body.logradouro
          self.paginaStatus.pessoa.endereco.complemento = resposta.body.complemento
        }
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
        rotaNome: 'pessoaCadastrar'
      })
    } else if (util.recuperarDoStorage(this.chaveLocalStorage)) {
      this.paginaStatus = util.recuperarDoStorage(this.chaveLocalStorage)
    }
    if (this.paginaStatus.pessoa.ativo !== undefined) {
      this.paginaStatus.pessoa.ativo = this.paginaStatus.pessoa.ativo.toString()
    }
  },
  components: {GBreadcrumb, GInput, GSelect}
}
</script>
