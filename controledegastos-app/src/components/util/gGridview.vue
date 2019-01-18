<template>
  <q-card>
    <q-card-main class="gutter-sm">
      <div class="row"  v-show="exibirEtiqueta">
        <div class="col-12 gvn-title-primary mrg-t-0">{{etiqueta}}</div>
      </div>
      <div class="row">
        <div class="col-12">
          <slot></slot>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-right">
          <q-btn
            small
            color="grey-4"
            v-show="indexEdicao === '' && !desabilitar && indexVisualizacao === ''"
            @click=inserirElementoInterno()
          >
            <q-tooltip>Inserir dados</q-tooltip>
            <q-icon name="fa fa-plus" color="blue-7" size="19px"/>
          </q-btn>
          <q-btn
            small
            color="grey-4"
            v-show="indexEdicao !== '' && !desabilitar && indexVisualizacao === ''"
            @click=salvarEdicaoElemento()
          >
            <q-tooltip>Inserir dados da edição</q-tooltip>
            <q-icon name="fa fa-save" color="blue-7" size="19px"/>
          </q-btn>
          <q-btn
            small
            color="grey-4"
            v-show="(indexEdicao !== '' || indexVisualizacao !== '')"
            @click=cancelarEdicao()
          >
            <q-tooltip>Cancelar</q-tooltip>
            <q-icon name="fa fa-ban" color="red-7" size="19px"/>
          </q-btn>
        </div>
      </div>
      <div class="row">
        <q-progress :indeterminate="true" v-show="progresso" />
        <table class="col-xs-12" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th
                v-for="coluna in colunas"
                v-bind:key="coluna.id "
                :width="coluna.largura"
                :class="coluna.cabecalhoClasse"
              >
                {{coluna.cabecalhoEtiqueta}}
              </th>
              <th width="110px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-show="dados.length == 0">
              <td class="text-center" colspan="50">{{msgNenhumRegistroEncontrado()}}</td>
            </tr>
            <tr
              v-for="linha in dados" v-bind:key="linha.id"
            >
              <td
                v-for="coluna in colunas"
                v-bind:key="coluna.id "
                :width="coluna.largura"
                :class="coluna.conteudoClasse"
                :style="coluna.conteudoEstilo"
              >
                {{getPropriedade(coluna, linha)}}
              </td>
              <!-- Operações -->
              <td class="text-right">

                <!-- Operações EXTRAS -->
                <q-btn
                  v-for="acao in operacoes"
                  v-bind:key="acao.tooltip"
                  v-show="acaoVisivel(linha, acao)"
                  round
                  small
                  flat
                  :color="acao.cor"
                  :disabled="!acaoPermissao(linha, acao)"
                  @click="acao.clique(linha)">
                    <q-icon :name="acao.icone" size="19px"/>
                    <q-tooltip v-show="acao.tooltip" anchor="top left"> {{ acao.tooltip }} </q-tooltip>
                </q-btn>

                <!-- Vizualizacao -->
                <q-btn
                  round
                  small
                  flat
                  v-show="exibirBotaoVisualizacao"
                  :disable="false"
                  @click=visualizarElementoInterno(linha)
                >
                  <q-icon name="fa fa-search " color="blue" size="19px"/>
                  <q-tooltip>Vizualizar elemento</q-tooltip>
                </q-btn>

                <!-- Edição -->
                <q-btn
                  round
                  small
                  flat
                  v-show="exibirBotaoEdicao"
                  :disable="!habilitarEdicao(linha) || desabilitar"
                  @click=editarElementoInterno(linha)
                >
                  <q-icon name="fa fa-edit" color="orange" size="19px"/>
                  <q-tooltip>Editar elemento</q-tooltip>
                </q-btn>

                <!-- Exclusão -->
                <q-btn
                  round
                  small
                  flat
                  v-show="exibirBotaoExclusao"
                  :disable="!habilitarExclusao(linha) || desabilitar"
                  @click="confExcluir.clique(linha)"
                >
                  <q-icon name="fa fa-trash" color="red" size="19px"/>
                  <q-tooltip>Excluir da lista</q-tooltip>
                </q-btn>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import msg from 'components/util/msg'
