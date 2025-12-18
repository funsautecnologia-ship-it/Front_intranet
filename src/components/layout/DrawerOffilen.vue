<template>
    <v-main>
        <v-app-bar color="#009688" dark>
        <!-- <v-app-bar> -->
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
            </v-app-bar-nav-icon>
            <v-app-bar-title> Bem vindo a intranet Hospital Regional de Nova Andradina</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn>
                <v-avatar>
                    <v-img src="../../../public/logoH.png" alt="Logo" />
                </v-avatar>
            </v-btn>
            
        </v-app-bar>
      


            <v-navigation-drawer
                v-model="drawer"
                app
                temporary
                :location="$vuetify?.display?.mobile ? 'bottom' : undefined"
                >
                <v-list>
                <v-list-item>
                    <v-list-item-title>Modo Offline</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="item in offlineItems" :key="item.title" router @click="navigate(item)">
                    
                    <v-icon>{{ item.icon }}</v-icon>
                   
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
                </v-list>
            </v-navigation-drawer>
        
        
             <v-container>
                <router-view  />
                <AppFooter />
                
            </v-container>

       
       
    
    </v-main>
    

  
  
</template>

<script setup>
import { ref} from 'vue';
import { useRouter } from 'vue-router';
import AppFooter from './AppFooter.vue';
const router = useRouter();

const drawer = ref(false);

const offlineItems = [
  { title: 'Login', icon: 'mdi-login', value: 'login' ,link: 'login' },
  { title: 'Agendar', value: 'Agendar', link: 'Agendar', icon: 'mdi-calendar-plus' },
  { title: 'Consultar Agenda', value: 'ConsultarAgenda', link: 'ConsultarAgenda', icon: 'mdi-calendar-month' },
  { title: 'Chamados', value: 'CadastrarChamado', link: 'CadastrarChamado', icon: 'mdi-ticket' }
]

function navigate(item) {
    router.push(item.link);
    
}
</script>
