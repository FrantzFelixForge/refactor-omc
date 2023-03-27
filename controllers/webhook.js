const asana = require(`asana`);
require(`dotenv`).config();
const fetch = require(`node-fetch`);

class Webhook {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  async getWebhooks() {
    const result = await this.client.webhooks.getWebhooks({
      resource: "1202453205610966",
      workspace: "1111138376302363",
    });
    //{{ _.baseUrl }}/webhooks?resource=1202453205610966&limit=10&workspace=1111138376302363
    return result;
  }

  async createWebhook(resourceGID = process.env.PROJECT_GID) {
    const body = {
      filters: [
        {
          action: "changed",
          resource_type: "task",
          fields: ["completed", "custom_fields", "name"],
        },
        {
          action: "added",
          resource_type: "task",
        },
      ],
      resource: `${resourceGID}`,
      target: `${process.env.NGROK_URL}/api/webhooks/receiveWebhook`,
    };

    // const response = await fetch("https://app.asana.com/api/1.0/webhooks", {

    const response = await this.client.webhooks.createWebhook(body);

    return response;
  }

  async deleteWebhook(webhookGID) {
    await this.client.webhooks.deleteWebhook(webhookGID);
    return `webhook: ${webhookGID} deleted successfully`;
  }
}

module.exports = Webhook;
