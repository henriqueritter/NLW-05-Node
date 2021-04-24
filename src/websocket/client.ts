import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

interface IParams {
  text: string;
  email: string;
}

io.on("connect", (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;

    // força a entrada do tipo string nos parametros
    const { text, email } = params as IParams;
    // variavel let para pegar o user id para salvar a msg na table
    let user_id = null;

    const userExists = await usersService.findByEmail(email);

    if (!userExists) {
      const user = await usersService.create(email);

      await connectionsService.create({
        socket_id,
        user_id: user.id,
      });
      // Seta o id do usuario para criar a msg
      user_id = user.id;
    } else {
      // Seta o ID do usuario para criar a msg
      user_id = userExists.id;
      const connection = await connectionsService.findByUserId(userExists.id);

      if (!connection) {
        await connectionsService.create({
          socket_id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket_id;
        await connectionsService.create(connection);
      }
    }

    await messagesService.create({
      text,
      user_id,
    });

    // list user messages
    const allMessages = await messagesService.listByUser(user_id);

    // emit evento que sera ouvido pelo public/js/chat.js
    socket.emit("client_list_all_messages", allMessages);

    // Exibe novo usuario sem atendimento na tela do admin
    const allUsers = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;

    // id do socket do usuario
    const socket_id = socket.id;
    // recupera o id do usuario pelo socket
    const { user_id } = await connectionsService.findBySocketID(socket_id);

    const message = await messagesService.create({
      text,
      user_id,
    });

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id,
    });
  });
});
