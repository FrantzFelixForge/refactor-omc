const asana = require(`asana`);
require(`dotenv`).config();

class Section {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  /* GET /stories/{section_gid} */
  async getSection(sectionGID) {
    const { data } = await this.client.sections.getSection(sectionGID, {
      opt_fields: "name",
    });
    return data;
  }

  async getSectionsByProject(projectGID = process.env.PROJECT_GID) {
    const { data } = await this.client.sections.getSectionsForProject(
      projectGID,
      {
        opt_fields: "name",
      }
    );

    return data;
  }
  async getTasksInSection(sectionGID) {
    const { data } = await this.client.tasks.getTasksForSection(sectionGID, {
      opt_fields: "tags.name, name, completed, assignee.name",
    });
    return data;
  }
}

module.exports = Section;
