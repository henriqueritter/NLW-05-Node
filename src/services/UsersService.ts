import { getCustomRepository, Repository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import { User } from "../entities/User";

class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create(email: string) {
    //check if user exists,
    const userExists = await this.usersRepository.findOne({
      email,
    });
    // if exists, return user
    if (userExists) {
      return userExists;
    }
    const user = this.usersRepository.create({
      email,
    });

    await this.usersRepository.save(user);

    //if not, save on DB,
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      email,
    });
    // if exists, return user
    if (user) {
      return user;
    } else {
      return;
    }
  }
}
export { UsersService };
