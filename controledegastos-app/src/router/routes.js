
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/privado',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'categoriaPesquisa',
        path: 'categoria/pesquisa',
        component: () => import('pages/privado/categoria/CategoriaPesquisa2.vue')
      },
      {
        name: 'pessoaPesquisa',
        path: 'pessoa/pesquisa',
        component: () => import('pages/privado/pessoa/PessoaPesquisa.vue')
      },
      {
        name: 'pessoaCadastrar',
        path: 'pessoa/cadastrar',
        component: () => import('pages/privado/pessoa/PessoaCadastrar.vue')
      },
      {
        name: 'lancamentoPesquisa',
        path: 'lancamento/pesquisa',
        component: () => import('pages/privado/lancamento/LancamentoPesquisa.vue')
      },
      {
        name: 'lancamentoCadastrar',
        path: 'lancamento/cadastrar',
        component: () => import('pages/privado/lancamento/LancamentoCadastrar.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