import util from 'components/util/util'
export default {
  props: {
    etiqueta: {
      type: String,
      default: ''
    },
    inserirElemento: {
      type: Function,
      default: () => {}
    },
    editarElemento: {
      type: Function,
      default: () => {}
    },
    getElemento: {
      type: Function,
      default: () => {}
    },
    limparCampos: {
      type: Function,
      default: () => {}
    },
    desabilitar: {
      type: Boolean,
      default: false
    },
    colunas: {
      type: Array,
      default: () => []
    },
    operacoes: {
      type: Array,
      default: () => []
    },
    executarValidacao: {
      type: Function,
      default: () => {}
    },
    habilitarEdicao: {
      type: Function,
      default: () => { return true }
    },
    habilitarExclusao: {
      type: Function,
      default: () => { return true }
    },
    exibirBotaoVisualizacao: {
      type: Boolean,
      default: true
    },
    exibirBotaoEdicao: {
      type: Boolean,
      default: true
    },
    exibirBotaoExclusao: {
      type: Boolean,
      default: true
    },
    exibirEtiqueta: {
      type: Boolean,
      default: true
    },
    inicializarVazio: {
      type: Boolean,
      default: false
    },
    confExcluir: {
      type: Object,
      default: () => ({
        clique: () => {}
      })
    }
  },
  data () {
    return {
      progresso: false,
      indexEdicao: '',
      indexVisualizacao: '',
      dados: []
    }
  },
  methods: {
    acaoVisivel (linha, acao) {
      if (typeof acao.visivel === 'function') return acao.visivel(linha)
      else return acao.visivel
    },
    acaoPermissao (linha, acao) {
      if (typeof acao.permissao === 'function') return acao.permissao(linha)
      else return acao.permissao
    },
    getPropriedade (coluna, linha) {
      let ret
      // FORMATAR ITEM
      if (typeof coluna.formatar === 'function') ret = coluna.formatar(this.getItemRecursivo(coluna.propriedade, linha))
      else ret = this.getItemRecursivo(coluna.propriedade, linha)

      return ret
    },
    getItemRecursivo (path, obj) {
      return util.getItemRecursivo(path, obj)
    },
    inicializar (dados) {
      this.dados = dados
      this.progresso = false
    },
    inserirElementoInterno () {
      if (this.executarValidacaoInterno()) {
        this.dados.push(this.inserirElemento())
        this.limparCampos()
      }
    },
    salvarEdicaoElemento () {
      if (this.executarValidacaoInterno()) {
        // Atribuindo valores do objeto vindo do componente pai
        let linha = this.dados[this.indexEdicao]
        Object.assign(linha, this.getElemento())
        this.limparCampos()
        this.indexEdicao = ''
        linha.editando = false
      }
    },
    executarValidacaoInterno () {
      let chaves = []
      let campos = []

      this.colunas.forEach(col => {
        if (col.chave) {
          // Incluindo as chaves responsáveis por manter único o elemento no grid
          chaves.push(col.chave)
        }
      })
      let linha = {}
      Object.assign(linha, this.getElemento())

      let temUmDiferente = false
      for (let indexDados = 0; indexDados < this.dados.length; indexDados++) {
        let item = this.dados[indexDados]
        campos = []

        // Verificando se a linha é única através da validação das chaves
        for (let i = 0; i < chaves.length; i++) {
          // Testando todas as colunas chave
          let chave = chaves[i]
          if (indexDados === this.indexEdicao) {
            // Comparando com o mesmo registro
            temUmDiferente = true
            continue
          }
          if (this.getItemRecursivo(chave, linha) !== this.getItemRecursivo(chave, item)) {
            temUmDiferente = true
          } else {
            let campo = this.colunas.filter(p => p.chave === chave)[0]
            campos.push(campo.cabecalhoEtiqueta)
          }
        }
        if (temUmDiferente === false) {
          util.exibirToastAviso(msg.m(8, '\'' + campos + '\''))
          return false
        }
        temUmDiferente = false
      }

      // Validação dos campos requeridos
      for (let i = 0; i < this.colunas.length; i++) {
        let coluna = this.colunas[i]

        if (coluna.requerido === true && !this.getItemRecursivo(coluna.propriedade, linha)) {
          // Campo vazio
          util.exibirToastAviso(msg.m(11, coluna.cabecalhoEtiqueta))
          return false
        }
      }

      return this.executarValidacao()
    },
    visualizarElementoInterno (linha) {
      this.indexVisualizacao = this.dados.indexOf(linha)
      this.indexEdicao = ''
      linha.editando = false
      this.editarElemento(linha)
    },
    editarElementoInterno (linha) {
      this.indexEdicao = this.dados.indexOf(linha)
      this.indexVisualizacao = ''
      linha.editando = true
      this.editarElemento(linha)
    },
    excluirElementoInterno (linha) {
      debugger
      let mensagem = msg.m(5)
      util.exibirConfirmacaoExclusao('EXCLUSÃO', mensagem, () => {
        let index = this.dados.indexOf(linha)
        this.dados.splice(index, 1)
        linha.editando = false
        this.limparCampos()
        this.indexEdicao = ''
        this.indexVisualizacao = ''
      })
    },
    removerElementoAposConfirmacaoExclusao (linha) {
      let index = this.dados.indexOf(linha)
      this.dados.splice(index, 1)
      linha.editando = false
      this.limparCampos()
      this.indexEdicao = ''
      this.indexVisualizacao = ''
    },
    cancelarEdicao () {
      if (this.indexEdicao !== '') {
        let linha = this.dados[this.indexEdicao]
        linha.editando = false
      }
      this.limparCampos()
      this.indexEdicao = ''
      this.indexVisualizacao = ''
    },
    getDados () {
      return this.dados
    },
    msgNenhumRegistroEncontrado () {
      return msg.m(6)
    },
    limparDados () {
      this.dados = []
    }
  },
  computed: {
  },
  mounted () {
    if (this.inicializarVazio === false) this.progresso = true
    // this.confExcluir.clique = this.excluirElementoInterno
  }
}
</script>

<style>
</style>
