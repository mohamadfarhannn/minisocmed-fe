<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <main>
      <RouterView />
      <Toaster />
    </main>
  </div>
</template>

<style scoped></style>
