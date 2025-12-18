<template>

    <v-container>
      <h2>Vídeos do Canal</h2>
      <v-row>
        <v-col
          v-for="video in videos"
          :key="video.id.videoId"
          cols="12"
          sm="6"
          md="4"
        >
          
          <v-card>
            <v-img :src="video.snippet.thumbnails.high.url" height="200px"></v-img>
            <v-card-title>{{ video.snippet.title }}</v-card-title>
            <v-card-text>{{ video.snippet.description }}</v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                :href="'https://www.youtube.com/watch?v=' + video.id.videoId"
                target="_blank"
              >
                Assistir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  
</template>
  

<script>
import { ref, onMounted } from 'vue'



export default {
  setup() {
    
    
    const videos = ref([])
   
      //metodo buscar videos no youtube
    const fetchVideos = async () => {
      try {
        const apiKey = 'AIzaSyBjit2RdKpwPywqwuL149D55YsI_MwxDCI' // pegando api key
        const channelId = 'UCaHkAuaZBofb5DPk6Syp95A' // pegando id do canal
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&maxResults=10`
        )
        const data = await response.json()
        videos.value = data.items
      } catch (error) {
        console.error('Erro ao buscar vídeos:', error)
      }
    }

   

    onMounted(() => {
      //buscar videos
      fetchVideos()
    })

    return {  videos }
  },
}
</script>