const express = require('express');
const mongodb = require('mongodb').MongoClient;

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

mongodb.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(PORT, () => console.log(`Connected on localhost: ${PORT}`));