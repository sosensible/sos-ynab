<script lang="ts" setup>
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const ynab = config.public.ynab;

const authorizeUrl = `https://app.ynab.com/oauth/authorize?client_id=${ynab.clientId}&redirect_uri=${ynab.redirectUri}/&response_type=token`;
</script>

<template>
  <div>
    <h1>YNAB</h1>
    <a :href="authorizeUrl" class="btn">Authorize YNAB</a>
  </div>
</template>