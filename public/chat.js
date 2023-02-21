const socket = io();

const urlSearch = new URLSearchParams(window.location.search);//com essa classe, temos acesso as info 
//que estão vindo da nossa url
const username = urlSearch.get('username');//os dados foram enviados pelo forms
const room = urlSearch.get('select_room');
console.log(username, room)

//enviar: emit
//receber: on

//tem o emit pelo socket e pelo io
//io pra todo mundo
//socket pra um usuário em específico

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá <strong>${username}</strong> - Você está na sala <strong>${room}</strong>`//muda o nome de usuario e da sala, a div que ta em cima do chat

socket.emit("select_room", { //informar pro servidor qual a sala que o usuário escolheu
  username,//passando parametros para a informação
  room
}, messages => {//mensagens retornadas do servidor de callback
  messages.forEach(message => createMessage(message));//para cada mensagem retornada, cria message
});

document.getElementById("message_input").addEventListener(//evento, caixa de texto
  "keypress", (event) => {
  if(event.key === 'Enter') {
    const message = event.target.value;//atribuir a variavel mensagem ao conteúdo do event

    const data = {
      room,
      message,
      username
    }

    socket.emit("message", data);//envia para o servidor a sala, mensagem e user
 
    event.target.value = "";
  }
});

socket.on("mensagem",(data)=>{
  console.log(data)//vai receber a data da mensagem
})

socket.on("message", data => {
  createMessage(data);
});

function createMessage(data) {
  const messageDiv = document.getElementById("messages");//vai pegar a div com id messages

  //+= ---> eu quero que ele sempre crie uma nova, mas não sobrescreva os que existem
  messageDiv.innerHTML +=`
  <div class="new_message">
    <label class="form-label">
      <strong>${data.username}</strong> <span>${data.text} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
    </label>
  </div>
  `;
  //innerHTML define um html dentro de javascript
};



document.getElementById("logout").addEventListener("click", (event) => {//se o button logout for clicado
  window.location.href = "index.html";//vai para o index
})