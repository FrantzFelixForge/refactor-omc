const asana = require(`asana`);
require(`dotenv`).config();

class Task {
  constructor() {
    this.client = asana.Client.create().useAccessToken(
      process.env.PERSONAL_ACCESS_TOKEN
    );
  }

  async getTask(taskGID) {
    const result = await this.client.tasks.getTask(taskGID, {
      opt_fields: "tags.name, name, parent, completed",
    });
    return result;
  }
}

module.exports = Task;