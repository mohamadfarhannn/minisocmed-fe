<script setup lang="ts">
import {ref, onMounted} from 'vue';
import PostCard from '@/components/common/PostCard.vue';
import api from '@/api/axios';
import { Loader2 } from '@lucide/vue';

interface User {
  name: string;
}

interface Comment {
  id: number;
}

interface Like {
  id: number;
}

interface Post {
  id: number;
  user: User;
  content: string;
  image_url: string;
  created_at: string;
  comments?: Comment[];
  likes?: Like[];
}

const posts = ref<Post[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchPosts = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/posts');

    posts.value = response.data.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    errorMessage.value = 'Gagal mengambil data postingan!';
  } finally {
    isLoading.value = false;
  }
}


onMounted(() => {
  fetchPosts();
})
</script>

<template>
  <div class="min-h-screen bg-white pb-10">
    <main class="mt-6 max-w-2xl px-4">
     <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-gray-400">
      <Loader2 class="w-8 h-8 animate-spin mb-2" />
      <p class="text-sm font-medium">Memuat postingan...</p>
    </div>

      <div v-else-if="errorMessage" class="rounded-lg bg-red-100 p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else-if="posts.length === 0" class="text-center text-gray-500 py-10">
        <p class="text-lg">Belum ada postingan nih!</p>
      </div>

     <div v-else class="space-y-1">
      <PostCard
        v-for="item in posts"
        :key="item.id"
        :post="item"
      />
    </div>
    </main>
  </div>
</template>
