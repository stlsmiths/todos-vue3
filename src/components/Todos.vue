<script setup>
import {ref,watch,computed} from 'vue'
import { auth, fbdata, fbRef, dbRef } from '../utils/firebase_config'
import { getDatabase, push, update, set, remove, onValue } from 'firebase/database'
import useTodoSimpleStore from '../stores/useTodoSimpleStore'

const { todos, user, todoSort, todoOpen, todoDone,
  todoTitle, addTodo, updateTodo, dropTodo
} = useTodoSimpleStore()

const todo = ref()

async function onTodoCheck(todo) {
  const upData = {
    name: todo.name,
    completed: todo.completed,
    updated_ts: Date.now()
  }
  await updateTodo( todo.key, upData )
}

async function onAddTodo() {
  console.log('update todo', todo.value )
  await addTodo( todo.value )
}

async function dropItem( key ) {
  await dropTodo( key )
}

async function onDropCompleted() {
  todos.value.filter( t => t.completed )
      .map( tc => {
        dropItem( tc.key )
      })
}
</script>

<template>
  <div>
    <h4>Todo List:</h4>

    <ul>
      <li>
        <input type="text" id="todo"
               v-model="todo"
               @keypress.enter="onAddTodo"
               placeholder="Add new Todo item ..."
           >
      </li>
      <li v-for="todo in todoSort" :title="todoTitle(todo)">
        <span>
          <input type="checkbox"
                 v-model="todo.completed"
                 @update:model-value="onTodoCheck(todo)"
          />
          {{ todo.name }}
          <a class="alink" @click="dropItem(todo.key)">Delete</a>
        </span>
      </li>
    </ul>

    <div>
      There are a total of {{ todos.length }} items, of which {{ todoOpen.length }} are still open and {{ todoDone.length }} are completed.
    </div>
<!--
    <button @click="addTodo">Add Item</button>
-->
    <br>
    <button @click="onDropCompleted">Drop Completed</button>
    <br>

  </div>
</template>

<style>
.alink {
  color: forestgreen;
  text-decoration: none;
  cursor: pointer;
  margin-left: 15px;
}
</style>
