// se conecta ao subir a pagina
const socket = io();
let connectionsUsers = [];

// exibe os usuarios que nao estao com admin_id preenchidos
socket.on("admin_list_all_users", (connections) => {
  //array para pegar os users para passar para os outros metodos
  connectionsUsers = connections;
  // insere o valor de vazio ao list_users
  document.getElementById("list_users").innerHTML = "";

  let template = document.getElementById("template").innerHTML;
  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });
    document.getElementById("list_users").innerHTML += rendered;
  });
});

// funcao criada no html do admin
function call(id) {
  // retorna o socket id de cada usuario
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === id
  );

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit("admin_user_in_support", params);

  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );

    // poderiamos ter criado pelo mustache mas vamos fazer por aqui
    messages.forEach((message) => {
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {
        //msg usuario
        createDiv.className = "admin_message_client";

        createDiv.innerHTML = `<span>${connection.user.email}</span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        //atendente
        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      }
      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    text: text.value,
    user_id: id,
  };

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs().format(
    "DD/MM/YYYY HH:mm:ss"
  )}</span>`;

  divMessages.appendChild(createDiv);

  // limpa o campo de message
  text.value = "";
}

// recebe mensagem do client
socket.on("admin_receive_message", (data) => {
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === data.socket_id
  );

  // console.log(connectionsUsers);
  // console.log(connection.socket_id);
  // console.log(data.socket_id);
  // console.log(connection);

  const divMessages = document.getElementById(
    `allMessages${connection.user_id}`
  );

  const createDiv = document.createElement("div");

  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email} </span>`;
  createDiv.innerHTML += `<span>${data.message.text} </span>`;
  createDiv.innerHTML += `<span class="admin_date"${dayjs(
    data.message.created_at
  ).format("DD/MM/YYYY HH:mm:ss")} </span>`;

  divMessages.appendChild(createDiv);
  // //retorna os dados do client (email e etc)
  // const connection = connectionsUsers.find(
  //   (connection) => (connection.socket_id = data.socket_id)
  // );
  // console.log(data);
  // console.log(connection);
  // const divMessages = document.getElementById(
  //   `allMessages"4ecddbb1-4fbf-4969-9a4c-0bb4107136ad"`
  // );

  // const createDiv = document.createElement("div");

  // createDiv.className = "admin_message_client";
  // createDiv.innerHTML = `<span>${connection.user.email}</span>`;
  // createDiv.innerHTML += `<span class="admin_date">${dayjs(
  //   data.message.created_at
  // ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  // divMessages.appendChild(createDiv);
});
