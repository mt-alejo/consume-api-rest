
const express = require('express');
const app = express();

app.use(express.static(__dirname))

//app.get("/", (req, res, next)=>{
 // res.sendFile(__dirname + "/public/index.html")
//})

app.listen('3000', () => {
  console.log('Servidor web escuchando en el puerto 3000');
});