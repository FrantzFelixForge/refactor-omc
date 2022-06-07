"use strict";

const express = require(`express`);
const morgan = require(`morgan`);
const path = require(`path`);
const routes = require(`./routes`)
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan(`dev`));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(routes);
  

app.listen(PORT, function(){
    console.log(`Server running at http://localhost:${PORT}`);
})
