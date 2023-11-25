<script setup lang="ts">
import Todos from "@/components/Todos.vue";

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h2>{{ msg }}</h2>
    <p>
      This is an app
    </p>
    <Todos />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
