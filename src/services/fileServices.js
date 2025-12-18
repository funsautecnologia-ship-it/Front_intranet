import api from './api'

// Função para enviar arquivos
export const uploadFile = async (file,filename) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('filename', filename)

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

// Função para buscar arquivos
export const fetchFiles = async () => {
  const response = await api.get('/files')
  return response.data
}


// Função para remover um arquivo
export const deleteFile = async (fileId) => {

  await api.delete(`/files/remove/${fileId}`)
}