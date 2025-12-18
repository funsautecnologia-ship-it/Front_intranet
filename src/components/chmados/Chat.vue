<template>
  <!-- Modal do chat: primeiro mostra só a lista de usuários online -->
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card :style="{
      background: $vuetify.theme.current.dark ? '#23272f' : '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      borderRadius: '12px',
      border: '1px solid var(--v-theme-outline)'
    }">
      <v-toolbar
        flat
        color="primary"
        dark
      >
        <v-toolbar-title>
          <v-icon left>mdi-chat</v-icon>
          Chat do Sistema
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Lista de usuários -->
      <div v-if="!selectedContact" style="padding: 24px 12px 24px 12px; min-height: 200px;">
        <div style="font-size: 15px; font-weight:bold; margin-bottom:12px; color: var(--v-theme-on-surface);">
          Selecione um usuário para iniciar o chat:
        </div>
        <v-list dense>
          <v-list-subheader :style="{ color: 'var(--v-theme-primary)' }">Online</v-list-subheader>
          <v-list-item
            v-for="u in onlineUsers"
            :key="'on-' + u._id"
            @click="selectContact(u)"
            style="cursor:pointer; border-radius:8px; margin-bottom:4px;"
            :color="selectedContact && selectedContact._id === u._id ? 'primary' : ''"
          >
            <v-list-item>
              <v-list-item-title>
                <span style="color: var(--v-theme-primary); font-weight:bold;">{{ u.name || u.email }}</span>
                <span v-if="unread[u._id]" :style="{
                  background: 'var(--v-theme-primary)',
                  color: 'var(--v-theme-on-primary)',
                  borderRadius: '8px',
                  padding: '0 6px',
                  fontSize: '10px',
                  marginLeft: '6px'
                }">
                  {{ unread[u._id] }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item-action>
              <v-icon color="primary" small>mdi-circle</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-if="!onlineUsers.length">
            <v-list-item>
              <v-list-item-title style="color: var(--v-theme-on-surface);">Nenhum usuário online</v-list-item-title>
            </v-list-item>
          </v-list-item>
          <v-subheader :style="{ color: 'var(--v-theme-on-surface)' }">Offline</v-subheader>
          <v-list-item
            v-for="u in offlineUsers"
            :key="'off-' + u._id"
            @click="selectContact(u)"
            style="cursor:pointer; border-radius:8px; margin-bottom:4px; opacity:0.6;"
          >
            <v-list-item>
              <v-list-item-title>
                <span style="color: var(--v-theme-on-surface);">{{ u.name || u.email }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item-action>
              <v-icon color="grey" small>mdi-circle</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-if="!onlineUsers.length && !offlineUsers.length">
            <v-list-item>
              <v-list-item-title style="color: var(--v-theme-on-surface);">Nenhum usuário encontrado</v-list-item-title>
            </v-list-item>
          </v-list-item>
        </v-list>
      </div>

      <!-- Chat com contato selecionado -->
      <template v-else>
        <v-card-text :style="{ background: $vuetify.theme.current.dark ? '#23272f' : '#fff' }">
          <div style="margin: 0 0 8px 0; padding: 8px 16px 0 16px;">
            <v-chip
              :color="$vuetify.theme.current.dark ? 'primary' : '#42A5F5'"
              :text-color="$vuetify.theme.current.dark ? 'white' : '#075e54'"
              dark
              aria-live="polite"
              style="font-weight:bold;"
            >
              Conversando com: {{ selectedContact.name || selectedContact.email }}
              <span v-if="typing[selectedContact._id]" style="margin-left:8px;font-style:italic;font-size:12px;">digitando...</span>
            </v-chip>
            <!-- Botão para voltar à lista de usuários -->
            <v-btn icon small @click="selectedContact = null" style="float:right;" title="Voltar para lista de usuários">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </div>
          <!-- Campo de busca no histórico do chat -->
          <v-text-field
            v-model="search"
            label="Buscar mensagens"
            prepend-inner-icon="mdi-magnify"
            dense
            hide-details
            style="margin:0 16px 8px 16px;"
            :disabled="messages.length === 0"
            :style="{ background: 'var(--v-theme-surface)', color: 'var(--v-theme-on-surface)' }"
          />
          <div
            ref="chatContainer"
            style="height: 300px; overflow-y: auto; padding: 0 8px 0 8px;"
            :style="{ background: 'var(--v-theme-surface)' }"
            @scroll="onChatScroll"
            tabindex="0"
            aria-label="Mensagens do chat"
            role="log"
            aria-live="polite"
          >
            <template v-if="filteredMessages.length">
              <div
                v-for="(msg, i) in filteredMessages"
                :key="i"
                :aria-label="`${msg.fromMe ? 'Você' : (onlineUsersMap[msg.from]?.name || onlineUsersMap[msg.from]?.email || msg.from)}: ${msg.text} ${formatTime(msg.time)}`"
                tabindex="0"
                role="article"
                :style="{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.fromMe ? 'flex-end' : 'flex-start',
                  margin: '6px 0'
                }"
              >
                <div
                  :style="{
                    background: $vuetify.theme.current.dark
                      ? '#37474F'   // tom cinza escuro no tema escuro
                      : '#F0F4C3',  // tom amarelado no tema claro
                    color: 'var(--v-theme-on-surface)',
                    borderRadius: msg.fromMe ? '8px 0 8px 8px' : '0 8px 8px 8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    padding: '8px 14px',
                    maxWidth: '80%',
                    minWidth: '60px',
                    wordBreak: 'break-word',
                    position: 'relative',
                    border: msg.fromMe ? '1px solid var(--v-theme-primary)' : '1px solid var(--v-theme-outline)'
                  }"
                >
                  <span style="font-size:12px;font-weight:bold;">
                    {{ msg.fromMe
                      ? 'Você'
                      : (onlineUsersMap[msg.from]?.name
                          || allUsers.find(u => u._id === msg.from)?.name
                          || onlineUsersMap[msg.from]?.email
                          || allUsers.find(u => u._id === msg.from)?.email
                          || msg.from)
                    }}
                  </span>
                  <br>
                  <span v-html="highlightSearch(msg.text)"></span>
                  <span style="font-size:10px;color:var(--v-theme-on-surface);margin-left:6px;float:right;">
                    {{ formatTime(msg.time) }}
                    <v-icon
                      v-if="msg.fromMe"
                      :color="msg.read ? 'blue' : 'grey'"
                      size="16"
                    >
                      {{ msg.read ? 'mdi-check-all' : 'mdi-check' }}
                    </v-icon>
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div style="text-align:center;color:var(--v-theme-on-surface);padding:16px;">Nenhuma mensagem encontrada.</div>
            </template>
            <div v-if="loadingOldMessages" style="text-align:center;font-size:12px;color:var(--v-theme-on-surface);padding:4px;">Carregando...</div>
          </div>
          <div :style="{
            background: 'var(--v-theme-surface)',
            padding: '12px 8px 8px 8px',
            borderTop: '1px solid var(--v-theme-outline)'
          }">
            <v-text-field
              v-model="newMessage"
              label="Digite sua mensagem"
              @keyup.enter="sendMessage"
              :disabled="!selectedContact"
              @input="notifyTyping"
              aria-label="Campo de mensagem"
              :autofocus="true"
              :aria-disabled="!selectedContact"
              :aria-required="true"
              :aria-label="'Digite sua mensagem para ' + (selectedContact ? (selectedContact.name || selectedContact.email) : '')"
              hide-details
              solo
              rounded
              :style="{ background: $vuetify.theme.current.dark ? '#23272f' : '#fff' }"
            />
          </div>
        </v-card-text>
        <v-card-actions :style="{ background: 'var(--v-theme-surface)' }">
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="sendMessage"
            :disabled="!selectedContact"
            aria-label="Enviar mensagem"
            style="font-weight:bold;"
          >
            <v-icon left>mdi-send</v-icon>
            Enviar
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, inject, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useStore } from 'vuex';
import api from '../../services/api';

