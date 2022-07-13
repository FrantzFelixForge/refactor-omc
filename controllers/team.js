const asana = require(`asana`);
require(`dotenv`).config();

class Team {
  // class methods
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }
  async getEngTeam(
    workspaceGID = process.env.WORKSPACE_GID,
    userGID = process.env.ME_GID
  ) {
    try {
      const { data } = await this.client.teams.getTeamsForUser(`${userGID}`, {
        workspace: `${workspaceGID}`,
        opt_fields: "name",
      });

      for (let i = 0; i < data.length; i++) {
        const team = data[i];
        if (team.name === "Engineering") {
          return team;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Team;
