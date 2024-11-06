<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useYnabStore } from '../../../stores/ynabStore';

const ynabStore = useYnabStore();
const route = useRoute();
const query = ref<{ [key: string]: string }>({});
onMounted(() => {
  try {
    const qry = route.hash.substring(1).split('&');
    qry.forEach(param => {
      const [key, value] = param.split('=');
      if (key !== undefined && value !== undefined) {
        query.value[key] = decodeURIComponent(value);
      }
    });
    let until = new Date();
    until.setSeconds(until.getSeconds() + Number(query.value.expires_in || 0));
    ynabStore.setExpiresAt(query.value.expires_in);
    ynabStore.setAccessToken(query.value.access_token || '');
    ynabStore.clearBudget();
  } catch (error) {
    console.error('Error parsing YNAB OAuth response:', error);
  }
});
</script>

<template>
  <div>
    <h1>YNAB OAuth Callback</h1>
  </div>
</template>