export default {
  name: 'Chat',
  props: {
    user: { type: String, required: true }
  },
  setup(props, { emit }) {
    const dialog = ref(true);
    const store = useStore();
    const newMessage = ref('');
    const socket = inject('$socket');
    const chatContainer = ref(null);
    const onlineUsers = ref([]);
    const offlineUsers = ref([]);
    const allUsers = ref([]);
    const onlineUsersMap = ref({});
    const selectedContact = ref(null);
    const unread = ref({});
    const typing = ref({});
    const loadingOldMessages = ref(false);
    const allMessagesLoaded = ref(false);
    const page = ref(1);
    const pageSize = 30;
    const search = ref('');
    const showOnline = ref(true);
    const showOffline = ref(false);
    const token = store.state.token;
    const messages = ref([]);

    // Carrega todos os usuários
    const loadAllUsers = async () => {
      try {
        const res = await api.get('/users');
        allUsers.value = Array.isArray(res.data) ? res.data : [];
        updateOfflineUsers();
      } catch (err) {
        allUsers.value = [];
      }
    };

    // Atualiza lista de offline
    const updateOfflineUsers = () => {
      const onlineIds = new Set(onlineUsers.value.map(u => u._id));
      offlineUsers.value = allUsers.value.filter(u => !onlineIds.has(u._id) && u._id !== props.user);
    };

    // Recebe mensagens privadas do servidor
    onMounted(() => {
      loadAllUsers();
      if (socket) {
        if (socket.connected) {
          socket.emit('register', props.user);
          socket.emit('get-online-users');
        } else {
          socket.on('connect', () => {
            socket.emit('register', props.user);
            socket.emit('get-online-users');
          });
        }
        socket.on('private-message', (msg) => {
          const msgObj = {
            id: msg.id || msg._id || Date.now() + Math.random(),
            text: msg.message,
            from: msg.from,
            fromMe: false,
            sender: msg.sender || msg.from, // <-- garanta que sempre terá sender
            time: msg.time || Date.now(),
            read: false
          };
          if (selectedContact.value && msg.from === selectedContact.value._id) {
            msgObj.read = true;
            messages.value.push(msgObj);
            socket.emit('message-read', { from: props.user, to: msg.from, messageIds: [msgObj.id] });
          } else {
            messages.value.push(msgObj);
            unread.value[msg.from] = (unread.value[msg.from] || 0) + 1;
          }
        });
        socket.on('online-users', (users) => {
          const filtered = users.filter(u => u._id !== props.user);
          onlineUsers.value = filtered;
          const map = {};
          filtered.forEach(u => { map[u._id] = u; });
          onlineUsersMap.value = map;
          updateOfflineUsers();
        });
        socket.on('typing', (payload) => {
          const from = payload.from;
          const to = payload.to;
          if (to === props.user && selectedContact.value && from === selectedContact.value._id) {
            typing.value[from] = true;
            if (typing.value._timeout) clearTimeout(typing.value._timeout);
            typing.value._timeout = setTimeout(() => {
              typing.value[from] = false;
            }, 2000);
          }
        });
        socket.on('message-read', ({ from, to }) => {
          // Atualize localmente as mensagens do usuário `to` enviadas para `from` como lidas
          if (props.user === to) {
            messages.value.forEach(msg => {
              if (msg.receiver === from && msg.sender === to) {
                msg.read = true;
              }
            });
          }
        });
        socket.on('message-read', ({ from, to, messageIds }) => {
          messages.value.forEach(m => {
            if (m.fromMe && messageIds && messageIds.includes(m.id)) {
              m.read = true;
            }
          });
        });
      }
    });

    onUnmounted(() => {
      if (socket) {
        socket.emit('unregister', props.user);
        setTimeout(() => {
          socket.off('private-message');
          socket.off('online-users');
          socket.off('connect');
        }, 200);
      }
    });

    // Scroll automático ao receber nova mensagem
    watch(messages, async () => {
      await nextTick();
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });

    // Formata horário
    const formatTime = (dateOrString) => {
      if (!dateOrString) return '';
      const d = typeof dateOrString === 'string' || typeof dateOrString === 'number'
        ? new Date(dateOrString)
        : dateOrString;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Busca mensagens antigas (paginadas)
    const fetchOldMessages = async (contactId, pageNum = 1, prepend = false) => {
      if (allMessagesLoaded.value || loadingOldMessages.value) return;
      loadingOldMessages.value = true;
      try {
        const res = await api.get(`/chat/${contactId}?page=${pageNum}&limit=${pageSize}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const msgs = Array.isArray(res.data) ? res.data : (res.data.messages || []);
        if (msgs.length < pageSize) allMessagesLoaded.value = true;
        const mapped = msgs.map(msg => ({
          id: msg.id || msg._id || Date.now() + Math.random(),
          text: msg.message,
          from: msg.sender,
          fromMe: msg.sender === props.user,
          sender: msg.sender, // <-- adicione esta linha
          time: msg.time || msg.createdAt || Date.now(),
          read: !!msg.read
        }));
        if (prepend) {
          messages.value = [...mapped, ...messages.value];
        } else {
          messages.value = mapped;
        }
      } catch (err) {
        allMessagesLoaded.value = true;
      }
      loadingOldMessages.value = false;
    };

    // Detecta scroll para topo para carregar mais mensagens
    const onChatScroll = async (e) => {
      if (e.target.scrollTop === 0 && !allMessagesLoaded.value && selectedContact.value) {
        const prevHeight = e.target.scrollHeight;
        page.value += 1;
        await fetchOldMessages(selectedContact.value._id, page.value, true);
        await nextTick();
        e.target.scrollTop = e.target.scrollHeight - prevHeight;
      }
    };

    // Seleciona contato
    const selectContact = (userObj) => {
      selectedContact.value = userObj;
      page.value = 1;
      allMessagesLoaded.value = false;
      fetchOldMessages(userObj._id, 1, false);
      if (unread.value[userObj._id]) {
        unread.value[userObj._id] = 0;
      }
      // Envia confirmação de leitura para mensagens não lidas
      const unreadIds = messages.value
        .filter(m => !m.fromMe && m.from === userObj._id && !m.read)
        .map(m => m.id);
      messages.value.forEach(m => {
        if (!m.fromMe && m.from === userObj._id) m.read = true;
      });
      if (unreadIds.length) {
        markAsRead(userObj._id, unreadIds);
      }
    };

    // Envia mensagem
    const sendMessage = () => {
      if (!newMessage.value || !selectedContact.value) return;
      const msgId = Date.now() + Math.random();
      messages.value.push({
        id: msgId,
        text: newMessage.value,
        from: props.user,
        fromMe: true,
        sender: props.user, // <-- adicione esta linha
        time: Date.now(),
        read: false
      });
      if (socket) {
        socket.emit('private-message', {
          to: selectedContact.value._id,
          from: props.user,
          message: newMessage.value,
          id: msgId
        });
      }
      newMessage.value = '';
    };

    // Notifica que está digitando
    const notifyTyping = () => {
      if (!selectedContact.value || !socket) return;
      socket.emit('typing', { to: selectedContact.value._id, from: props.user });
    };

    const close = () => {
      dialog.value = false;
      emit('close');
    };

    // Mensagens filtradas pela busca
    const filteredMessages = computed(() => {
      if (!search.value) return messages.value;
      return messages.value.filter(msg => msg.text.toLowerCase().includes(search.value.toLowerCase()));
    });

    // Realça o texto da busca nas mensagens
    const highlightSearch = (text) => {
      if (!search.value) return text;
      const regex = new RegExp(`(${search.value})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    // Função para marcar mensagens como lidas no backend e emitir evento pelo socket
    const markAsRead = async (fromId, messageIds = []) => {
      try {
        await api.put('/chat/read', { from: fromId }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (socket) {
          socket.emit('message-read', {
            from: props.user, // quem leu
            to: fromId,       // quem enviou
            messageIds        // ids das mensagens lidas
          });
        }
      } catch (error) {
        console.error('Erro ao marcar como lidas:', error);
      }
    };

    return {
      dialog,
      messages,
      newMessage,
      sendMessage,
      close,
      user: props.user,
      chatContainer,
      onlineUsers,
      offlineUsers,
      allUsers,
      onlineUsersMap,
      selectedContact,
      selectContact,
      unread,
      formatTime,
      typing,
      notifyTyping,
      loadingOldMessages,
      onChatScroll,
      search,
      filteredMessages,
      highlightSearch,
      showOnline,
      showOffline
    };
  }
};
</script>
