//servidor do socket
//ele é mais utilizado em caso de real time
import { io } from "./http";

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;//sala
  text: string;//texto
  createdAt: Date;//data de criação
  username: string;//user
}

const users: RoomUser[] = [];//armazenamento
const messages: Message[] = [];

io.on("connection", (socket) => {//conectar e gera um socket
  socket.on("select_room", (data, callback) => {//recebeu a informação do emit client
    socket.join(data.room);//vai entrar na sala selecionada
    console.log(data)

    //callback= retorna todo as mensagens que já existiram na sala

    const userInRoom = users.find(//verifica se o user do armazenamento do servidor é igual ao user do client
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {//verifica se o usuario já esta dentro dessa sala
      //pra evitar criação de sockets toda vez que refresh
      userInRoom.socket_id = socket.id;
    } else {
      users.push({//armazena a informação dentro da array
        room: data.room,
        username: data.username,
        socket_id: socket.id,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });

  socket.on("message", (data) => {//o ideal é armazenar no banco de dados, pq após fechar o servidor as mensagem tbm irão sumir
    //salvar mensagem:
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date(),
    };

    messages.push(message);

    //enviar mensaggem
    io.to(data.room).emit("message", message);//vou enviar essa mensagem para todos da sala
    //to=sala que vai receber a informação
    //emit: mensagem
        
  });
});

function getMessagesRoom(room: string) {//passa a sala por parametro
  const messagesRoom = messages.filter((message) => message.room === room);//retorna todas as mensagens da sala
  return messagesRoom;//ele retorna a variável pro chat.js
}
