const asana = require(`asana`);
require(`dotenv`).config();

class Project {
  // class methods
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }
  async getSandboxProject(teamGid = process.env.ENG_TEAM_GID) {
    try {
      const { data } = await this.client.projects.getProjectsForTeam(teamGid, {
        opt_fields: "name",
      });

      for (let i = 0; i < data.length; i++) {
        const project = data[i];
        if (project.name === "Deal Execution Pipeline (Sandbox)") {
          return project;
        }
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = Project;
