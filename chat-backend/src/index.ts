import express,{ Express,Request,Response } from 'express';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Socket,Server } from 'socket.io';
import cors from 'cors';
config();

const port: string|number = process.env.PORT || 3000;
if(!port){
    console.log('the environment variables are not configured correctly');
    process.exit();
}

const app:Express = express();
app.use(cors({
    origin:'*'
}))
const http = createServer(app);
const io = new Server(http,{
    cors:{
        origin:'*'
    }
});

io.on('connection',(socket):void=>{
    console.log('a new cliet has connnected');

    socket.on('disconnect',():void=>{
        console.log('a client has disconnected')
    })

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });
})

app.get('/',(req,res)=>{
    res.json({
        msg:'u have reached aayushs server'
    })
})


http.listen(port,():void=>console.log(`listening on port ${port}`));
