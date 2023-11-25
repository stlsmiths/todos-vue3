<script setup lang="ts">
import {ref,watch,computed} from 'vue'
import { auth } from '../utils/firebase_config.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

const uname = ref()
const upass = ref()

const isOk = computed( () => uname.value && upass.value )

const emesg = ref()

async function processLogin() {
  emesg.value = null
  signInWithEmailAndPassword( auth, uname.value, upass.value )
      .then( artn => {
        // console.log('login res', artn)
      })
      .catch( err => {
        console.log('login error', err)
        // console.log(`error was [${err}]`)
        emesg.value = err.message.match(/\(([^()]+)\)/)[1] || null
      })
}

</script>

<template>
  <div>
    <h2>User Login</h2>
    <div class="form-container">
      <div class="item">
        <label for="uname">Username:</label>
        <input type="text" id="uname" v-model="uname" />
      </div>
      <div class="item">
        <label for="upass">Password:</label>
        <input type="password" id="upass" v-model="upass">
      </div>
      <div class="item">
        <button class="login" :disabled="!isOk" @click="processLogin">Login</button>
        <div class="error-message" v-if="emesg">
          Login Error: {{ emesg }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.item {
  height: 35px;
  box-sizing: border-box;
  max-width: 400px;
}

.login {
  cursor: pointer;
}

.error-message {
  color: darkred;
  margin-top: 1.5rem;
}

</style>
