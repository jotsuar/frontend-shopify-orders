<template>
  <tr v-for="i in rows" :key="i" class="animate-pulse">
    <td v-for="j in cols" :key="j" class="px-4 py-3">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{ rows?: number; cols?: number }>()
withDefaults(defineProps<{ rows?: number; cols?: number }>(), { rows: 5, cols: 5 })
</script>
