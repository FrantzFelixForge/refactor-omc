const Story = require("../controllers/story");
const asana = require(`asana`);
const { isObject } = require("../utils/testUtils");

describe("Testing the Story Controller", function () {
  let asanaStory;
  beforeEach(() => {
    asanaStory = new Story();
    jest.restoreAllMocks();
  });
  test("Object is instance of class upon creation and methods are the correct type.", async function () {
    expect(typeof asanaStory.getStory).toBe("function");
    expect(asanaStory instanceof Story).toBe(true);
    expect(isObject(asanaStory)).toBe(true);
  });

  test("getStory(storyGID): Function call with correct arguments and asana methods mocked.", async function () {
    const answer = {
      gid: "1202595252535497",
      text: "Frantz Felix assigned to morgan.fogarty@forgeglobal.com",
      target: {
        gid: "1202595252535484",
        name: "Coursera | Candance/Sarah + Alicia | $4",
      },
    };

    const storyGID = "invalid";
    const getStoryMock = jest
      .spyOn(asana.resources.Stories.prototype, "getStory")
      .mockImplementation(() => {
        return answer;
      });
    const res = await asanaStory.getStory(storyGID);
    expect(getStoryMock).toHaveBeenCalled();

    expect(res).toEqual(answer);
  });
  test("getStory(): Function call with invalid/no argument and asana methods mocked.", async function () {
    const storyGID = "invalid";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `story: Not a Long: ${storyGID}`,
            },
          ],
        },
      },
    };
    const getStoryMock = jest
      .spyOn(asana.resources.Stories.prototype, "getStory")
      .mockImplementation(() => {
        throw new Error(errorObj);
      });
    const res = await asanaStory.getStory(storyGID);
    const noArgRes = await asanaStory.getStory();
    expect(getStoryMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
    expect(noArgRes instanceof Error).toEqual(true);
  });
});
