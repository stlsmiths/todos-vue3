<script setup>
import {ref,computed,watch} from 'vue'
import useTodoSimpleStore from "@/stores/useTodoSimpleStore";

const { todos, todoDone, todoSort, todoOpen,
  addTodo, updateTodo, dropTodo
} = useTodoSimpleStore()

const listState = ref('all')
const title = ref()
const editTodo = ref()
const editTitle = ref()

const todoList = computed( () => {
  let rtn = []
  if ( listState.value === 'all') {
    rtn = [...todoSort.value]
  } else if ( listState.value === 'open') {
    rtn = [...todoOpen.value]
  } else {
    rtn = [...todoDone.value]
  }
  return rtn
})

const itemCount = computed( () => {
  const open = todoList.value // .filter( t => !t.completed )
  const plural = open.length > 1 ? 's' : ''
  return `${open.length} item${plural} left`}
)

function onToggleAll(evt) {
  const checked = evt.target.checked
  console.log('toggle all', checked )
  todos.value.forEach( t => {
    t.completed = checked
    onCheckTodo(t)
  })
}

async function onAddTodo() {
  if (title.value) {
    await addTodo( title.value )
  }
  title.value = null
}

async function onCheckTodo(todo) {
  await updateTodo(todo.key, {...todo})
}

async function onEditTodo(todo) {
  console.log('edit', todo)
  editTodo.value = todo
  editTitle.value = todo.name
}

async function onEditTodoSave(todo) {
  console.log('save Edit!', editTitle.value, todo)
  if ( editTitle.value && editTitle.value !== todo.name ) {
    await updateTodo( todo.key, { ...todo, name: editTitle.value })
  }
  editTodo.value = null
  editTitle.value = null
}

async function onDropTodo(todo) {
  if ( todo?.key ) {
    await dropTodo( todo.key )
  }
}

async function onDropCompleted() {
  todos.value.filter( t => t.completed )
    .map( tc => {
        dropTodo( tc.key )
    })
}
</script>

<template>
  <section class="todoapp">

    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus
             v-model="title"
             @keydown.enter.tab="onAddTodo"
      >
    </header>

    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox"
             @click="onToggleAll($event)">
      <label for="toggle-all">Mark all as complete</label>

      <ul class="todo-list">
        <li v-for="todo in todoList"
            :class="{completed: todo.completed, editing: editTodo === todo}"
            @dblclick="onEditTodo(todo)"
        >
          <div class="view">
            <input type="checkbox" class="toggle"
                   v-model="todo.completed"
                   @update:model-value="onCheckTodo(todo)"
            />
            <label >{{ todo.name }}</label>
            <button class="destroy" @click="onDropTodo(todo)"></button>
          </div>
            <input type="text" class="edit"
                   v-model="editTitle"
                   @keydown.enter.tab="onEditTodoSave(todo)"
            />
        </li>
      </ul>

      <footer class="footer">
        <span class="todo-count">
          {{ itemCount }}
        </span>
        <ul class="filters">
          <li>
            <a @click="listState = 'all'"
               :class="{'selected': listState==='all'}"
            >All</a>
          </li>
          <li>
            <a @click="listState = 'open'"
               :class="{'selected': listState==='open'}"
            >Active</a>
          </li>
          <li>
            <a @click="listState = 'done'"
               :class="{'selected': listState==='done'}"
            >Completed</a>
          </li>
        </ul>
        <button class="clear-completed" @click="onDropCompleted">Clear completed</button>
      </footer>
    </section>

  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>

</template>

<style>

</style>
