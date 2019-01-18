<template>
    <div>
        <g-breadcrumb :paginas="paginaStatus.caminhoMigalha" />
        <form @submit.prevent="salvar">
            <q-modal v-model="modalOpened" :content-css="{minWidth: '50vw'}">
                <div class="row" style="padding-left: 10px;">
                    <div class="col-sm-12 col-xs-6">
                        <g-input
                            ref="refNomeNovaCategoria"
                            tipo="text"
                            etiqueta="Nome"
                            validacao="required | minLength(3) | maxLength(50)"
                            :foco="false"
                            :desabilitar="paginaStatus.desabilitarEdicao"
                            v-model="nomeCategoriaNova">
                        </g-input>
                    </div>
                </div>
                <br/>
                <div class="row" style="padding: 0px 10px 10px 10px">
                    <div class="col-sm-6 text-left">
                        <q-btn
                            color="info"
                            @click="sairSemSalvar"
                            label="Sair">
                        </q-btn>
                    </div>
                    <div class="col-sm-6 text-right">
                        <q-btn
                            color="positive"
                            @click="salvar"
                            v-show="!paginaStatus.desabilitarEdicao"
                            label="Salvar">
                        </q-btn>
                    </div>
                </div>
            </q-modal>
        </form>
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
                            v-model="categoria.codigo">
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
                            v-model="categoria.nome">
                        </g-input>
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
                            @click="modalOpened = true">
                            &nbsp;&nbsp;Nova
                        </q-btn>
                    </div>
                </div>
            </q-card-main>
        </q-card>
        <br/>
        <g-datatable
            ref="refResultadoPesquisaCategoria"
            :getFiltroPesquisa="getFiltroPesquisa"
            :colunas=colunasCategoriaDataTable
            :api="apiCategoria"
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
    import GDatatable from 'components/util/gDatatable'
    import GBreadcrumb from 'components/util/gBreadcrumb'

    export default {
        data () {
            return {
                chaveLocalStorage: 'categoriaPesquisa',
                apiCategoria: api.CATEGORIA_LISTAR_PAGINADO,
                exibirColunaOperacoes: true,
                elementosPorPagina: 10,
                pagina: 1,
                categoria:{},
                modalOpened: false,
                nomeCategoriaNova: '',
                paginaStatus: {
                    desabilitarEdicao: false,
                    caminhoMigalha: [
                        {
                            icone: '',
                            descricao: '',
                            rotaNome: ''
                        }
                    ]
                },
                colunasCategoriaDataTable: [
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
                        largura: '40%',
                        cabecalhoClasse: 'text-center',
                        cabecalhoEtiqueta: 'Nome',
                        conteudoClasse: 'text-center',
                        propriedade: 'nome'
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
            salvar(){
                var self = this
                if(util.validarComponentes(this.$refs)){
                    debugger
                    self.categoria.nome = self.nomeCategoriaNova
                    if(self.categoria.codigo === null || self.categoria.codigo === undefined){
                        utilHttp.httpPost(api.CATEGORIA, self.categoria, resposta => {
                            if(resposta.status === 201){
                                self.modalOpened = false
                                this.limparCategoria()
                                util.exibirToastSucesso(msg.m(2))
                                this.$refs['refResultadoPesquisaCategoria'].pesquisar(1)
                            }else{
                                util.exibirToastFalha('Erro ao salvar Categoria')
                            }
                        })
                    }else{
                        var filtro = '/'.concat(self.categoria.codigo)
                        utilHttp.httpPut(api.CATEGORIA.concat(filtro), self.categoria, resposta => {
                            self.modalOpened = false
                            this.limparCategoria()
                            util.exibirToastSucesso(msg.m(3))
                            this.$refs['refResultadoPesquisaCategoria'].pesquisar(1)
                        })
                    }
                }
            },
            sairSemSalvar(){
                var self = this
                self.nomeCategoriaNova = ''
                self.modalOpened = false
            },
            visualizarItem(item){
                var self = this
                self.nomeCategoriaNova = item.nome
                self.modalOpened = true
                this.paginaStatus.desabilitarEdicao = true
            },
            editarItem(item){
                var self = this

                delete item.colunas
                self.categoria = item
                self.nomeCategoriaNova = self.categoria.nome
                
                self.modalOpened = true
                this.paginaStatus.desabilitarEdicao = false
            },
            excluirItem(item){
                util.exibirConfirmacaoExclusao('EXCLUSÃO', msg.m(5), () => {
                    var filtro = "/".concat(item.codigo)
                    utilHttp.httpDelete(api.CATEGORIA.concat(filtro), resposta => {
                        util.exibirToastSucesso(msg.m(4))
                        this.$refs['refResultadoPesquisaCategoria'].pesquisar(1)
                    })
                })
            },
            limparCategoria(){
                var self = this
                self.categoria = {}
                self.nomeCategoriaNova = ''
            },
            getFiltroPesquisa(){
                var self = this
                var filtro = ''
                if (self.categoria.codigo) filtro = filtro.concat('&codigo=').concat(self.categoria.codigo)
                if (self.categoria.nome) filtro = filtro.concat('&nome=').concat(self.categoria.nome)          
                return filtro
            },
            pesquisarPrimeiraPagina(){
                this.$refs['refResultadoPesquisaCategoria'].pesquisar(1)
            },
        },
        mounted () {
            this.paginaStatus.caminhoMigalha = [
                {
                    icone: 'category',
                    descricao: 'Pesquisa de Categoria',
                    rotaNome: 'categoriaPesquisa'
                }
            ]
            
           this.$refs['refResultadoPesquisaCategoria'].pesquisar(1)
        },
        components: {GBreadcrumb, GDatatable, GInput}
    }
</script>

