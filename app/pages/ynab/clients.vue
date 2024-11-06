<script setup lang="ts">
import { ref } from 'vue';

const clients = ref(null);
const theClient = ref(null);
const tasks = ref(null);
const error = ref(null);
const isLoading = ref(false); // Add loading state
const isModalOpen = ref(false); // Add modal state

async function getClients() {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    const response = await $fetch('/api/contacts')
    clients.value = response.items
    console.log('Clients:', response)
  } catch (e) {
    error.value = e.message
    console.error('Failed to fetch clients:', e)
  } finally {
    isLoading.value = false
  }
}

async function getClient(id) {
  try {
    const response = await $fetch(`/api/contacts/${id}`)
    theClient.value = response.item
    console.log('Client:', response)
    isModalOpen.value = true
  } catch (e) {
    error.value = e.message
    console.error('Failed to fetch client:', e)
  }
}

async function getTasks() {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    const response = await $fetch('/api/tasks')
    tasks.value = response.items
    console.log('Tasks:', response)
  } catch (e) {
    error.value = e.message
    console.error('Failed to fetch tasks:', e)
  } finally {
    isLoading.value = false
  }
}

function toggleModal() {
  isModalOpen.value = !isModalOpen.value;
}
</script>

<template>
  <div class="prose max-w-full">
    <h1>Clients</h1>
    <div class="flex gap-4 mb-4">
      <button @click="getClients" class="btn">Load Clients</button>
      <button @click="getTasks" class="btn">Load Tasks</button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Modal trigger button -->
    <button class="btn btn-primary" @click="toggleModal">Client Detail</button>

    <!-- Client Modal -->
    <dialog :class="['modal', { 'modal-open': isModalOpen }]">
      <div class="modal-box">
        <img :src="theClient?.data?.gravatar" class="w-[100px] h-[100px] rounded-full object-cover float-end" alt="" />
        <h3 class="font-bold text-lg">{{ theClient?.data?.full_name }}</h3>
        <p class="py-4">
          phone: {{ theClient?.data?.phone }}<br />
          email: {{ theClient?.data?.email }}<br />
          address: {{ theClient?.data?.address }}<br />
          CSZ: {{ theClient?.data?.city }} {{ theClient?.data?.state }} {{ theClient?.data?.zip }}<br />
          <a :href="theClient?.meta?.virtual_meeting" target="_blank" v-if="theClient?.meta?.virtual_meeting">Virtual
            Meeting</a>
        </p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn" @click="toggleModal">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="toggleModal">
        <button>close</button>
      </form>
    </dialog>

    <!-- Clients Section -->
    <div v-if="clients">
      <h2>Clients</h2>
      <ul>
        <li v-for="client in clients" :key="client.id" class="flex items-center gap-3 py-2">
          <img :src="client.data.gravatar" class="w-[60px] h-[60px] rounded-full object-cover" alt="" />
          <NuxtLink
            :to="`https://budgeting.today/wp-admin/admin.php?page=gh_contacts&action=edit&contact=${client.data.ID}`"
            target="_blank">
            {{ client.data.first_name }} {{ client.data.last_name }}</NuxtLink>
          <button @click="getClient(client.ID)" class="btn">View</button>
          <a :href="client.meta.virtual_meeting" class="btn" target="_blank" v-if="client.meta.virtual_meeting">Virtual
            Meeting</a>
        </li>
      </ul>
    </div>

    <!-- Posts Section -->
    <div v-if="tasks">
      <h2>Tasks</h2>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{ task?.data?.summary }} ( {{ task?.data?.due_date }} )
          <div v-html="task?.data?.content"></div>
        </li>
      </ul>
    </div>

    <div v-if="!clients && !tasks">
      No data loaded.
    </div>

  </div>
</template>