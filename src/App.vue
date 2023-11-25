<script setup>
import {ref} from 'vue'
import { app, auth, onAuthStateChanged } from './utils/firebase_config'
import useTodoSimpleStore from "@/stores/useTodoSimpleStore";

const { user, setUser } = useTodoSimpleStore()
import MyComp from "@/components/MyComp.vue";
import Auth from "@/components/Auth.vue";

// const user = ref()
const appName = ref( import.meta.env.VITE_APP_NAME )

onAuthStateChanged( auth, (fbuser) => {
  console.log('auth user', fbuser)
  if ( fbuser ) {
    // user.value = fbuser
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
    <MyComp :msg="appName"/>
    <br>
    <a class="alink" @click="logout">Logout</a>
    &nbsp; | &nbsp;
    <RouterLink :to="{name: 'todo'}">Todo App</RouterLink>
    <RouterView/>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.alink {
  text-decoration: underline;
  cursor: pointer;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
