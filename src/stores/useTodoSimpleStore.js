import {reactive, toRefs, readonly, computed} from 'vue'
import {fbRef} from "@/utils/firebase_config";
import {getDatabase, onValue, push, remove, set, update} from "firebase/database";

const state = reactive({
  todos: [],
  user: null
})

export default () => {
  const { todos, user } = toRefs(state)

  // Setup Firebase state listeners ...
  const refTodos = fbRef( getDatabase(), 'todos')
  onValue( refTodos, (snapshot) => {
    if ( snapshot && snapshot.forEach ) {
      const todosArray = []
      snapshot.forEach( snap => {
        // console.log('snap is', snap)
        todosArray.push( { key: snap.key, ...snap.val() })
      })
      state.todos = [...todosArray]
    } else {
      console.log('snapshot was', snapshot )
    }
  })

  // Computeds ...
  const todoSort = computed( () => [...state.todos].reverse() )
  const todoDone = computed( () => [...state.todos].filter( t => t.completed ) )
  const todoOpen = computed( () => [...state.todos].filter( t => !t.completed ) )

  // Methods ...
  function setUser(user) {
    state.user = {...user}
  }

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

  async function addTodo( todoName = 'default todo name') {
    const newTodoRef = push( fbRef(getDatabase(),'todos') )
    await set( newTodoRef, {
      name: todoName,
      completed: false,
      created_ts: Date.now()
    });
    todo.value = null
  }

  async function updateTodo( key, data ) {
    await update( fbRef(getDatabase(),`todos/${key}`), {...data})
  }

  async function dropTodo( key ) {
    const dropTodoRef = await remove( fbRef(getDatabase(),`todos/${key}`) )
    console.log('dropped ', dropTodoRef)
  }

  return {
    // state ...
    todos,
    user,

    // computeds ...
    todoSort,
    todoDone,
    todoOpen,

    // methods ...
    todoTitle,
    setUser,
    addTodo,
    updateTodo,
    dropTodo
  }

}
