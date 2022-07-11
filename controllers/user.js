const asana = require(`asana`);
require(`dotenv`).config();

class User {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  /* /users/{user_gid} */
  async getUser(userGID) {
    const result = await this.client.users.getUser(userGID, {
      opt_fields: "name",
    });
    return result;
  }

  async getUsersByTeam(teamGID) {
    const gid = teamGID || process.env.ENG_TEAM_GID;

    const result = await this.client.users.getUsersForTeam(gid, {
      opt_fields: "name",
    });

    return result;
  }
}

module.exports = User;
