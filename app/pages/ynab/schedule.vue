<!-- schedule.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCalendarStore } from '@/stores/useCalendarStore'

const store = useCalendarStore()
const selectedSlot = ref(null)

function isSelectedSlot(slot: any) {
  if (!store.selectedSlot) return false
  return store.selectedSlot.start.getTime() === slot.start.getTime() &&
    store.selectedSlot.end.getTime() === slot.end.getTime()
}

const selectSlot = (slot) => {
  console.log('selectSlot (page)', slot)
  if (slot.isAvailable) {
    selectedSlot.value = slot
    store.selectSlot(slot)
  }
}

onMounted(() => {
  store.fetchCalendar()
})
</script>

<template>
  <div class="prose max-w-full">
    <h1>Scheduling</h1>

    <div class="flex items-center gap-4 mb-4">
      <button @click="store.previousDay" :disabled="!store.canGoBack" :class="[
        'px-4 py-2 rounded transition-colors',
        store.canGoBack
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]">
        Previous Day
      </button>

      <h2 class="m-0">
        {{ store.currentDate.toLocaleDateString() }}
      </h2>

      <button @click="store.nextDay"
        class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">
        Next Day
      </button>
    </div>

    <div v-if="store.isLoading">Loading calendar...</div>

    <div v-else class="grid gap-4">
      <div v-for="slot in store.availableSlots" :key="slot.start.toISOString()" @click="store.selectSlot(slot)" :class="[
        'p-4 border rounded transition-colors',
        slot.isAvailable
          ? [
            'text-blue-600 cursor-pointer hover:bg-gray-100 hover:border-blue-500',
            isSelectedSlot(slot) && 'bg-blue-50 border-blue-500'
          ]
          : 'bg-gray-100 text-gray-500 opacity-50 cursor-not-allowed hover:bg-gray-300'
      ]">
        <template v-if="!slot.isAvailable">❌</template>
        {{ slot.start.toLocaleTimeString() }} - {{ slot.end.toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>