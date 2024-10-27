const {initializeDb} = require("./db");
const express = require("express");
const cors = require("cors");

// get different routes
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const userRoutes = require("./routes/user")

const app = express();

app.use(express.json());
app.use(cors());

initializeDb();

// default route for application
app.get('/', (req,res)=>{
    res.send('Hi World');
})

// other routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);


app.listen(3000, ()=>console.log("server listening on port 3000"))
