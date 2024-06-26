const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { test, after, beforeEach, describe, beforeAll } = require('node:test');
const Blog = require('../models/blog');
const assert = require('node:assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

let user
// Variable para almacenar el token de prueba
let token

// Función para generar un token de prueba válido
const generateTestToken = async () => {
    const passwordHash = await bcrypt.hash('travesera', 10);
    // const user = new User({ username: 'cantarina93', passwordHash });
    const user = new User({
        username: "cantarina93",
        name: "Angela Cantaora",
        // password: "travesera"
        passwordHash
    });
    await user.save();

    const userForToken = {
        username: user.username,
        id: user._id,
    };
    // return jwt.sign(userForToken, process.env.SECRET, { expiresIn: '7d' });
    return jwt.sign(userForToken, process.env.SECRET);
};

const initialBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: "Pizzamazing",
        author: "Johnny Pepperoni",
        url: "pizza.com",
        likes: 7,
        // user: user.id,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d19f9',
        title: "Bocadillo en la playa",
        author: "Angela",
        url: "bocaplaya.com",
        likes: 9,
        // user: jwt.decode(token).id,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f6',
        title: "Sandwich mixto",
        author: "Angela",
        url: "trancheteando.com",
        likes: 2,
        // user: user._id,
        __v: 0
    }
]

const newBlog =
{
    _id: '5a422aa71b54a676234d17c8',
    title: "Sandwich mixto newBlog",
    author: "Angela",
    url: "trancheteando.com",
    likes: 2,
    __v: 0
}

const blogLikesMissing =
{
    // _id: '5a422aa71b54a676234d17i8',
    title: "no likes blog",
    author: "Johnny Pepperoni",
    url: "pizza.com",
    // likes: 7,
    __v: 0
}

const blogTitleMissing =
{
    // _id: '5a422aa71b54a676234d11i8',
    // title: "no title blog",
    author: "Angela",
    url: "no title",
    likes: 7,
    __v: 0
}

const blogUrlMissing =
{
    // _id: '5a422aa71b54a676234w11i8',
    title: "no url blog",
    author: "Angela",
    // url: "url.com",
    likes: 7,
    __v: 0
}

const blogToDelete =
{
    // _id: '5a422aa71b54a676234d17c8',
    title: "Blog to delete",
    author: "Angela",
    url: "trancheteando.com",
    likes: 2,
    __v: 0
}






beforeEach(async () => {
    await User.deleteMany({});
    token = await generateTestToken();

    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0]) //hacer aqui un post como en el controllador?
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    // await blogObject.save()
    // blogObject = new Blog(newBlog)
    await blogObject.save()
})

after(async () => {
    await mongoose.connection.close();
});


describe("Blog api test", () => {
    test('blogs are returned as json. Blogs quantity correct', async () => {
        // console.log(token)
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test('blogs have an "id" property', async () => {
        const blogs = await Blog.find();

        blogs.forEach(blog => {
            assert.ok(blog.id, 'Expected blog to have "id" property');
        });
    });

    test('blog is created correctly', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .send(newBlog)
            .expect(201);

        const allBlogs = await Blog.find();
        assert.strictEqual(allBlogs.length, initialBlogs.length + 1);
    });

    test('If likes property missing likes = 0', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .send(blogLikesMissing)
            .expect(201);

        const allBlogs = await Blog.find();
        const savedBlogPost = await allBlogs.find(blog => blog.title === blogLikesMissing.title);

        assert.ok(savedBlogPost);
        assert.strictEqual(savedBlogPost.likes, 0);
    });
});

describe("Blog api test. Fields missing", () => {
    test('Title is missing, error 400 bad request', async () => {
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .send(blogTitleMissing)
            .expect(400);
    });

    test('Url  is missing, error 400 bad request', async () => {
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .send(blogUrlMissing)
            .expect(400);
    });
});

describe("Deleting blog", () => {
    test('Blog deleted correctly', async () => {



        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .send(blogToDelete)
            .expect(201);

        //no he econtrado otra manera que buscar el blog por nombre(tiene que ser único)
        //y a partir del nombre sacar el id
        const blogTitle = "Blog to delete"
        const blogFound = await Blog.findOne({ title: blogTitle });
        const id = blogFound._id

        await api
            // .delete(`/api/blogs/${newBlog._id}`)
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .expect(204);
    });

    test('Blog does not exist', async () => {
        const id = "5b422aa71b54a676234d12f8";
        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .expect(404);
    });
});

describe("Updating blog", () => {
    test('Blog updated correctly', async () => {
        const id = "5a422aa71b54a676234d17f8";
        await api
            .put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .expect(200);
    });

    test('Blog does not exist', async () => {
        const id = "5b422aa71b54a676234d12f8";
        await api
            .put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`) // Incluir token de autenticación
            .expect(404);
    });
});