import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import userRegister from '../components/userRegister.vue'
import uploadFile from '../components/Upload.vue'
import fileList from '../components/FileList.vue'
import about from '../views/About.vue'
import video from '../components/Videos.vue'
import user from '../components/user/Register.vue'
import eventos from '../components/eventos/Eventos.vue'
import listevent from '../components/eventos/EventList.vue'
import SupportTicket from '../components/SupportTicket.vue';
import store from '../store/index.js' // Importa o store Vuex
import chamados from '../components/chmados/getTicket.vue'; // Importa o componente de chamados
import showTiket from '../components/chmados/viewTicket.vue'; // Importa o componente de chamados
import aboutContent from '../components/about/AboutContent.vue'
import CreateEquip from '../components/Agendamento/Equipamentos/CreateEquip.vue'
import CreateInfra from '../components/Agendamento/Infraestrutura/CreateInfra.vue'
import CreateAgendamento from '../components/Agendamento/CreateAgendamento.vue'
import showAgendamento from '../components/Agendamento/Show.vue'
import DrawerOffilen from '../components/layout/DrawerOffilen.vue'
import ConsultarAgenda from '../components/Agendamento/ConsultarAgenda.vue'



const routes = [
  { path: '/offline', component: DrawerOffilen, name: 'offline',
    children: [

        { path: '/login',
          name: 'login',
          component: Login },
        { path: '/Agendar', component: CreateAgendamento, name: 'Agendar' },
        { path: '/ConsultarAgenda', component: ConsultarAgenda, name: 'ConsultarAgenda' },
        { path: '/CadastrarChamado', component:SupportTicket, name: 'CadastrarChamado'},
    ]
  },

  { path: '/register', component: userRegister },
  

  


  {
  path: '/reset-password/:token',
  name: 'reset-password',
  component: () => import('../views/ResetPassword.vue'),
},
  
  {
    path: '/about',
    component: about,
    name: 'about',
    children: [
      { path: 'home', component: Home, name: 'home' }, // Home será /about
      { path: 'upload', component: uploadFile, name: 'upload', meta: { requiresAuth: true, adminOnly: true } },
      { path: 'files', component: fileList, name: 'files', meta: { requiresAuth: true } },
      { path: 'videos', component: video, name: 'videos', meta: { requiresAuth: true } },
      { path: 'users', component: user, name: 'users', meta: { requiresAuth: true, adminOnly: true } },
      { path: 'eventos', component: eventos, name: 'events' },
      { path: 'listevent', component: listevent, name: 'listevent', meta: { requiresAuth: true } },
      { path: 'showEvento/:id', component: () => import('../components/eventos/Evento.vue'), name: 'showEvento', props: true },
      { path: 'support-ticket', component: SupportTicket, name: 'support-ticket' },
      { path: 'chamados', component: chamados, name: 'chamados', meta: { requiresAuth: true } },
      { path: 'abertos', component: chamados, name: 'abertos', meta: { requiresAuth: true } },
      { path: 'showTicket/:id', component: showTiket, name: 'showTicket', props: true },
      { path: 'chamados/:id', component: showTiket, name: 'view-ticket', meta: { requiresAuth: true }, props: true },
      { path: 'ticket', component: () => import('../components/chmados/buscarChamados.vue'), name: 'ticket', meta: { requiresAuth: true } },
      { path: 'setor', component: () => import('../components/setor/CreateSetor.vue'), name: 'setor' , meta: { requiresAuth: true, adminOnly: true } },
      { path: 'servico', component: () => import('../components/servicoTipo/CreateServicoTipo.vue'), name: 'servico', meta: { requiresAuth: true, adminOnly: true } },
      { path: 'aboutContent', component: aboutContent, name: 'aboutContent', meta: { requiresAuth: true } },
      { path: 'user-list', component: () => import('../components/user/UsersList.vue'), name: 'user-list', meta: { requiresAuth: true, adminOnly: true } },
      { path: '/ManterEquip', component: CreateEquip, name: 'ManterEquip', meta: { requiresAuth: true, adminOnly: true } },
      { path: '/ManterInfra', component: CreateInfra, name: 'ManterInfra', meta: { requiresAuth: true, adminOnly: true } },
      { path: '/CreateAgendamento', component: CreateAgendamento, name: 'CreateAgendamento' },
      { path: '/showAgendamento', component: showAgendamento, name: 'showAgendamento', props: true },
      

      
      
    ],
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de Rota
router.beforeEach(async (to, from, next) => {
  try {
    const localToken = localStorage.getItem('access_token');

    // Blinda rotas que exigem autenticação quando não há token
    if (to.meta?.requiresAuth && !localToken) {
      return next('/login');
    }

    if (localToken) {
      // Restaura sessão para garantir usuário e token atualizados no store
      await store.dispatch('loadSession');
      const storeToken = store.state.token;
      const user = store.state.user;

      // Se autenticado e tentando acessar login, redireciona
      if (to.name === 'login') {
        return next('/about');
      }

      // Exige token válido para rotas protegidas
      if (to.meta?.requiresAuth && !storeToken) {
        return next('/login');
      }

      // Verificação de admin
      if (to.meta?.adminOnly && (!user || user.role !== 'admin')) {
        return next('/');
      }
    }

    next();
  } catch (error) {
    console.error('Erro ao carregar sessão:', error);
    next('/login'); // Redireciona para a página de login em caso de erro
  }
})

export default router
