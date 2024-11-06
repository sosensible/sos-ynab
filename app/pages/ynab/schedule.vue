<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCalendar } from '@/composables/useCalendar'

const { availableSlots, busyTimes, isLoading, fetchCalendar } = useCalendar()
const selectedSlot = ref(null)

const selectSlot = (slot) => {
  if (slot.isAvailable) {
    selectedSlot.value = slot
  }
}

onMounted(() => {
  fetchCalendar()
})
</script>

<template>
  <div class="prose max-w-full">
    <h1>Scheduling</h1>
    <h2>Available Appointment Slots</h2>

    <div v-if="isLoading">Loading calendar...</div>

    <div v-else class="grid gap-4">
      <div v-for="slot in availableSlots" :key="slot.start.toISOString()" @click="selectSlot(slot)" :class="[
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

    {{ selectedSlot }}

    <iframe class="mt-8"
      src="https://calendar.google.com/calendar/embed?src=c_304760a7ea57e4264275aa9825efcaea17b01c5171990b43010deb0c538c0667%40group.calendar.google.com&ctz=America%2FNew_York"
      style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
  </div>
</template>
