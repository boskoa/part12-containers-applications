const express = require('express');
const { Todo } = require('../mongo');
const { getAsync, setAsync } = require('../redis');
const router = express.Router();

const counter = async () =>{
  const count = await getAsync('count')
  return count ? setAsync('count', parseInt(count) + 1) : setAsync('count', 1)
}

router.get('/statistics', async (_, res) => {
  //const prev = await Todo.countDocuments({})
  //await setAsync('count', parseInt(prev))
  const count = await getAsync('count')
  res.json({ 'added_todos': count || 0 })
})

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  counter()
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo
  todo ? res.json(todo) : res.send(todo); // Implemented this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const body = req.body
  const updatedTodo = req.todo

  await updatedTodo.updateOne({ ...body })
  updatedTodo ? res.json(updatedTodo) : res.sendStatus(405) // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
