const User = require("../controllers/user");
const asana = require(`asana`);
const { isObject } = require("../utils/testUtils");
describe("Testing the User Controller", function () {
  let asanaUser;
  beforeEach(() => {
    asanaUser = new User();
    jest.restoreAllMocks();
  });
  test("Object is instance of class upon creation and methods are the correct type.", async function () {
    // console.log(typeof asanaUser.getUser);
    expect(typeof asanaUser.getUser).toBe("function");
    expect(typeof asanaUser.getUsersByTeam).toBe("function");
    expect(typeof asanaUser.getMe).toBe("function");
    expect(asanaUser instanceof User).toBe(true);
    expect(isObject(asanaUser)).toBe(true);
  });

  test("getMe(): Function call with asana me method mocked.", async function () {
    const answer = {
      gid: "1202402171924303",
      email: "frantz.felix@forgeglobal.com",
      name: "Frantz Felix",
      photo: null,
      resource_type: "user",
      workspaces: [
        {
          gid: "1111138376302363",
          name: "Forge",
          resource_type: "workspace",
        },
      ],
    };

    const meMock = jest
      .spyOn(asana.resources.Users.prototype, "me")
      .mockImplementation(() => {
        return answer;
      });

    const res = await asanaUser.getMe();
    expect(meMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });

  test("getUser(userGID): Function call with userGID argument and asana getUser method mocked", async function () {
    const myUserGID = "1202402171924303";
    const answer = {
      gid: "1202402171924303",
      name: "Frantz Felix",
    };
    const getUserMock = jest
      .spyOn(asana.resources.Users.prototype, "getUser")
      .mockImplementation(() => {
        return answer;
      });

    const res = await asanaUser.getUser(myUserGID);
    expect(getUserMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getUser(userGID): Function call with invalid userGID argument and asana getUser method mocked", async function () {
    const myUserGID = "invalidGID";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `user: Not a recognized ID: ${myUserGID}`,
            },
          ],
        },
      },
    };

    const getUserMock = jest
      .spyOn(asana.resources.Users.prototype, "getUser")
      .mockImplementation(() => {
        throw new Error(errorObj);
      });
    const res = await asanaUser.getUser(myUserGID);
    expect(getUserMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
    // expect(() => {
    //   asanaUser.getUser(myUserGID).toThrow(errorObj);
    // });
  });
  test("getUser(): Testing default parameter assigment for getUser() function call with no arguments, asana methods mocked. ", async function () {
    const answer = {
      gid: "1202402171924303",
      name: "Frantz Felix",
    };
    const getMeAnswer = {
      gid: "1202402171924303",
      email: "frantz.felix@forgeglobal.com",
      name: "Frantz Felix",
      photo: null,
      resource_type: "user",
      workspaces: [
        {
          gid: "1111138376302363",
          name: "Forge",
          resource_type: "workspace",
        },
      ],
    };
    const getUserMock = jest
      .spyOn(asana.resources.Users.prototype, "getUser")
      .mockImplementation(() => {
        return answer;
      });
    const meMock = jest
      .spyOn(asana.resources.Users.prototype, "me")
      .mockImplementation(() => {
        return getMeAnswer;
      });

    const res = await asanaUser.getUser();
    expect(getUserMock).toHaveBeenCalled();
    expect(meMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getUsersByTeam(teamGID): Function call with teamGID argument and asana getUsersForTeam method mocked", async function () {
    const answer = [
      {
        gid: "1202402171924303",
        name: "Frantz Felix",
      },
      {
        gid: "1202466673579012",
        name: "morgan.fogarty@forgeglobal.com",
      },
      {
        gid: "1201648898281705",
        name: "Naresh Sikha",
      },
      {
        gid: "1202377215877920",
        name: "Pete van Wesep",
      },
    ];
    const teamGID = "1202402175058585";
    const getUsersForTeamMock = jest
      .spyOn(asana.resources.Users.prototype, "getUsersForTeam")
      .mockImplementation(async () => {
        return { data: answer };
      });

    const res = await asanaUser.getUsersByTeam(teamGID);
    expect(getUsersForTeamMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getUsersByTeam(teamGID): Function call with invalid teamGID argument and asana getUsersForTeam method mocked", async function () {
    const teamGID = "invalid";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `team: Not a Long: ${teamGID}`,
            },
          ],
        },
      },
    };
    const getUsersForTeamMock = jest
      .spyOn(asana.resources.Users.prototype, "getUsersForTeam")
      .mockImplementation(async () => {
        throw new Error(errorObj);
      });

    const res = await asanaUser.getUsersByTeam(teamGID);
    expect(getUsersForTeamMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
  });
  test("getUsersByTeam(): Testing default parameter assigment for getUsersByTeam() function call with no arguments, asana methods mocked.", async function () {
    const answer = [
      {
        gid: "1202402171924303",
        name: "Frantz Felix",
      },
      {
        gid: "1202466673579012",
        name: "morgan.fogarty@forgeglobal.com",
      },
      {
        gid: "1201648898281705",
        name: "Naresh Sikha",
      },
      {
        gid: "1202377215877920",
        name: "Pete van Wesep",
      },
    ];
    const teamGID = "1202402175058585";
    const getUsersForTeamMock = jest
      .spyOn(asana.resources.Users.prototype, "getUsersForTeam")
      .mockImplementation(async () => {
        return { data: answer };
      });

    const res = await asanaUser.getUsersByTeam(teamGID);
    expect(getUsersForTeamMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
});
