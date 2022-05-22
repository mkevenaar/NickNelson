import { InvalidPermissionException } from '../exceptions/runtime.exceptions.js';

export class botPermissions {
  userPerms = [];
  userMessage = '';
  botPerms = [];
  botMessage = '';

  constructor() {
    return this;
  }

  setUserPerms(userPerms) {
    if (!Array.isArray(userPerms)) {
      userPerms = [userPerms];
    }
    this.userPerms = userPerms;
    return this;
  }

  setUserMessage(userMessage) {
    this.userMessage = userMessage;
    return this;
  }

  setBotPerms(botPerms) {
    if (!Array.isArray(botPerms)) {
      botPerms = [botPerms];
    }
    this.botPerms = botPerms;
    return this;
  }

  setBotMessage(botMessage) {
    this.botMessage = botMessage;
    return this;
  }

  checkUserPerms(interaction) {
    if (this.userPerms.length && !interaction.member.permissions.has(this.userPerms)) {
      throw new InvalidPermissionException(
        this.userMessage ? this.userMessage : 'You do not have permission to do that!'
      );
    }
  }

  checkBotPerms(interaction) {
    if (this.botPerms.length && !interaction.guild.me.permissions.has(this.botPerms)) {
      throw new InvalidPermissionException(
        this.botMessage ? this.botMessage : 'I do not have enough permissions to do that!'
      );
    }
  }
}
