<template>
  <q-field>
    <q-card class="q-uploader-q-card" v-show="arquivoArmazenado">
      <q-list highlight>
        <q-list-header>{{etiqueta}}</q-list-header>
        <q-item v-for="arquivo in buscarArquivoArmazenado()" v-bind:key="arquivo.nomeArmazenado">
              <q-btn round small flat color="info" >
                <q-icon @click="downloadArquivo(arquivo)" name="fa-download" size="19px" />
                <q-tooltip> Baixar arquivo </q-tooltip>
              </q-btn>
              <q-btn round small flat color="negative" :disabled="desabilitar">
                <q-icon @click="excluirArquivoArmazenado(arquivo)" name="fa-trash" size="19px" :disable="desabilitar"/>
                <q-tooltip> Excluir arquivo </q-tooltip>
              </q-btn>
                {{nomeArquivo(arquivo.nomeArmazenado)}}
        </q-item>
      </q-list>
    </q-card>

    <q-uploader v-show="!arquivoArmazenado || multiplo"
      ref="refUploader"
      :float-label="etiqueta"
      :url="url"
      :multiple="multiplo"
      :hide-upload-button="true"
      :disable="desabilitar"
      @add="tratarAdicaoArquivoTemporario"
      @uploaded="tratarUploadFinalizado"
      @remove:done="tratarExclusaoArquivoTemporario"
      style="padding-top: 5px"
    />
  </q-field>
</template>

<script>
import utilHttp from 'components/util/utilHttp'
import util from 'components/util/util'

export default {
  data () {
    return {
      arquivoTemporarioArray: [],
      url: process.env.API + '/uploadArquivos', // url fixa, deve ser implementada pelo backend
      arquivoInterno: {}
    }
  },
  props: {
    etiqueta: {
      type: String,
      default: ''
    },
    multiplo: {
      type: Boolean,
      default: false
    },
    buscarArquivoArmazenado: {
      type: Function,
      default: () => []
    },
    excluirArquivoArmazenado: {
      type: Function,
      default: (arquivo) => {}
    },
    adicionarArquivoTemporario: {
      type: Function,
      default: (arquivo) => {}
    },
    excluirArquivoTemporario: {
      type: Function,
      default: (arquivo) => {}
    },
    desabilitar: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    tratarAdicaoArquivoTemporario (arquivos) {
      if (this.multiplo === false && this.arquivoTemporarioArray.length > 0) {
        // Limitado a upload de um arquivo
        util.exibirToastAviso('Permitido enviar apenas um arquivo.')
        return
      }
      var self = this
      setTimeout(function () {
        // Realizar upload do arquivo assim que adicionar o arquivo no componente
        self.$refs['refUploader'].upload()
      }, 700)
    },
    tratarUploadFinalizado (file, xhr) {
      // Chama quando o envio do arquivo para o servidor (upload) é finalizado
      this.arquivoInterno = file
      let arquivo = JSON.parse(xhr.response)
      this.adicionarArquivoTemporario(arquivo)
      // Adicionando arquivo no array
      this.arquivoTemporarioArray.push(arquivo)
    },
    tratarExclusaoArquivoTemporario (arquivo) {
      let arquivoARemover = this.arquivoTemporarioArray.filter(p => p.nome === arquivo.name)[0]
      // Removendo o arquivo teporário do servidor
      utilHttp.httpDelete(this.url + '/' + btoa(arquivoARemover.nomeArmazenado), (resposta) => {
      })
      // Removendo o arquivo do array de arquivos Armazenados
      this.arquivoTemporarioArray = this.arquivoTemporarioArray.filter(p => p.nome !== arquivo.name)
      // Excluir arquivo armazenado (quando for o mesmo do arquivo temporário)
      this.excluirArquivoTemporario(arquivoARemover)
    },
    nomeArquivo (nomeArmazenado) {
      if (nomeArmazenado && nomeArmazenado.indexOf('_') > 0) {
        return nomeArmazenado.substring(nomeArmazenado.indexOf('_') + 1)
      }
      return nomeArmazenado
    },
    downloadArquivo (arquivo) {
      window.open(this.url + '/' + btoa(arquivo.nomeArmazenado), '_blank')
    }
  },
  computed: {
    arquivoArmazenado () {
      return (this.buscarArquivoArmazenado().length > 0 && (!this.arquivoTemporarioArray || this.arquivoTemporarioArray.length === 0))
    }
  }
}
</script>

<style>
.q-uploader .row {
  background-color: #b2dfdb !important;
  color: #3f3f3f;
  font-weight: bold;
}
.q-uploader i {
  color: #3f3f3f !important;
  font-weight: bold;
}
.q-uploader-q-card {
  margin: 0px;
}
</style>
