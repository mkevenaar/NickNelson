import { UserModel } from './models/user.js';

export class UserService {
  /**
   * Get or Create a User entry based on its ID
   */
  static async fetchUser(key, guildId) {
    let userEntry = await UserModel.findOne({ id: key, guild: guildId });
    if (userEntry) {
      return userEntry;
    }

    userEntry = new UserModel({
      id: key,
      guild: guildId,
      registeredAt: Date.now(),
    });
    await userEntry.save().catch((err) => console.log(err));
    return userEntry;
  }
}
