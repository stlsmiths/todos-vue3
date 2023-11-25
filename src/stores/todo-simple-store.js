import {reactive, toRefs, readonly, computed} from 'vue'
import {fbRef} from "@/utils/firebase_config";
import {getDatabase, onValue, push, set} from "firebase/database";

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
//  const todoSort = computed( () => [...todos].reverse() )
  const todoDone = computed( () => todos.value.filter( t => t.completed ) )
  const todoOpen = computed( () => todos.value.filter( t => !t.completed ) )

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

  function addTodo( data ) {
    const addData = {...data}
    delete addData.key
    const newTodoRef = push( fbRef(getDatabase(),'todos') )
    set( newTodoRef, {
      ...addData,
      created_ts: Date.now()
    });
  }

  async function updateTodo( key, data ) {

  }

  async function dropTodo( key ) {

  }

  return {
    // state
    todos,
    user,

    // computeds
    todoSort,
    todoDone,
    todoOpen,

    // methods
    addTodo,
    setUser,
    todoTitle,
    updateTodo,
    dropTodo
  }

}
