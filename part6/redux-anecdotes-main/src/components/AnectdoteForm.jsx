import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdotes"

export const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ""

    dispatch(createAnecdote(content))
    dispatch(setNotification(`You created: '${content}'`, 5))
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type={"submit"}>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
