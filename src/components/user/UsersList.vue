<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-multiple</v-icon>
        Usuários
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Buscar"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          style="max-width: 320px"
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-data-table-virtual
          :headers="headers"
          :items="filtered"
          item-key="_id"
          :search="search"
          class="elevation-1"
        >
          <template #item.avatar="{ item }">
            <v-avatar size="36">
              <v-img v-if="item.avatar" :src="item.avatar" />
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
          </template>
          <template #item.active="{ item }">
            <v-chip :color="item.active ? 'success' : 'grey'" variant="flat">
              {{ item.active ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn size="small" color="primary" class="mr-2" @click="openEdit(item)">
              Editar
            </v-btn>
            <v-btn
              size="small"
              :color="item.active ? 'warning' : 'success'"
              @click="toggleActive(item)"
            >
              {{ item.active ? 'Inativar' : 'Ativar' }}
            </v-btn>
          </template>
          <template #no-data>
            <v-alert type="info" text>Nenhum usuário encontrado.</v-alert>
          </template>
        </v-data-table-virtual>
      </v-card-text>
    </v-card>
    <UserEditDialog v-model="editDialog" :user-data="selectedUser" @saved="onEdited" />
  </v-container>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { getUsers, setUserActive } from '../../services/userService.js';
import UserEditDialog from './UserEditDialog.vue';

const store = useStore();
const users = ref([]);
const search = ref('');
const loading = ref(false);

const headers = [
  { title: 'Avatar', value: 'avatar', align: 'start', width: 80 },
  { title: 'Nome', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Perfil', value: 'role', width: 120 },
  { title: 'Status', value: 'active', width: 120 },
  { title: 'Ações', value: 'actions', width: 220 },
];

const filtered = computed(() => users.value.map(u => ({
  _id: u._id,
  avatar: u.avatar,
  name: u.name,
  email: u.email,
  role: u.role,
  active: u.active === undefined ? true : !!u.active,
})));

const loadUsers = async () => {
  try {
    loading.value = true;
    users.value = await getUsers();
  } catch (error) {
    const msg = error?.response?.data?.error || error.message || 'Erro ao buscar usuários';
    store.dispatch('triggerSnackbar', { text: msg, color: 'error' });
    users.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadUsers);

const editDialog = ref(false);
const selectedUser = ref(null);

const openEdit = (user) => {
  const full = users.value.find(u => u._id === user._id) || user;
  selectedUser.value = full;
  editDialog.value = true;
};

const onEdited = async () => {
  await loadUsers();
};

const toggleActive = async (user) => {
  try {
    const confirmText = user.active ? 'Confirmar inativação deste usuário?' : 'Confirmar ativação deste usuário?';
    if (!confirm(confirmText)) return;
    await setUserActive(user._id, !user.active);
    store.dispatch('triggerSnackbar', {
      text: user.active ? 'Usuário inativado' : 'Usuário ativado',
      color: 'success',
    });
    await loadUsers();
  } catch (error) {
    const msg = error?.response?.data?.message || error.message || 'Erro ao alterar status do usuário';
    store.dispatch('triggerSnackbar', { text: msg, color: 'error' });
  }
};
</script>

<style scoped>
</style>
