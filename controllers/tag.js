const asana = require(`asana`);
require(`dotenv`).config();

class Tag {
  constructor() {
    this.client = asana.Client.create().useAccessToken(
      process.env.PERSONAL_ACCESS_TOKEN
    );
  }

  async getTag(tagGID) {
    const result = await client.tags.getTag(tagGID, { opt_fields: "name" });

    return result;
  }
}
module.exports = Tag;
