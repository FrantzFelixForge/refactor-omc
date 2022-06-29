const asana = require(`asana`);
require(`dotenv`).config();

class Tag {
  constructor() {
    this.client = asana.Client.create().useAccessToken(
      process.env.PERSONAL_ACCESS_TOKEN
    );
  }

  getTag(tagGID) {}
}
module.exports = Tag;
