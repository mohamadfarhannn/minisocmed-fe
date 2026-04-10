<script setup lang="ts">
import {ref, onMounted} from 'vue';
import api from '@/api/axios';

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
    const response = await api.get('/posts');

    posts.value = response.data.data;
  } catch {
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
  <div class="min-h-screen bg-gray-100 pb-10">
    <main class="mx-auto mt-6 max-w-2xl px-4">
      <h2 class="mb-4 text-2xl font-bold text-gray-800">Timeline Terbaru</h2>

      <div v-if="isLoading" class="text-center text-gray-500 py-10">
        <p class="text-lg animate-pulse">Memuat postingan, tunggu bentar Bang...</p>
      </div>

      <div v-else-if="errorMessage" class="rounded-lg bg-red-100 p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else-if="posts.length === 0" class="text-center text-gray-500 py-10">
        <p class="text-lg">Belum ada postingan nih. Sepi amat!</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="post in posts"
          :key="post.id"
          class="rounded-xl bg-white p-5 shadow-sm border border-gray-200"
        >
          <div class="flex items-center mb-3">
            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {{ post.user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-3">
              <p class="font-semibold text-gray-800">{{ post.user.name }}</p>
              <p class="text-xs text-gray-500">{{ new Date(post.created_at).toLocaleDateString('id-ID') }}</p>
            </div>
          </div>

          <p class="text-gray-700 whitespace-pre-wrap">{{ post.content }}</p>
          <img :src="post.image_url" alt="" class="mt-4 rounded-lg">

          <div class="mt-4 flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
            <button class="hover:text-blue-600">💬 {{ post.comments?.length || 0 }} Komentar</button>
            <button class="hover:text-red-600">❤️ {{ post.likes?.length || 0 }} Suka</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
