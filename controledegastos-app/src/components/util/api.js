const API = process.env.API

export default {
  CATEGORIA: API + '/categorias',
  CATEGORIA_LISTAR_PAGINADO: API + '/categorias/listarPaginado',

  PESSOA: API + '/pessoas',
  PESSOA_LISTAR_PAGINADO: API + '/pessoas/listarPaginado',

  LANCAMENTO: API + '/lancamentos',
  LANCAMENTO_LISTAR_PAGINADO: API + '/lancamentos/listarPaginado'
}
