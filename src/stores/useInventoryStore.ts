import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/api/http'

export interface InventoryItem {
  id: string
  code: string
  materialName: string
  stock: number
}

export const useInventoryStore = defineStore('inventory', () => {
  const materials = ref<InventoryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchInventory() {
    loading.value = true
    error.value = null
    try {
      const { data } = await http.get<InventoryItem[]>('/api/inventory')
      materials.value = data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar inventario'
    } finally {
      loading.value = false
    }
  }

  return { materials, loading, error, fetchInventory }
})
