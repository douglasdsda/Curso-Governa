export default {
  mensagens () {
    return [
      {
        id: 1,
        texto: 'Campo Obrigatório'
      },
      {
        id: 2,
        texto: 'Registro incluído com sucesso.'
      },
      {
        id: 3,
        texto: 'Registro alterado com sucesso.'
      },
      {
        id: 4,
        texto: 'Registro excluído com sucesso.'
      },
      {
        id: 5,
        texto: 'Deseja mesmo excluir este registro?'
      },
      {
        id: 6,
        texto: 'Nenhum registro encontrado.'
      },
      {
        id: 7,
        texto: 'Mostrando {0} até {1} de {2} registros.'
      },
      {
        id: 8,
        texto: 'O sistema já possui um registro com o {0} informado.'
      },
      {
        id: 9,
        texto: 'A consulta está restrita a cem (100) registros. Se o registro procurado não retornou, adicione mais parâmetros à consulta.'
      },
      {
        id: 10,
        texto: 'Este registro não pode ser excluído.'
      },
      {
        id: 11,
        texto: 'O campo {0} é obrigatório.'
      }
    ]
  },
  // Método que recupera a mensagem passando o código da mensagem e os parâmetros
  m (id, ...param) {
    // Recuperando a mensagem por código
    let msg = this.mensagens().filter(m => m.id === id)[0].texto
    if (msg && param) {
      for (var i = 0; i < param.length; i++) {
        // Substituindo os parâmetros
        msg = msg.replace('{' + i + '}', param[i])
      }
    }
    return msg
  }
}
