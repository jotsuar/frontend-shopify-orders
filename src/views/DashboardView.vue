<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-gray-800">Panel de Operaciones</h1>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in kpiCards" :key="card.label" class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p v-if="ordersStore.loading" class="mt-1 h-8 w-16 bg-gray-200 rounded animate-pulse"></p>
        <p v-else class="mt-1 text-3xl font-bold" :class="card.color">{{ card.value }}</p>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 flex flex-wrap gap-2 items-center justify-between">
        <h2 class="font-medium text-gray-700">Órdenes</h2>
        <div class="flex gap-2">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="ordersStore.setFilter(f.value)"
            class="px-3 py-1 rounded-full text-sm border transition-colors"
            :class="ordersStore.statusFilter === f.value
              ? 'bg-[#008060] text-white border-[#008060]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'"
          >
            {{ f.label }}
          </button>
          <button @click="ordersStore.fetchOrders()" class="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50">
            ↻ Actualizar
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shopify ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materiales</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-if="ordersStore.loading">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td v-for="j in 5" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
              </tr>
            </template>
            <template v-else-if="ordersStore.orders.length === 0">
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-gray-400">No hay órdenes para mostrar</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="order in ordersStore.orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-mono text-gray-700">#{{ order.shopifyOrderId }}</td>
                <td class="px-4 py-3">
                  <StatusBadge :status="order.status" />
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ order.items.length }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
                <td class="px-4 py-3">
                  <button
                    v-if="order.orderMaterials?.length"
                    @click="toggleDetail(order.id)"
                    class="text-xs text-[#008060] underline hover:text-[#006e52]"
                  >
                    {{ expanded === order.id ? 'Ocultar' : 'Ver detalle' }}
                  </button>
                  <span v-else class="text-xs text-gray-400">—</span>
                </td>
              </tr>
              <!-- Materials detail row -->
              <template v-for="order in ordersStore.orders" :key="`detail-${order.id}`">
                <tr v-if="expanded === order.id && order.orderMaterials?.length" class="bg-gray-50">
                  <td colspan="5" class="px-8 py-3">
                    <ul class="flex flex-wrap gap-2">
                      <li
                        v-for="m in order.orderMaterials"
                        :key="m.materialCode"
                        class="text-xs bg-white border border-gray-200 rounded px-2 py-1"
                      >
                        {{ m.materialCode }} × {{ m.quantity }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Inventory -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 class="font-medium text-gray-700">Inventario de Materiales</h2>
        <button @click="inventoryStore.fetchInventory()" class="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50">
          ↻ Actualizar
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-if="inventoryStore.loading">
              <tr v-for="i in 6" :key="i" class="animate-pulse">
                <td v-for="j in 4" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
              </tr>
            </template>
            <tr v-for="item in inventoryStore.materials" :key="item.code" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-mono text-gray-700">{{ item.code }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ item.materialName }}</td>
              <td class="px-4 py-3 text-sm font-semibold" :class="item.stock < 10 ? 'text-red-600' : 'text-green-700'">
                {{ item.stock }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="item.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                >
                  {{ item.stock < 10 ? 'Stock bajo' : 'OK' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ToastNotification
      :message="ordersStore.error || inventoryStore.error || undefined"
      type="error"
      @close="ordersStore.error = null; inventoryStore.error = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOrdersStore } from '@/stores/useOrdersStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import StatusBadge from '@/components/StatusBadge.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import type { OrderStatus } from '@/stores/useOrdersStore'

const ordersStore = useOrdersStore()
const inventoryStore = useInventoryStore()

const expanded = ref<string | null>(null)

const filters: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Procesadas', value: 'PROCESSED' },
  { label: 'Fallidas', value: 'FAILED' },
]

const kpiCards = computed(() => [
  { label: 'Total órdenes', value: ordersStore.total, color: 'text-gray-800' },
  { label: 'Pendientes', value: ordersStore.orders.filter(o => o.status === 'PENDING').length, color: 'text-yellow-600' },
  { label: 'Procesadas', value: ordersStore.orders.filter(o => o.status === 'PROCESSED').length, color: 'text-green-600' },
  { label: 'Fallidas', value: ordersStore.orders.filter(o => o.status === 'FAILED').length, color: 'text-red-600' },
])

function toggleDetail(id: string) {
  expanded.value = expanded.value === id ? null : id
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
}

let refreshTimer: ReturnType<typeof setInterval>

onMounted(() => {
  ordersStore.fetchOrders()
  inventoryStore.fetchInventory()
  refreshTimer = setInterval(() => inventoryStore.fetchInventory(), 30_000)
})

onUnmounted(() => clearInterval(refreshTimer))
</script>
