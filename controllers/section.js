const asana = require(`asana`);
require(`dotenv`).config();

class Section {
  constructor() {
    this.client = asana.Client.create().useAccessToken(
      process.env.PERSONAL_ACCESS_TOKEN
    );
  }

  /* GET /stories/{section_gid} */
  async getSection(sectionGID) {
    const result = await this.client.sections.getSection(sectionGID, {
      opt_fields: "name",
    });
    return result;
  }

  async getSectionsByProject(projectGID) {
    const { data } = await client.sections.getSectionsForProject(projectGID, {
      opt_fields: "name",
    });

    return data;
  }
}

module.exports = Section;
