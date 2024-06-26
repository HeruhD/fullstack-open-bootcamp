import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import CreateBlogForm from "./components/CreateBlogForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  // const [title, setTitle] = useState("")
  // const [author, setAuthor] = useState("")
  // const [url, setUrl] = useState("")

  const [notificationMessage, setNotificationMessage] = useState("")
  const [typeMessage, setTypeMessage] = useState()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, []) // no es lo ideal pero hace un intento de refrescar los blogs automáticamente

  const correctNotification = () => {
    setTypeMessage("correct")
    setNotificationMessage(`blog added correctly`)
    setTimeout(() => {
      setTypeMessage(null)
      setNotificationMessage(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setTypeMessage("error")
      setNotificationMessage(`${exception.response.data.error}`)

      setTimeout(() => {
        setTypeMessage(null)
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    location.reload()
  }

  // Obtener el valor de "loggedBlogAppUser" del localStorage
  const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
  // Convertir el valor JSON a un objeto JavaScript
  const loggedUser = JSON.parse(loggedUserJSON)

  // const handleSubmit = (event) => {
  //   const blogObject = {
  //     title: title,
  //     author: author,
  //     url: url,
  //   }
  //   blogService.create(blogObject).then((returnedBlog) => {
  //     setBlogs((blogs) => [...blogs, { ...returnedBlog, user: loggedUser }])
  //   })

  //   setTypeMessage("correct")
  //   setNotificationMessage(`blog added correctly`)
  //   setTimeout(() => {
  //     setTypeMessage(null)
  //     setNotificationMessage(null)
  //   }, 5000)
  // }

  const sortByLikes = (a, b) => {
    return b.likes - a.likes // Orden descendente
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      // ...blog,
      likes: blog.likes + 1,
    }

    await blogService.update(blog.id, updatedBlog)
    // setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlogs : b)))

    blogService.getAll().then((blogs) => setBlogs(blogs))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove ${blog.title}?`)) {
      await blogService.remove(blog.id)

      blogService.getAll().then((blogs) => setBlogs(blogs))
      // onRemove()
    }
  }

  //RENDER
  if (user === null) {
    return (
      <div>
        <Notification notificationMessage={notificationMessage} typeMessage={typeMessage} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          password={password}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      </div>
    )
  } else {
    return (
      <div>
        <Notification notificationMessage={notificationMessage} typeMessage={typeMessage} />
        <div>
          <h2>blogs</h2>
          <h3>{loggedUser.name}</h3>

          {blogs.sort(sortByLikes).map((blog) => (
            <Blog user={user} handleLike={handleLike} handleRemove={handleRemove} key={blog.id} blog={blog} />
          ))}
        </div>

        <CreateBlogForm
          // onSubmit={handleSubmit}
          correctNotification={correctNotification}
          blogs={blogs}
          setBlogs={setBlogs}
          user={user}
          // title={title}
          // handleTitleChange={(value) => setTitle(value)} //este es que funciona
          // author={author}
          // handleAuthorChange={({ target }) => setAuthor(target.value)}
          // url={url}
          // handleUrlChange={({ target }) => setUrl(target.value)}
        />
        <button onClick={handleLogOut}>Log out</button>
      </div>
    )
  }
}

export default App
