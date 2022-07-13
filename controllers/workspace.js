const asana = require(`asana`);
require(`dotenv`).config();

class Workspace {
  // class methods
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }
  async getForgeWorkspace() {
    try {
      const { data } = await this.client.workspaces.getWorkspaces({
        opt_fields: "name,gid",
      });
      for (let i = 0; i < data.length; i++) {
        const workspace = data[i];
        if (workspace.name === "Forge") {
          return workspace;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Workspace;
