<template>
  <Transition name="toast">
    <div
      v-if="message"
      class="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-white text-sm"
      :class="type === 'error' ? 'bg-red-600' : 'bg-green-600'"
    >
      <span>{{ message }}</span>
      <button @click="$emit('close')" class="ml-2 text-white/80 hover:text-white">✕</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ message?: string; type?: 'error' | 'success' }>()
defineEmits(['close'])
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }
</style>
