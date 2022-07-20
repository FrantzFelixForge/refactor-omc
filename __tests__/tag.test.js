const Tag = require("../controllers/tag");
const asana = require(`asana`);
const { isObject } = require("../utils/testUtils");

describe("Testing the Tag Controller", function () {
  let asanaTag;
  beforeEach(() => {
    asanaTag = new Tag();
    jest.restoreAllMocks();
  });
  test("Object is instance of class upon creation and methods are the correct type.", async function () {
    expect(typeof Tag.randomColor).toBe("function");
    expect(typeof asanaTag.getAllOpsTags).toBe("function");
    expect(typeof asanaTag.createSingleTag).toBe("function");
    expect(typeof asanaTag.generateTags).toBe("function");
    expect(typeof asanaTag.getTag).toBe("function");
    expect(typeof asanaTag.deleteTag).toBe("function");
    expect(asanaTag instanceof Tag).toBe(true);
    expect(isObject(asanaTag)).toBe(true);
  });

  test("It should generate a random color that is a valid option for tag color", async function () {
    const randomColor = Tag.randomColor();
    expect(typeof randomColor).toBe("string");
    expect(randomColor).toEqual(
      expect.stringMatching(/^dark\-[a-z]{1,}|^light\-[a-z]{1,}/)
    );
  });

  test("getAllOpsTags(workspaceGID): Function call with correct arguments and asana methods mocked.", async function () {
    const answer = [
      { gid: "1202587830145784", name: "__ISSUER__" },
      { gid: "1202587830171830", name: "__BUYER__" },
      { gid: "1202587801293058", name: "__SELLER__" },
      { gid: "1202587829357695", name: "__LEGAL__" },
      { gid: "1202587829537531", name: "__OPS__" },
      { gid: "1202587801384909", name: "__DEAL__" },
    ];
    const asanaResponse = {
      data: [
        {
          gid: "1111635794068771",
          name: "In Jira",
        },
        {
          gid: "1111635794068772",
          name: "jira ",
        },
        {
          gid: "1112350295521219",
          name: "Ready For Jira",
        },
        {
          gid: "1112350295521221",
          name: "Ready For Jira",
        },
        {
          gid: "1112358470258445",
          name: "Story",
        },
        {
          gid: "1112358470258446",
          name: "Jira Story",
        },
        {
          gid: "1112358470258447",
          name: "Jira Bug",
        },
        {
          gid: "1112358470258448",
          name: "Jira Epic",
        },
        {
          gid: "1112358470258449",
          name: "Jira Bug",
        },
        {
          gid: "1112358470258450",
          name: "Jira Story",
        },
        {
          gid: "1112358470258456",
          name: "Jira Bug",
        },
        {
          gid: "1112358470258457",
          name: "Jira Epic",
        },
        {
          gid: "1117961418004151",
          name: "SPV",
        },
        {
          gid: "1117961418004154",
          name: "Forward",
        },
        {
          gid: "1120656232325944",
          name: "DealEngine",
        },
        {
          gid: "1120656232325955",
          name: "Crypto",
        },
        {
          gid: "1120656232325956",
          name: "cryp",
        },
        {
          gid: "1120679856266619",
          name: "Marketing",
        },
        {
          gid: "1120935668217065",
          name: "FCS",
        },
        {
          gid: "1199657015500431",
          name: "MKPL",
        },
        {
          gid: "1199657015500432",
          name: "FCS",
        },
        {
          gid: "1199657015500433",
          name: "Other",
        },
        {
          gid: "1199618829147004",
          name: "Trust",
        },
        {
          gid: "1199618829147005",
          name: "strategic",
        },
        {
          gid: "1199618829147006",
          name: "Strategic",
        },
        {
          gid: "1199929435855852",
          name: "Data",
        },
        {
          gid: "1200040173671297",
          name: "Direct",
        },
        {
          gid: "1200040173671298",
          name: "Direct",
        },
        {
          gid: "1200280813584963",
          name: "Ideation",
        },
        {
          gid: "1202286140894845",
          name: "Update Fcst",
        },
        {
          gid: "1202286140894849",
          name: "No update required",
        },
        {
          gid: "1202307674465132",
          name: "No need to update",
        },
        {
          gid: "1202286140894991",
          name: "Allocations",
        },
        {
          gid: "1202307674465134",
          name: "Unsure",
        },
        {
          gid: "1202307674465136",
          name: "Update",
        },
        {
          gid: "1202286140895005",
          name: "Product re-org",
        },
        {
          gid: "1202308037098116",
          name: "Severance",
        },
        {
          gid: "1202308037098129",
          name: "Benefits Planning Miss",
        },
        {
          gid: "1202308037098135",
          name: "Slower hiring",
        },
        {
          gid: "1202308037098137",
          name: "Revenue unfavorability",
        },
        {
          gid: "1202308037098149",
          name: "RSU approval timing",
        },
        {
          gid: "1202308037098156",
          name: "Low utilization of training budget",
        },
        {
          gid: "1202308037098175",
          name: "software cap",
        },
        {
          gid: "1202308037098214",
          name: "rev",
        },
        {
          gid: "1202308037098219",
          name: "SPAC",
        },
        {
          gid: "1202326441458958",
          name: "stock comp",
        },
        {
          gid: "1202587830145784",
          name: "__ISSUER__",
        },
        {
          gid: "1202587830171830",
          name: "__BUYER__",
        },
        {
          gid: "1202587801293058",
          name: "__SELLER__",
        },
        {
          gid: "1202587829357695",
          name: "__LEGAL__",
        },
        {
          gid: "1202587829537531",
          name: "__OPS__",
        },
        {
          gid: "1202587801384909",
          name: "__DEAL__",
        },
      ],
      next_page: null,
    };

    const workspaceGID = "1111138376302363";
    const getTagsMock = jest
      .spyOn(asana.resources.Tags.prototype, "getTags")
      .mockImplementation(() => {
        return asanaResponse;
      });
    const res = await asanaTag.getAllOpsTags(workspaceGID);
    expect(getTagsMock).toHaveBeenCalled();

    expect(res).toEqual(answer);
  });
  test("getAllOpsTags(): Testing default parameter assigment for getAllOpsTags() function call with no arguments, asana methods mocked.", async function () {
    const answer = [
      { gid: "1202587830145784", name: "__ISSUER__" },
      { gid: "1202587830171830", name: "__BUYER__" },
      { gid: "1202587801293058", name: "__SELLER__" },
      { gid: "1202587829357695", name: "__LEGAL__" },
      { gid: "1202587829537531", name: "__OPS__" },
      { gid: "1202587801384909", name: "__DEAL__" },
    ];
    const asanaResponse = {
      data: [
        {
          gid: "1111635794068771",
          name: "In Jira",
        },
        {
          gid: "1111635794068772",
          name: "jira ",
        },
        {
          gid: "1112350295521219",
          name: "Ready For Jira",
        },
        {
          gid: "1112350295521221",
          name: "Ready For Jira",
        },
        {
          gid: "1112358470258445",
          name: "Story",
        },
        {
          gid: "1112358470258446",
          name: "Jira Story",
        },
        {
          gid: "1112358470258447",
          name: "Jira Bug",
        },
        {
          gid: "1112358470258448",
          name: "Jira Epic",
        },
        {
          gid: "1112358470258449",
          name: "Jira Bug",
        },
        {
          gid: "1112358470258450",
          name: "Jira Story",
        },
        {
          gid: "1112358470258456",
          name: "Jira Bug",
        },
        {
          gid: "1112358470258457",
          name: "Jira Epic",
        },
        {
          gid: "1117961418004151",
          name: "SPV",
        },
        {
          gid: "1117961418004154",
          name: "Forward",
        },
        {
          gid: "1120656232325944",
          name: "DealEngine",
        },
        {
          gid: "1120656232325955",
          name: "Crypto",
        },
        {
          gid: "1120656232325956",
          name: "cryp",
        },
        {
          gid: "1120679856266619",
          name: "Marketing",
        },
        {
          gid: "1120935668217065",
          name: "FCS",
        },
        {
          gid: "1199657015500431",
          name: "MKPL",
        },
        {
          gid: "1199657015500432",
          name: "FCS",
        },
        {
          gid: "1199657015500433",
          name: "Other",
        },
        {
          gid: "1199618829147004",
          name: "Trust",
        },
        {
          gid: "1199618829147005",
          name: "strategic",
        },
        {
          gid: "1199618829147006",
          name: "Strategic",
        },
        {
          gid: "1199929435855852",
          name: "Data",
        },
        {
          gid: "1200040173671297",
          name: "Direct",
        },
        {
          gid: "1200040173671298",
          name: "Direct",
        },
        {
          gid: "1200280813584963",
          name: "Ideation",
        },
        {
          gid: "1202286140894845",
          name: "Update Fcst",
        },
        {
          gid: "1202286140894849",
          name: "No update required",
        },
        {
          gid: "1202307674465132",
          name: "No need to update",
        },
        {
          gid: "1202286140894991",
          name: "Allocations",
        },
        {
          gid: "1202307674465134",
          name: "Unsure",
        },
        {
          gid: "1202307674465136",
          name: "Update",
        },
        {
          gid: "1202286140895005",
          name: "Product re-org",
        },
        {
          gid: "1202308037098116",
          name: "Severance",
        },
        {
          gid: "1202308037098129",
          name: "Benefits Planning Miss",
        },
        {
          gid: "1202308037098135",
          name: "Slower hiring",
        },
        {
          gid: "1202308037098137",
          name: "Revenue unfavorability",
        },
        {
          gid: "1202308037098149",
          name: "RSU approval timing",
        },
        {
          gid: "1202308037098156",
          name: "Low utilization of training budget",
        },
        {
          gid: "1202308037098175",
          name: "software cap",
        },
        {
          gid: "1202308037098214",
          name: "rev",
        },
        {
          gid: "1202308037098219",
          name: "SPAC",
        },
        {
          gid: "1202326441458958",
          name: "stock comp",
        },
        {
          gid: "1202587830145784",
          name: "__ISSUER__",
        },
        {
          gid: "1202587830171830",
          name: "__BUYER__",
        },
        {
          gid: "1202587801293058",
          name: "__SELLER__",
        },
        {
          gid: "1202587829357695",
          name: "__LEGAL__",
        },
        {
          gid: "1202587829537531",
          name: "__OPS__",
        },
        {
          gid: "1202587801384909",
          name: "__DEAL__",
        },
      ],
      next_page: null,
    };

    const workspaceGID = "1111138376302363";
    const getTagsMock = jest
      .spyOn(asana.resources.Tags.prototype, "getTags")
      .mockImplementation(() => {
        return asanaResponse;
      });
    const res = await asanaTag.getAllOpsTags(workspaceGID);
    expect(getTagsMock).toHaveBeenCalled();

    expect(res).toEqual(answer);
  });
  test("getAllOpsTags(): Function call with invalid argument and asana methods mocked.", async function () {
    const workspaceGID = "invalid";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `tag: Not a Long: ${workspaceGID}`,
            },
          ],
        },
      },
    };
    const getTagsMock = jest
      .spyOn(asana.resources.Tags.prototype, "getTags")
      .mockImplementation(() => {
        throw new Error(errorObj);
      });
    const res = await asanaTag.getAllOpsTags(workspaceGID);
    expect(getTagsMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
  });
});
