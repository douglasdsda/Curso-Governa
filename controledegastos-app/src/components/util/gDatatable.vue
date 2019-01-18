<template>
<div>
  <q-card>
    <!-- BARRA DE PROCESSAMENTO -->
    <div v-show="progresso" style="height: 1px !important">
      <q-progress :indeterminate="true" v-show="progresso" />
    </div>
    <!-- BOTÃO DE IMPRESSÃO -->
    <div class="row" v-show="apiRelatorio">
      <div class="col-sm-12 text-right" style="padding-bottom:5px">
        <q-btn
          color="secondary"
          flat
          round
          @click="imprimirRelatorio"
          v-show="apiRelatorio">
          <q-icon name="fa fa-print" />
          <q-tooltip>Imprimir relatório</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div :class="divClassRow" :style="scrollHorizontalEstilo">
      <table style="width: 100%" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th v-for="coluna in colunas"
              v-bind:key="coluna.id "
              v-if="(typeof coluna.cabecalhoClique === 'undefined')"
              v-show="(((typeof coluna.cabecalhoClique === 'undefined') && ((coluna.conteudoTipo !== 'operacao') || coluna.conteudoTipo === 'operacao' && exibirColunaOperacoes))  && (typeof coluna.esconderColuna === 'undefined' || ( typeof coluna.esconderColuna !== 'undefined' && coluna.esconderColuna === false)))"
              :width="coluna.largura"
              :class="coluna.cabecalhoClasse">

              {{coluna.cabecalhoEtiqueta}}
              <q-tooltip v-show="coluna.cabecalhoTooltip">{{coluna.cabecalhoTooltip}}</q-tooltip>

            </th>
            <th v-else
              v-show="((typeof coluna.cabecalhoClique !== 'undefined') || (coluna.cabecalhoClique === '.'))"
              :width="coluna.largura"
            >
              <q-btn
                push
                small
                flat
                left
                class="btn"
                :disabled="!coluna.cabecalhoPermissao"
                @click="coluna.cabecalhoClique(coluna, dados)"
              >
                <span :style="coluna.cabecalhoEstilo"> {{coluna.cabecalhoEtiqueta}} </span>

                <q-tooltip :delay="coluna.cabecalhoBotaoTooltipDelay">{{coluna.cabecalhoBotaoTooltip}}</q-tooltip>
              </q-btn>

              <div style="display:block; text-align:center; margin:0 auto; font-size: 12px; color: navy;">
                <span>
                  <small>{{coluna.diaSemana}} </small>
                </span>
              </div>

              <div style="display:block; text-align:center; margin:0 auto; font-size: 12px;">
                <q-btn v-if="coluna.subCabecalho"
                  push
                  small
                  flat
                  left
                  class="btn"
                  :disabled="!coluna.subCabecalhoPermissao"
                  @click="coluna.subCabecalhoClique(coluna, dados)"
                >
                  <span :style="coluna.subCabecalhoEstilo"> {{coluna.subCabecalhoEtiqueta}} </span>

                  <q-tooltip :delay="coluna.subCabecalhoBotaoTooltipDelay">{{coluna.subCabecalhoBotaoTooltip}}</q-tooltip>
                </q-btn>
              </div>

            </th>
          </tr>
        </thead>
        <tfoot v-if="elementosPorPagina !== null">
          <tr>
            <td :colspan="this.colunas.length">
              <div class="float-right">
                <q-pagination
                  v-model="paginaAtual"
                  :ellipses="true"
                  :min="1"
                  :max="paginaTotal"
                  :max-pages="6"
                  direction-links
                  boundary-links
                />
              </div>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr v-show="dados.length == 0">
            <td class="text-center" colspan="50">{{msgNenhumRegistroEncontrado()}}</td>
          </tr>
          <tr v-for="(linha, linhaIdx) in dados" v-bind:key="linha.a">
            <!-- Coluna fixa  -->
            <td
              v-if="linha.colunas[0].primeiraColunaFixa === true"
              style="padding-left: 0px;"
            >
                <!-- Maior valor da coluna fixa, para definir o width da coluna. Valor invisível -->
                <span v-html="maiorTextoPrimeiraColuna(dados)" style="visibility: hidden"></span>
                <div class="coluna-fixa" style="background-color: #D0D0D0;">
                  <!-- Maior valor da coluna fixa, para definir a cor do background. Valor invisível -->
                  <span v-html="maiorTextoPrimeiraColuna(dados)" style="visibility: hidden" ></span>
                </div>
                <div class="coluna-fixa">
                  <!-- Valor visível -->
                  <span v-show="linha.colunas[0].conteudoTextoHtml" :class="linha.colunas[0].celulaClasse" :style="linha.colunas[0].celulaEstilo" v-html="linha.colunas[0].conteudoTextoHtml"></span>
                  <span v-show="linha.colunas[0].propriedade">{{getPropriedade(linha.colunas[0], linha)}}</span>
                </div>
            </td>
            <!-- Demais colunas  -->
            <td
              v-for="coluna in colunasSemprimeiraColunaFixa(linha.colunas)"
              v-show="(((coluna.conteudoTipo !== 'operacao') || coluna.conteudoTipo === 'operacao' && exibirColunaOperacoes) && (typeof coluna.esconderColuna === 'undefined' || ( typeof coluna.esconderColuna !== 'undefined' && coluna.esconderColuna === false)))"
              v-bind:key="coluna.id"
              :width="coluna.largura"
              :class="coluna.conteudoClasse"
              :style="coluna.conteudoEstilo">

              <div v-if="coluna.conteudoTipo !== 'operacao' && !coluna.primeiraColunaFixa">
                <!-- CHECKBOX -->
                <q-checkbox
                  v-if="coluna.conteudoTipo === 'checkBox'"
                  v-model="checkArray[coluna.cabecalhoEtiqueta]"
                  :val="linhaIdx"
                  :disable="linhaDesabilitada(linha)"
                />

                <!-- ÍCONE -->
                <q-icon
                  center
                  v-else-if="coluna.conteudoTipo === 'icone'"
                  :class="coluna.celulaClasse"
                  :style="coluna.celulaEstilo"
                  :name="coluna.conteudoIcone"
                  :size="coluna.conteudoIconeTamanho"
                  :color="coluna.conteudoCor"
                  :disabled="!coluna.permissao || linhaDesabilitada(linha)"
                  @click="conteudoClique(coluna, linha)">
                </q-icon>

                <!-- BOTÃO -->
                <q-btn
                  v-else-if="coluna.conteudoTipo === 'botao'"
                  round
                  small
                  flat
                  :color="coluna.conteudoCor"
                  :disable="!coluna.permissao || linhaDesabilitada(linha)"
                  @click="coluna.conteudoClique(linha, coluna)">
                    <q-icon :name="coluna.conteudoIcone" :class="coluna.celulaClasse"/>
                    <q-tooltip v-show="coluna.conteudoTooltip" self="bottom left"> {{ coluna.conteudoTooltip }} </q-tooltip>
                </q-btn>

                <!-- INPUT TIPO TEXTO -->
                <g-input
                  v-else-if="coluna.conteudoTipo === 'campoTexto'"
                  v-model="coluna[coluna.propriedade]"
                  tipo="text"
                  :cor="coluna.conteudoCor"
                  :desabilitar="linhaDesabilitada(linha)"
                />

                <!-- SELECT -->
                <g-select
                  v-else-if="coluna.conteudoTipo === 'select'"
                  :icone="coluna.conteudoIcone"
                  :etiqueta="coluna.conteudoEtiqueta"
                  v-model="coluna.opcaoSelecionada"
                  :itens="selectItens"
                  :item-valor="coluna.conteudoItemValor"
                  :item-etiqueta="coluna.conteudoItemEtiqueta"
                  :desabilitar="!coluna.permissao"
                />

                <!-- TEXTAREA -->
                <q-input style="border:1px solid grey; box-shadow: 1px 1px grey;"
                  v-else-if="coluna.conteudoTipo === 'areaTexto'"
                  v-model="coluna[coluna.propriedade]"
                  type="textarea"
                  :min-height="50"
                  rows="10"
                  hide-underline
                  :disable="linhaDesabilitada(linha)"
                />

                <!-- TEXTO -->
                <slot v-else-if="coluna.conteudoTipo === 'texto'"
                  :name="coluna.propriedade" :row="linha">
                  <span :class="coluna.celulaClasse" :style="coluna.celulaEstilo">{{coluna.conteudoTexto}}</span>
                  <span v-show="coluna.conteudoTextoHtml" :class="coluna.celulaClasse" :style="coluna.celulaEstilo" v-html="coluna.conteudoTextoHtml"></span>
                </slot>

                <slot v-else :name="coluna.propriedade" :row="linha">
                  {{getPropriedade(coluna, linha)}}
                </slot>
              </div>

              <!-- Operações -->
              <q-btn
                v-for="acao in operacoes"
                v-else-if="!coluna.primeiraColunaFixa"
                v-bind:key="acao.tooltip"
                v-show="acaoVisivel(linha, acao)"
                round
                small
                flat
                :color="acao.cor"
                :disabled="!acaoPermissao(linha, acao) || linhaDesabilitada(linha)"
                @click="acao.clique(linha)">
                  <q-icon :name="acao.icone" size="19px"/>
                  <q-tooltip v-show="acao.tooltip" anchor="top left"> {{ acao.tooltip }} </q-tooltip>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </q-card>
  </div>
