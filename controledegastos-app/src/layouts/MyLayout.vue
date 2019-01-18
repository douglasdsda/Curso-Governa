<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Sistema de Controle de Gastos
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
         <q-list-header>Menu</q-list-header>
        <q-item to="/privado/categoria/pesquisa">
          <q-item-side icon="category" />
          <q-item-main label="Categoria"/>
        </q-item>
        <q-item to="/privado/pessoa/pesquisa">
          <q-item-side icon="person" />
          <q-item-main label="Pessoa"/>
        </q-item>
        <q-item to="/privado/lancamento/pesquisa">
          <q-item-side icon="new releases"/>
          <q-item-main label="Lançamento"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
