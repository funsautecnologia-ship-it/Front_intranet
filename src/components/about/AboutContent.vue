<template>
  <v-row align="center" justify="center" class="mt-5" >
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">Sobre a Instituição</v-card-title>
        <v-card-text>
          Bem-vindo à Intranet do Hospital Regional. Aqui você encontra informações sobre a instituição, eventos e atualizações importantes. Nosso objetivo é fornecer um ambiente colaborativo e informativo para todos os colaboradores.
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row align="center" justify="center" class="mt-5" >
    <v-col cols="12" sm="8" md="6">
      <v-card class="news-panel" elevation="8" @click="navigateToEvents" style="cursor:pointer;">
        <v-card-title class="headline text-primary">
          <v-icon left color="primary" class="mr-2">mdi-newspaper-variant-outline</v-icon>
          Notícias / Eventos
        </v-card-title>
        <v-card-text>
          Clique aqui para ver a lista de notícias e eventos recentes.
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()
const navigateToEvents = () => {
      router.push({ name: 'listevent' }) // Redireciona para a página de eventos/notícias
    }



</script>