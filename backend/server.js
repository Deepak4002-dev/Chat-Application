import app from "./app.js";
import { Server } from "socket.io";
import {createServer} from 'http'
import {PORT} from './config/constants.js'


const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:'http://localhost:5173',
    methods:['POST','GET','PATCH','PUT','DELETE']
  }
})


io.on("connection",(socket)=>{
  socket.on("eventName",(data)=>{})

  socket.on("disconnect",()=>{
    console.log(`User ID ${socket.id} disconnected succesfully`);
  })

})

server.listen(PORT,()=>{
  console.log(`Server is running at ${PORT} `)
})