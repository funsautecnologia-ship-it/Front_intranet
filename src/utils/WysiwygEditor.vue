<template>
  <v-card class="pa-4">
    <v-row class="mb-2" align="center" no-gutters>
      <v-col cols="auto">
        <v-select
          v-model="font"
          :items="fonts"
          item-title="title"
          item-value="value"
          label="Fonte"
          density="compact"
          style="width: 140px"
          @update:modelValue="setFont"
        />
      </v-col>
      <v-col cols="auto">
        <v-select
          v-model="fontSize"
          :items="fontSizes"
          item-title="title"
          item-value="value"
          label="Tamanho"
          density="compact"
          style="width: 120px"
          @update:modelValue="setFontSize"
        />
      </v-col>
       <v-col cols="auto">
        <v-select
          v-model="heading"
          :items="headings"
          item-title="title"
          item-value="value"
          label="Bloco"
          density="compact"
          style="width: 140px"
          @update:modelValue="formatBlock"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn icon @click="execCommand('bold')" :title="'Negrito'"><v-icon>mdi-format-bold</v-icon></v-btn>
        <v-btn icon @click="execCommand('italic')" :title="'Itálico'"><v-icon>mdi-format-italic</v-icon></v-btn>
        <v-btn icon @click="execCommand('underline')" :title="'Sublinhado'"><v-icon>mdi-format-underline</v-icon></v-btn>
        <v-btn icon @click="execCommand('insertUnorderedList')" :title="'Lista'"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
        <v-btn icon @click="execCommand('insertOrderedList')" :title="'Lista numerada'"><v-icon>mdi-format-list-numbered</v-icon></v-btn>
        <v-btn icon @click="execCommand('justifyLeft')" :title="'Alinhar à esquerda'"><v-icon>mdi-format-align-left</v-icon></v-btn>
        <v-btn icon @click="execCommand('justifyCenter')" :title="'Centralizar'"><v-icon>mdi-format-align-center</v-icon></v-btn>
        <v-btn icon @click="execCommand('justifyRight')" :title="'Alinhar à direita'"><v-icon>mdi-format-align-right</v-icon></v-btn>
        <v-btn icon @click="execCommand('justifyFull')" :title="'Justificar'"><v-icon>mdi-format-align-justify</v-icon></v-btn>
        <v-btn icon @click="createLink" :title="'Link'"><v-icon>mdi-link-variant</v-icon></v-btn>
        
      </v-col>
     
    </v-row>
    <v-sheet
      elevation="1"
      rounded
      min-height="200"
      max-height="400"
      style="padding: 15px; outline: none; overflow:auto"
    >
      <div
        ref="editor"
        class="editor-content"
        contenteditable="true"
        style="min-height: 200px; outline: none;"
        @input="emitUpdate"
        @paste="handlePaste"
        @mouseup="saveSelection"
        @keyup="saveSelection"
        @blur="saveSelection"
      ></div>
    </v-sheet>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const editor = ref(null);
const heading = ref('p');
const font = ref('Arial');
const fontSize = ref('3');

const fonts = [
  { title: 'Arial', value: 'Arial' },
  { title: 'Times New Roman', value: 'Times New Roman' },
  { title: 'Courier New', value: 'Courier New' },
  { title: 'Verdana', value: 'Verdana' },
  { title: 'Tahoma', value: 'Tahoma' },
  { title: 'Georgia', value: 'Georgia' },
  { title: 'Trebuchet MS', value: 'Trebuchet MS' },
  { title: 'Comic Sans MS', value: 'Comic Sans MS' },
  { title: 'Impact', value: 'Impact' }
];

const fontSizes = [
  { title: '8px', value: '1' },
  { title: '10px', value: '2' },
  { title: '12px (padrão)', value: '3' },
  { title: '14px', value: '4' },
  { title: '18px', value: '5' },
  { title: '24px', value: '6' },
  { title: '32px', value: '7' }
];

const headings = [
  { title: 'Parágrafo', value: 'p' },
  { title: 'Título 1', value: 'h1' },
  { title: 'Título 2', value: 'h2' },
  { title: 'Título 3', value: 'h3' }
];

// Inicializa o editor com o conteúdo fornecido
onMounted(() => {
  if (props.modelValue) {
    editor.value.innerHTML = props.modelValue;
  }

  editor.value.addEventListener('mouseup', saveSelection);
  editor.value.addEventListener('keyup', saveSelection);
});

// Atualiza quando o conteúdo externo muda
watch(() => props.modelValue, (newValue) => {
  if (newValue !== editor.value.innerHTML) {
    editor.value.innerHTML = newValue;
  }
});

let savedSelection = null;

function saveSelection() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    savedSelection = sel.getRangeAt(0);
  }
}

function restoreSelection() {
  if (savedSelection) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSelection);
  }
}

// Executa comandos de formatação
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value);
  emitUpdate();
};

// Formata blocos de texto (títulos e parágrafos)
const formatBlock = () => {
  restoreSelection();
  execCommand('formatBlock', heading.value);
};

const setFont = () => {
  restoreSelection();
  execCommand('fontName', font.value);
};

const setFontSize = () => {
  restoreSelection();
  execCommand('fontSize', fontSize.value);
};

// Cria links
const createLink = () => {
  const url = prompt('Digite o URL:');
  if (url) {
    execCommand('createLink', url);
  }
};



// Lida com colagem de conteúdo
const handlePaste = (e) => {
  // Não faça nada, deixe o navegador colar normalmente
  emitUpdate();
};

// Emite o evento de atualização
const emitUpdate = () => {
  emit('update:modelValue', editor.value.innerHTML);
};
</script>

<style scoped>
.editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
}

.toolbar {
  background-color: #f5f5f5;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.toolbar button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 3px;
  cursor: pointer;
}

.toolbar button:hover {
  background-color: #e9e9e9;
}



.editor-content:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>