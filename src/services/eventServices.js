import api from './api'

export const fetchEvents = async () => {
  const response = await api.get('/events') // Endpoint para buscar eventos
  return response.data
}

export const createEvent = async (event) => {
  const formData = new FormData()
  formData.append('title', event.title)
  formData.append('description', event.description)
  formData.append('file', event.file)
  try {
    const response = await api.post('/events/create', formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) // Endpoint para criar evento
    return response.data
  } catch (error) {
    console.error('Erro ao criar evento:', error.response?.data || error.message)
    throw error
  }
}

export const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`) // Endpoint para deletar evento
  } catch (error) {
    console.error('Erro ao deletar evento:', error.response?.data || error.message)
    throw error
  }
}

export const fetchEventById = async (id) => {
  const response = await api.get(`/events/${id}`)
  return response.data
}
