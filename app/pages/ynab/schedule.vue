<!-- schedule.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCalendarStore } from '@/stores/useCalendarStore'

const store = useCalendarStore()
const selectedSlot = ref(null)

const selectSlot = (slot) => {
  if (slot.isAvailable) {
    selectedSlot.value = slot
  }
}

onMounted(() => {
  store.fetchCalendar()
})
</script>

<template>
  <div class="prose max-w-full">
    <h1>Scheduling</h1>
    <h2>Available Appointment Slots</h2>

    <div v-if="store.isLoading">Loading calendar...</div>

    <div v-else class="grid gap-4">
      <div v-for="slot in store.availableSlots" :key="slot.start.toISOString()" @click="selectSlot(slot)" :class="[
        'p-4 border rounded transition-colors',
        slot.isAvailable
          ? [
            'text-blue-600 cursor-pointer hover:bg-gray-100 hover:border-blue-500',
            selectedSlot === slot && 'bg-blue-50 border-blue-500'
          ]
          : 'bg-gray-100 text-gray-500 opacity-50 cursor-not-allowed hover:bg-gray-300'
      ]">
        <template v-if="!slot.isAvailable">❌</template>
        {{ slot.start.toLocaleTimeString() }} - {{ slot.end.toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>