</template>
<script>
import util from 'components/util/util'
import msg from 'components/util/msg'
import utilHttp from 'components/util/utilHttp'

export default {
  data () {
    return {
      paginaAtual: 1,
      paginaTotal: 1,
      elementosTotal: 0,
      progresso: false,
      dados: [],
      tabelaElementosObservaveis: [], // Células que implicam em alterações visuais na interação
      divClassRow: 'row',
      scrollHorizontalEstilo: '',
      campoTexto: '',
      checkArray: []
    }
  },
  props: {
    colunas: {
      type: Array,
      default: () => []
    },
    operacoes: {
      type: Array,
      default: () => []
    },
    api: {
      type: String,
      default: () => ''
    },
    apiRelatorio: {
      type: String,
      default: ''
    },
    carregamentoInicial: {
      type: Boolean,
      default: true
    },
    getFiltroPesquisa: {
      type: Function
    },
    elementosPorPagina: {
      type: Number,
      default: null
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
    confAnterior: {
      type: Object,
      default: () => ({
        clique: () => alert('Sem ação'),
        permissao: () => false,
        visivel: () => false
      })
    },
    confProximo: {
      type: Object,
      default: () => ({
        clique: () => alert('Sem ação'),
        permissao: () => false,
        visivel: () => false
      })
    },
    scrollHorizontal: {
      type: Boolean,
      default: () => false
    },
    acaoPreConstrucaoTabela: {
      type: Function,
      default: () => {}
    },
    acaoPosPesquisa: {
      type: Function,
      default: () => {}
    },
    selectItens: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    paginaAtual: {
      handler (valor) {
        this.pesquisar(valor)
      },
      deep: true
    }
  },
  methods: {
    limpar () {
      // LIMPANDO A TABELA
      this.dados = []
    },
    pesquisar (pagina) {
      const self = this
      if (pagina < 1 || pagina > self.paginaTotal) return
      self.progresso = true // START DA BARRA DE PROGRESSO (LOAD)
      self.paginaAtual = pagina

      let url = self.api

      // SE NAO PASSAR O PARAMETRO, TRAZ TODOS SEM PAGINACAO
      if (self.getFiltroPesquisa() !== undefined) {
        if (self.elementosPorPagina) {
          url += '?elementosPorPagina={0}&pagina={1}'
          url = url.replace('{0}', self.elementosPorPagina)
          url = url.replace('{1}', pagina)

          if (self.getFiltroPesquisa) url += self.getFiltroPesquisa()
        } else {
          let filtros = ''
          if (self.getFiltroPesquisa) filtros += self.getFiltroPesquisa()

          if (filtros) url += '?' + filtros.substr(1)
        }

        utilHttp.httpGet(url, (resposta) => {
          self.dados = resposta.body.content || []
          this.construirTabela()
          self.paginaTotal = resposta.body.totalPages || 1
          self.elementosTotal = resposta.body.totalElements || 0
          self.progresso = false // PARA A BARRA DE PROGRESSO (LOAD)
        })
      }
    },
    inicializar (dados) {
      // Passando a massa de dados inicial para o componente, sem a necessidade de realizar uma requiisição HTTP
      this.dados = dados
      this.construirTabela()
    },
    construirTabela () {
      var self = this
      // EXECUTA UMA DETERMINADA AÇÃO ANTES DE CONSTRUIR A TABELA
      this.acaoPreConstrucaoTabela(self.dados)
      let linhaNro = 0
      // MONTANDO A ESTRUTURA DE COLUNAS (SIMPLES E ADICIONAIS/OBSERVÁVEIS) À LINHA
      self.dados.forEach(linha => {
        self.tabelaElementosObservaveis.push([])
        self.colunas.forEach(coluna => {
          if (!linha.colunas) linha.colunas = []
          let prop = self.getItemRecursivo(coluna.propriedade, linha)
          if (!prop || coluna.conteudoTipo === 'areaTexto') {
            // NÃO É PROPRIEDADE COMUM DO OBJETO
            if (!self.tabelaElementosObservaveis[linhaNro]) self.tabelaElementosObservaveis[linhaNro].push([])
            // ADICIONANDO À COLUNA A PROPRIEDADE DEFINIDA EM 'PROPRIEDADE' (ÚTIL SOBRETUDO QUANDO A TABELA POSSUI O TIPO 'CAMPOTEXTO')
            coluna[coluna.propriedade] = linha[coluna.propriedade]
            // ATUALIZANDO A INFORMAÇÃO NA COLUNA
            if (typeof coluna.atualizarColuna !== 'undefined') coluna.atualizarColuna(linha, coluna)
            self.tabelaElementosObservaveis[linhaNro].push(Object.assign({}, coluna))
            // ADICIONANDO COLUNA OBSERVÁVEL
            linha.colunas.push(self.tabelaElementosObservaveis[linhaNro][self.tabelaElementosObservaveis[linhaNro].length - 1])
          } else linha.colunas.push(Object.assign({}, coluna))
        })
        linhaNro++
      })
      self.acaoPosPesquisa(self.dados)
    },
    imprimirRelatorio () {
      let url = this.apiRelatorio
      let filtros = ''
      if (this.getFiltroPesquisa) filtros += this.getFiltroPesquisa()
      if (filtros) url += '?' + filtros.substr(1)

      utilHttp.httpGetRelatorioNovaAba(url)
    },
    anterior () {
      this.pesquisar(this.paginaAtual - 1)
    },
    proxima () {
      this.pesquisar(this.paginaAtual + 1)
    },
    primeira () {
      this.pesquisar(1)
    },
    ultima () {
      this.pesquisar(this.paginaTotal)
    },
    getItemRecursivo (obj, path) {
      return util.getItemRecursivo(obj, path)
    },
    excluirLinha (linha) {
      let mensagem = msg.m(5)
      if (linha.mensagemExcluirPersonalizada) mensagem = linha.mensagemExcluirPersonalizada
      var self = this
      util.exibirConfirmacaoExclusao('EXCLUSÃO', mensagem, () => {
        let url = self.api
        utilHttp.httpDelete(url, linha, () => {
          this.progresso = false
          util.exibirToastSucesso(msg.m(4))
          this.pesquisar()
        })
      })
    },
    getPropriedade (coluna, linha) {
      let ret
      // FORMATAR ITEM
      if (typeof coluna.formatar === 'function') ret = coluna.formatar(this.getItemRecursivo(coluna.propriedade, linha))
      else ret = this.getItemRecursivo(coluna.propriedade, linha)

      return ret
    },
    conteudoClique (coluna, dados) {
      if (typeof coluna.conteudoClique !== 'undefined') coluna.conteudoClique(coluna, dados)
    },
    acaoVisivel (linha, acao) {
      if (typeof acao.visivel === 'function') return acao.visivel(linha)
      else return acao.visivel
    },
    acaoPermissao (linha, acao) {
      if (typeof acao.permissao === 'function') return acao.permissao(linha)
      else return acao.permissao
    },
    msgNenhumRegistroEncontrado () {
      return msg.m(6)
    },
    linhaDesabilitada (linha) {
      return (linha && linha.desabilitar) ? linha.desabilitar : false
    },
    // Retorna as colunas excetuando a coluna fixa (primeira coluna), caso configurado (primeiraColunaFixa=true)
    colunasSemprimeiraColunaFixa (colunas) {
      if (colunas[0].primeiraColunaFixa && colunas[0].primeiraColunaFixa === true) {
        // A primeira coluna é fixa, portanto desconsiderá-la do array de colunas
        return colunas.slice(1, colunas.length)
      }
      return colunas
    },
    // Retorna o maior texto da primeira coluna
    maiorTextoPrimeiraColuna (dados) {
      var maiorTexto = ''

      dados.forEach(linha => {
        let colunaTexto = ''
        let primeiraColuna = linha.colunas[0]

        let propriedade = this.getPropriedade(primeiraColuna, linha)
        if (propriedade) {
          // Propriedade.
          colunaTexto = propriedade
        } else if (primeiraColuna.conteudoTexto) {
          // Conteúdo texto.
          colunaTexto = primeiraColuna.conteudoTexto
        } else if (primeiraColuna.conteudoTextoHtml) {
          // Conteúdo texto HTML
          colunaTexto = primeiraColuna.conteudoTextoHtml
        }
        if (colunaTexto.toString().length > maiorTexto.toString().length) {
          // Concatena com 'A' para corrigir a diferença do tamanho de exibição de uma string
          maiorTexto = colunaTexto + 'A'
        }
      })
      return maiorTexto
    },
    getDados () {
      return this.dados
    }
  },
  computed: {
    rangeRegistros () {
      if (!this.elementosTotal) return '0 - 0'

      let inicio = (this.paginaAtual - 1) * this.elementosPorPagina + 1
      let fim = this.paginaAtual * this.elementosPorPagina

      if (fim > this.elementosTotal) fim = this.elementosTotal

      return inicio + ' - ' + fim
    }
  },
  mounted () {
    if (this.carregamentoInicial) this.pesquisar(1)

    // DEFINIÇÃO DA CONFIRGURAÇÃO DA DIV DA TABLE (COM SCROLL OU SEM SCROLL)
    if (this.scrollHorizontal) {
      this.divClassRow = ''
      this.scrollHorizontalEstilo = 'width: auto; height: auto; overflow: auto; white-space: nowrap;'
    }

    this.colunas.push(
      {
        cabecalhoClasse: 'text-right',
        cabecalhoEtiqueta: 'Operação',
        conteudoClasse: 'text-right',
        conteudoTipo: 'operacao'
      }
    )
    // CONFIGURAÇÕES DE BOTÕES PADRÕES
    this.operacoes.push({
      cor: 'blue',
      icone: 'fa fa-search',
      etiqueta: 'Visualizar',
      clique: this.confVisualizar.clique,
      permissao: this.confVisualizar.permissao,
      visivel: this.confVisualizar.visivel
    })

    this.operacoes.push({
      cor: 'orange',
      icone: 'fa fa-edit',
      etiqueta: 'Editar',
      clique: this.confEditar.clique,
      permissao: this.confEditar.permissao,
      visivel: this.confEditar.visivel
    })

    this.operacoes.push({
      cor: 'red',
      icone: 'fa fa-trash',
      etiqueta: 'Excluir',
      clique: this.confExcluir.clique,
      permissao: this.confExcluir.permissao,
      visivel: this.confExcluir.visivel
    })
  }
}
</script>
<style scoped>
.coluna-fixa {
  position: absolute;
  margin-top: -20px;
  padding-top: 4px;
  padding-bottom: 2px;
}
</style>
