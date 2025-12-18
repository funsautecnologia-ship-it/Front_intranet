<template>
  <v-app-bar color="#009688" dark>
    <v-app-bar-nav-icon variant="text" @click.stop="toggleDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Bem-vindo a Intranet do Hospital Regional</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleTheme" :title="isDark ? 'Tema claro' : 'Tema escuro'">
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
    </v-btn>
    <v-btn @click="logout">Sair</v-btn>
  </v-app-bar>
</template>

<script setup>
defineProps(['toggleDrawer', 'toggleTheme', 'isDark', 'logout'])
</script>