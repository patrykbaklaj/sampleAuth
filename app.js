const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home');
});




const port = 3000;
app.listen(port, () => console.log(`Serwer started at port ${port}`));