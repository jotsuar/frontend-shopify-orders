<template>
  <div class="min-h-screen bg-[#f1f2f4]">
    <nav class="bg-[#1a1a1a] text-white px-6 py-3 flex items-center gap-3 shadow-sm">
      <div class="w-6 h-6 bg-[#008060] rounded flex items-center justify-center text-xs font-bold">S</div>
      <span class="font-semibold text-sm">Shopify Orders — Panel Operativo</span>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
