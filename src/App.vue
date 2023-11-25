<script setup>
import { auth, onAuthStateChanged } from './utils/firebase_config'
import useTodoSimpleStore from "@/stores/useTodoSimpleStore";
import Auth from "@/views/Auth.vue";
import TodoApp from "@/views/TodoApp.vue";

const { user, setUser } = useTodoSimpleStore()

document.title = import.meta.env.VITE_APP_NAME

onAuthStateChanged( auth, (fbuser) => {
  if ( fbuser ) {
    setUser( fbuser )
  }
})

async function logout() {
  await auth.signOut()
  user.value = null
}
</script>

<template>
  <div v-if="!user">
    <Auth />
  </div>
  <div v-else>
    <a class="alink" @click="logout">Logout</a>
    <TodoApp/>
  </div>
</template>
