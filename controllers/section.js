const asana = require(`asana`);
require(`dotenv`).config();

class Section {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  /* GET /sections/:section_gid */
  async getSection(sectionGID) {
    try {
      const { data } = await this.client.sections.getSection(sectionGID, {
        opt_fields: "name",
      });

      return data;
    } catch (error) {
      // console.log(error.value.errors[0]);
      return error;
    }
  }

  async getSectionsByProject(projectGID = process.env.PROJECT_GID) {
    try {
      const { data } = await this.client.sections.getSectionsForProject(
        projectGID,
        {
          opt_fields: "name",
        }
      );

      return data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Section;
