import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/api/http'

export type OrderStatus = 'PENDING' | 'PROCESSED' | 'FAILED'

export interface OrderMaterial {
  materialCode: string
  quantity: number
}

export interface Order {
  id: string
  shopifyOrderId: string
  status: OrderStatus
  items: { productId: string; quantity: number; isFragile: boolean }[]
  createdAt: string
  orderMaterials?: OrderMaterial[]
}

export interface PaginatedOrders {
  data: Order[]
  total: number
  page: number
  limit: number
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusFilter = ref<OrderStatus | 'ALL'>('ALL')

  async function fetchOrders(newPage = 1) {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, string | number> = { page: newPage, limit: 20 }
      if (statusFilter.value !== 'ALL') params.status = statusFilter.value

      const { data } = await http.get<PaginatedOrders>('/api/orders', { params })
      orders.value = data.data
      total.value = data.total
      page.value = data.page
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar órdenes'
    } finally {
      loading.value = false
    }
  }

  function setFilter(status: OrderStatus | 'ALL') {
    statusFilter.value = status
    fetchOrders(1)
  }

  return { orders, total, page, loading, error, statusFilter, fetchOrders, setFilter }
})
