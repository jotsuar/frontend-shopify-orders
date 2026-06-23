<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="styles[status]">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import type { OrderStatus } from '@/stores/useOrdersStore'

defineProps<{ status: OrderStatus }>()

const styles: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
}
</script>
