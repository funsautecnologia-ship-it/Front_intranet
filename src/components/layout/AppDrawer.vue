<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="val => $emit('update:drawer', val)"
    :location="$vuetify?.display?.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list-item v-if="userData" @click="openUserDialog">
      <template #prepend>
        <v-avatar v-if="userData.avatar" size="36px">
          <v-img :src="userData.avatar" />
        </v-avatar>
        <v-icon v-else aria-label="Avatar padrão">mdi-account-circle</v-icon>
      </template>
      <v-list-item-title>{{ userData.name || 'Usuário' }}</v-list-item-title>
    </v-list-item>
    <v-divider class="mb-2"></v-divider>
    <v-list dense>
      <template v-for="item in filteredItems" :key="item.title">
        <v-list-item :to="{ name: item.link }" router>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <v-list
      :opened="open"
      @update:opened="val => $emit('update:open', val)"
    >
      <v-list-group
        v-if="userData && userData.role === 'admin'"
        value="Suporte"
        :model-value="group"
        @update:model-value="val => $emit('update:group', val)"
        :prepend-icon="'mdi-lifebuoy'"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Suporte"></v-list-item>
        </template>
        <v-list-item
          v-for="([title, icon, link], i) in suport"
          :key="'suporte-' + i"
          :prepend-icon="icon"
          :title="title"
          :value="title"
          :to="{ name: link }"
          router
        ></v-list-item>
      </v-list-group>
      <v-list-group
        v-if="userData && userData.role === 'admin'"
        value="Chamados"
        :model-value="group"
        @update:model-value="val => $emit('update:group', val)"
        :prepend-icon="'mdi-ticket'"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Chamados"></v-list-item>
        </template>
        <v-list-item
          v-for="([title, icon, link], i) in cruds"
          :key="'chamado-' + i"
          :prepend-icon="icon"
          :title="title"
          :value="title"
          :to="{ name: link }"
          router
        ></v-list-item>
      </v-list-group>
      <v-list-group
        v-if="userData && userData.role === 'admin'"
        value="Agendamentos"
        :model-value="group"
        @update:model-value="val => $emit('update:group', val)"
        :prepend-icon="'mdi-calendar'"  
      >
        
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Agendamentos"></v-list-item>
        </template>
        <v-list-item
          v-for="([title, icon, link], i) in Agendamentos"
          :key="'agendamento-' + i"
          :prepend-icon="icon"
          :title="title"
          :value="title"
          :to="{ name: link }"
          router
        ></v-list-item>
  
       
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
defineProps(['drawer', 'userData', 'filteredItems', 'open', 'group',
 'cruds', 'openUserDialog', 'Agendamentos', 'suport'])
defineEmits(['update:drawer', 'update:group', 'update:open'])
</script>