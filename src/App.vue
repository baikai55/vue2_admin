<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { initAsyncRouter } from './router';
export default {
  created() {
    initAsyncRouter();
  },
};
</script>
<style lang="scss">
#nprogress .bar {
  background: red !important;
}
</style>
