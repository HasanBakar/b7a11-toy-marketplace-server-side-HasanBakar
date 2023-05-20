const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.send("Toy Marketplace server is ready for providing data");
});

/***
 * _______________________________________________
 * 
 * Database connection and task section start here
 * ________________________________________________
 */





/***
 * _______________________________________________
 * 
 * Database connection and task section End here
 * ________________________________________________
 */

app.listen(port, () => {
  console.log(`Toy marketplace server is running on port: ${port}`)
});
