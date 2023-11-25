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
        console.log('snap is', snap)
        todosArray.push( { key: snap.key, ...snap.val() })
      })
      state.todos = [...todosArray]
    } else {
      console.log('snapshot was', snapshot )
    }
  })

  return {
    todos,
    user
  }
}
