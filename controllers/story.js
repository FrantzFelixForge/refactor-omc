const asana = require(`asana`);
require(`dotenv`).config();

class Story {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  /* GET /stories/{story_gid} */
  async getStory(storyGID) {
    const result = await this.client.stories.getStory(storyGID, {
      opt_fields: "text,target.name",
    });
    return result;
  }
}

module.exports = Story;
