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
      <div class="item form-row">
        <label for="uname">Username:</label>
        <input type="text" id="uname" v-model="uname" />
      </div>
      <div class="item form-row">
        <label for="upass">Password:</label>
        <input type="password" id="upass"
               v-model="upass"
               @keydown.enter="processLogin"
        >
      </div>
      <div class="item form-row">
        <button class="login" :disabled="!isOk" @click="processLogin">Login</button>
      </div>
      <div class="form-row error-message" v-if="emesg">
          Login Error: {{ emesg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-containerx {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.itemx {
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

.form-container {
  max-width: 18rem;
  padding: 0.8rem;
  background-color: white;
}

.form-row {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
}

.form-row > label {
  flex: 1;
  width: 5rem;
}

.form-row > input {
  flex: 2;
  width: 8rem;
}

.form-row .error-message {
  flex: 2;
}


</style>
