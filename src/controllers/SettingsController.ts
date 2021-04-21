import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
  async create(request: Request, response: Response) {
    const { chat, username } = request.body;

    const settingsService = new SettingsService();

    try {
      const settings = await settingsService.create({ chat, username });

      return response.json(settings);
    } catch (err) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }

  async show(request: Request, response: Response) {
    const settingsService = new SettingsService();

    const settings = await settingsService.show();

    return response.json(settings);
  }
}
export { SettingsController };
