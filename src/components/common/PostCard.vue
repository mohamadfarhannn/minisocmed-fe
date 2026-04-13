<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Heart,
  MessageCircleMore,
  Bookmark,
  Forward,
  MoreHorizontal,
  BadgeCheck
} from 'lucide-vue-next'

// Definisi props
interface Comment {
  id: number
}

interface Like {
  id: number
}

const props = defineProps<{
  post: {
    id: number
    content: string
    image_url?: string | null
    created_at: string
    user: {
      name: string
    }
    likes_count?: number
    comments_count?: number
    likes?: Like[]
    comments?: Comment[]
  }
}>()

// Helper to derive handle
const handle = `@${props.post.user.name.toLowerCase().replace(/\s+/g, '')}`

// Fungsi pembantu untuk memformat waktu
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.round((now.getTime() - past.getTime()) / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);

  if (diffInHours > 24) return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  if (diffInHours > 0) return `${diffInHours}h`;
  if (diffInMinutes > 0) return `${diffInMinutes}m`;
  return 'now';
}
</script>

<template>
  <Card class="mb-4 overflow-hidden border-none bg-white rounded-2xl hover:shadow-md transition-shadow duration-300">
    <CardHeader class="flex flex-row items-start justify-between gap-3 p-4 pb-0">
      <div class="flex items-start gap-3">
        <Avatar class="h-12 w-12 rounded-xl border border-gray-100 shadow-sm">
          <AvatarImage :src="`https://api.dicebear.com/8.x/avataaars/svg?seed=${post.user.name}`" />
          <AvatarFallback class="bg-gray-100 text-gray-500 font-bold">{{ post.user.name.charAt(0).toUpperCase() }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col pt-0.5">
          <div class="flex items-center gap-1 flex-wrap">
            <span class="text-[15px] font-bold text-gray-900 leading-tight">{{ post.user.name }}</span>
            <BadgeCheck class="h-4 w-4 text-blue-500 fill-blue-500/10" />
            <span class="text-[14px] text-gray-500 ml-0.5">{{ handle }}</span>
            <span class="text-[14px] text-gray-400">·</span>
            <span class="text-[14px] text-gray-400">{{ formatTimeAgo(post.created_at) }}</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full">
        <MoreHorizontal class="h-5 w-5" />
      </Button>
    </CardHeader>

    <CardContent class="px-4 py-3 pb-2 ml-14">
      <p class="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800 font-normal">{{ post.content }}</p>

      <div v-if="post.image_url" class="mt-3">
        <div class="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <img
            :src="post.image_url"
            alt="Post Image"
            class="w-full h-auto object-cover max-h-125"
          />
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pb-2">
        <div class="flex items-center gap-6">
          <!-- Love -->
          <button class="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
            <div class="p-1.5 rounded-full group-hover:bg-gray-100">
              <Heart class="h-4.5 w-4.5" />
            </div>
            <span class="text-[13px] font-semibold tracking-tight">{{ post.likes_count ?? post.likes?.length ?? '9,230' }}</span>
          </button>

          <!-- Comments -->
          <button class="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
            <div class="p-1.5 rounded-full group-hover:bg-gray-100">
              <MessageCircleMore class="h-4.5 w-4.5" />
            </div>
            <span class="text-[13px] font-semibold tracking-tight">{{ post.comments_count ?? post.comments?.length ?? '92' }}</span>
          </button>

          <!-- Save -->
          <button class="flex items-center text-gray-500 hover:text-gray-900 transition-colors group">
            <div class="p-1.5 rounded-full group-hover:bg-gray-100">
              <Bookmark class="h-4.5 w-4.5" />
            </div>
          </button>
        </div>

        <!-- Share -->
        <button class="flex items-center text-gray-500 hover:text-gray-900 transition-colors group">
          <div class="p-1.5 rounded-full group-hover:bg-gray-100">
            <Forward class="h-5 w-5" />
          </div>
        </button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
/* Any additional custom styles can go here */
</style>

