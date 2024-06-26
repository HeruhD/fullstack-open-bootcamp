const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username) return response.status(400).send('Username is required')

    if (!password) return response.status(400).send('Password is required')

    if (username.length < 3) return response.status(400).send('The username is too short')

    if (password.length < 3) return response.status(400).send('The password is too short')


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})

    response.json(users)
})

module.exports = usersRouter