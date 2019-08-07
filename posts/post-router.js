const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {  
        const posts = await db('posts');
        // const posts = await db.select('*').from('posts'); // another way, similar to sql syntax to read the db
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "error getting posts", error: error });
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const [post] = await db.select("*").from("posts").where({id});
        // const [post] = await db.("posts").where({id}); is shortcut for line above
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: `could not find post with id ${id}` });
        }
    } catch (error) {
        res.status(500).json({ message: "error getting the post", error: error });
    }
});

router.post('/', async (req, res) => {
    const postData = req.body;
    
    try {
        const post = await db("posts").insert(postData);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "error creating the post" });
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    try {
        const count = await db("posts").where("id", "=", id).update(changes);
        // const count = await db("posts").where({id}).update(changes); // same as above
        if (count) {
            res.status(200).json({ updated: count });
        } else {
            res.status(404).json({ message: `post #${id} not found` });
        }
    } catch (error) {
        res.status(500).json({ message: "could not update the post", error: error });
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    
    try {
        const count = await db("posts").where({id}).del();
        if (count) {
            res.status(200).json({ deleted: count });
        } else {
            res.status(404).json({ message: `post #${id} couldn't be removed` });
        }
    } catch (error) {
        res.status(500).json({ message: "error deleting post" });
    }
});

module.exports = router;