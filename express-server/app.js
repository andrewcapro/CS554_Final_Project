const express = require('express');
const app = express();
const configRoutes = require('./routes');
var cors = require('cors')
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(fileUpload());
app.use(cors());
configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});