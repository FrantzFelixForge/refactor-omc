const asana = require(`asana`);
require(`dotenv`).config();

class User {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  /* /users/{user_gid} */
  async getUser(userGID = this.getMe().gid) {
    try {
      const result = await this.client.users.getUser(userGID, {
        opt_fields: "name",
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  async getUsersByTeam(teamGID = process.env.ENG_TEAM_GID) {
    try {
      const { data } = await this.client.users.getUsersForTeam(teamGID, {
        opt_fields: "name",
      });

      return data;
    } catch (error) {
      return error;
    }
  }
  async getMe() {
    try {
      const me = await this.client.users.me();
      return me;
    } catch (error) {
      return error;
    }
  }
}

module.exports = User;
