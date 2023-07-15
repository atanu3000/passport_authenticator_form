const express = require('express');
const app = express();

// impoting all routes
const formRoutes = require('./routes/route');

//setting view engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public')); // seting public path
app.use(express.urlencoded({ extended: true })); // For Parsing URLs


app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
})

// app.use((req, res) => {
//     res.status(404).send("<h2 style='text-align: center'> Not Found</h2>");
// })

// form routes
app.use(formRoutes);