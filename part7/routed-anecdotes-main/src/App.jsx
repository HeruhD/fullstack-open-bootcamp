import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom"
import useField from "./hooks"

const Menu = () => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div>
      <a href="#" style={padding}>
        anecdotes
      </a>
      <a href="#" style={padding}>
        create new
      </a>
      <a href="#" style={padding}>
        about
      </a>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find((n) => n.id === Number(id))
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>Author: {anecdote.author}</div>
      <div>More info: {anecdote.info}</div>
      <div>Votes: {anecdote.votes}</div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an incident. Occasionally humorous, anecdotes
      differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general
      than the brief tale itself, such as to characterize a person by delineating a specific quirk or trait, to communicate
      an abstract idea about a person, place, or thing through the concrete details of a short narrative. An anecdote is "a
      story with a point."
    </em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>. See{" "}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
)

const CreateNew = (props) => {
  const navigate = useNavigate()
  const content = useField("text")
  const author = useField("text")
  const info = useField("text")

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })
    props.setNotification(`Anecdote "${content.value}" created!`)
    navigate("/")
  }

  const resetFields = () => {
    content.reset()
    author.reset()
    info.reset()
  }
  //separa el reset del type, value y onChange
  const returnOnlyProps = (props) => {
    const { reset, ...inputProps } = props
    return inputProps
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input value={content.value} onChange={content.onChange} />
        </div>
        <div>
          author
          <input {...returnOnlyProps(author)} />
        </div>
        <div>
          url for more info
          <input {...returnOnlyProps(info)} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetFields}>
          reset
        </button>
      </form>
    </div>
  )
}

const Notification = ({ message }) => {
  if (!message) return null
  return <div>{message}</div>
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ])

  const [notification, setNotification] = useState("")

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification("")
      }, 5000)
    }
  }, [notification])

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
  }

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/AnecdoteList">
          AnecdoteList
        </Link>
        <Link style={padding} to="/About">
          About
        </Link>
        <Link style={padding} to="/Create">
          CreateNew
        </Link>
      </div>
      <Notification message={notification} />
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/AnecdoteList" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/About" element={<About />} />
        <Route
          path="/Create"
          element={<CreateNew addNew={addNew} setNotification={setNotification} notification={notification} />}
        />
      </Routes>
      <br />
      <Footer />
      <div>
        <i>Note app, Department of Computer Science 2024</i>
      </div>
    </Router>
  )
}

export default App
