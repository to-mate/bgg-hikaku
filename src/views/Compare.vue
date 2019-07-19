<template>
  <div class="compare">
    <div class="left">
      <search></search>
    </div>
    <div class="right">
      <search></search>
    </div>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";

export default {
  name: "compare",
  components: {
    Search
  }
};
</script>

<style scoped>
.compare {
  display: flex;
}
</style>
