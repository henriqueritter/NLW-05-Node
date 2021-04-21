import { getCustomRepository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { response } from "express";

interface ISettingsCreate {
  chat: boolean;
  username: string;
}
class SettingsService {
  async create({ chat, username }: ISettingsCreate) {
    const settingsRepository = getCustomRepository(SettingsRepository);

    const userAlreadyExists = await settingsRepository.findOne({ username });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    const settings = settingsRepository.create({
      chat,
      username,
    });

    await settingsRepository.save(settings);

    return settings;
  }

  async show() {
    const settingsRepository = getCustomRepository(SettingsRepository);

    const settings = settingsRepository.find();

    if (!settings) {
      throw new Error("Cant find any Setting");
    }

    return settings;
  }
}

export { SettingsService };
