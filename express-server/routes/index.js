const users = require('./users');
const exercises = require('./exercises')
const posts = require("./posts")

const constructorMethod = (app) => {
  app.use('/users', users);
  app.use('/exercises', exercises)
  app.use('/posts', posts)
  app.use('*', (req, res) => {
    res.status(404).json({error: "Page not Found", status: 404});
  });
};

module.exports = constructorMethod;