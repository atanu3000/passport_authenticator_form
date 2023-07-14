const express = require('express');
const app = express();

// impoting all routes
const formRoutes = require('./routes/route');

//setting view engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public')); // seting public path
app.use(express.urlencoded({ extended: true })); // For Parsing URLs


app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
})

// form routes
app.use(formRoutes);