const asana = require(`asana`);
require(`dotenv`).config();

class Tag {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }
  static randomColor() {
    const tagColorArray = [
      "dark-pink",
      "dark-green",
      "dark-blue",
      "dark-red",
      "dark-teal",
      "dark-brown",
      "dark-orange",
      "dark-purple",
      "dark-warm-gray",
      "light-pink",
      "light-green",
      "light-blue",
      "light-red",
      "light-teal",
      "light-brown",
      "light-orange",
      "light-purple",
      "light-warm-gray",
    ];
    return tagColorArray[Math.floor(Math.random() * tagColorArray.length)];
  }

  async getAllOpsTags(workspaceGID = process.env.WORKSPACE_GID) {
    const client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
    const { data } = await this.client.tags.getTags({
      workspace: workspaceGID,
      opt_fields: "gid",
      opt_fields: "name",
      limit: 100,
    });
    const operationTagsArr = data.filter(function (tag) {
      if (tag.name.includes("__")) {
        return true;
      }
    });
    return operationTagsArr;
  }
  async createSingleTag(workspaceGID = process.env.WORKSPACE_GID, tagName) {
    console.log(`Creating single tag ${tagName}`);
    const tag = await this.client.tags.createTag({
      color: Tag.randomColor(),
      name: tagName,
      workspace: workspaceGID,
    });
    return tag;
  }
  async generateTags(workspaceGID = process.env.WORKSPACE_GID) {
    const tagObjArray = await this.getAllOpsTags(workspaceGID);
    let currentTagArray = [];
    const completeTagArray = [
      "__ISSUER__",
      "__BUYER__",
      "__SELLER__",
      "__LEGAL__",
      "__OPS__",
      "__DEAL__",
      "__DOCUMENT__",
    ];
    tagObjArray.forEach(function (tag) {
      currentTagArray.push(tag.name);
    });
    //delete if I don't have all the tags
    if (currentTagArray.length < 7) {
      console.log("Some tags are missing, recreating now...");
      for (let i = 0; i < tagObjArray.length; i++) {
        const { gid } = tagObjArray[i];
        await this.deleteTag(gid);
      }
      currentTagArray = [];
    }
    for (let i = 0; i < completeTagArray.length; i++) {
      const tagName = completeTagArray[i];
      if (!currentTagArray.includes(tagName)) {
        const { name, gid } = await this.createSingleTag(workspaceGID, tagName);
        const tagObj = { name, gid };
        tagObjArray.push(tagObj);
        console.log(`Created tag ${tagName}`, " \n", tagObj);
      }
    }

    const tagsObj = {};
    tagObjArray.map(function (tag) {
      tagsObj[tag.name] = tag.gid;
    });

    return tagsObj;
  }
  async getTag(tagGID) {
    const result = await this.client.tags.getTag(tagGID, {
      opt_fields: "name",
    });

    return result;
  }
  async deleteTag(tagGID) {
    await this.client.tags.deleteTag(tagGID);
    console.log(`Deleted tag ${tagGID}`);
  }
}
module.exports = Tag;
