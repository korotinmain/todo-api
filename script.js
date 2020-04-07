const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('./models/task.model');
const TaskModel = mongoose.model('task-model');

mongoose
  .connect(
    'mongodb://KorotinTodo:11223344q4@ds145083.mlab.com:45083/todo-application',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('Database has been connected');
  })
  .catch(() => {
    console.log('Connection error');
  });

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/web')));

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

app.get('/tasks', function(req, res) {
  TaskModel.find().then(tasks => res.send(tasks).json());
});

app.post('/create-task', (req, res) => {
  if (req && req.body) {
    const TaskModel = mongoose.model('task-model');
    const task = new TaskModel({
      name: req.body.name
    });
    task.save().then(() => {
      TaskModel.find().then(tasks => res.send(tasks).json());
    });
  } else {
    res.sendStatus(400);
  }
});

app.delete('/delete-task/:id', (req, res) => {
  if (req && req.params.id) {
    TaskModel.findOneAndDelete({ id: req.params.id })
      .then(tasks => res.send(tasks).json())
      .catch(() => res.sendStatus(404));
  } else {
    res.sendStatus(400);
  }
});

app.patch('/change-state/:id', (req, res) => {
  if (req && req.params.id) {
    TaskModel.findOne({ id: req.params.id }, function(err, doc) {
      doc.checked = !doc.checked;
      doc.save().then(() => {
        TaskModel.find().then(tasks => res.send(tasks).json());
      });
    });
  } else {
    res.sendStatus(400);
  }
});
app.listen(3000);
