import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  async create(email: string) {
    const usersRepository = getCustomRepository(UsersRepository);
    //check if user exists,
    const userExists = await usersRepository.findOne({
      email,
    });
    // if exists, return user
    if (userExists) {
      return userExists;
    }
    const user = usersRepository.create({
      email,
    });

    await usersRepository.save(user);

    //if not, save on DB,
    return user;
  }
}
export { UsersService };
