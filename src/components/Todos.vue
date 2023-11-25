<script setup>
import {ref,watch,computed} from 'vue'
import { auth, fbdata, fbRef, dbRef } from '../utils/firebase_config'
import { getDatabase, push, update, set, remove, onValue } from 'firebase/database'
//import * as todoStore from '../stores/todo-simple-store'
//import { todos, todoTitle, todoSort } from '../stores/todo-simple-store'
// import { todos, user } from '../stores/todo-simple-store'

const todos = ref([])
// const todos = todoStore.todos
const todoTitle = 'test'
const todoSort = [...todos.value]
const todo = ref()

/*
const todoSort = computed( () => todos.value.reverse() )

const todoDone = computed( () => todos.value.filter( t => t.completed ) )
const todoOpen = computed( () => todos.value.filter( t => !t.completed ) )
*/

/*
const refTodos = fbRef( getDatabase(), 'todos')
onValue( refTodos, (snapshot) => {
  if ( snapshot && snapshot.forEach ) {
    const todosArray = []
    snapshot.forEach( snap => {
      // console.log('snap is', snap)
      todosArray.push( { key: snap.key, ...snap.val() })
    })
    todos.value = [...todosArray]
  } else {
    console.log('snapshot was', snapshot )

  }

})
*/

/*
function todoTitle(todo) {
  let rtn = `key: ${todo.key} `
  if ( todo.created_ts ) {
    rtn += ` | created: ${todo.created_ts}`
  }
  if ( todo.updated_ts ) {
    rtn += ` | updated: ${todo.updated_ts}`
  }
  return rtn
}
*/

/*
async function addTodo( todoName = 'default item' ) {
  const newTodoRef = push( fbRef(getDatabase(),'todos') )
  await set( newTodoRef, {
    name: todoName,
    completed: false,
    created_ts: Date.now()
  });
  todo.value = null
}
*/

function addTodo() { }

async function onTodoCheck(todo) {
  const updateTodo = {
    name: todo.name,
    completed: todo.completed,
    updated_ts: Date.now()
  }

  update( fbRef(getDatabase(),`todos/${todo.key}`), {...updateTodo})
}

async function onAddTodo() {
  console.log('update todo', todo.value )
  addTodo( todo.value )
}

async function dropItem( key ) {
  const dropTodoRef = await remove( fbRef(getDatabase(),`todos/${key}`) )
  console.log('dropped ', dropTodoRef)
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
<!--
      There are a total of {{ todos.length }} items, of which {{ todoOpen.length }} are still open and {{ todoDone.length }} are completed.
-->
    </div>
<!--
    <button @click="addTodo">Add Item</button>
-->
    |
    <button @click="onDropCompleted">Drop Completed</button>

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
