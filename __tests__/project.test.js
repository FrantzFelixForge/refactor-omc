const Project = require("../controllers/project");
const asana = require(`asana`);
const { isObject } = require("../utils/testUtils");
describe("Testing the Project Controller", function () {
  let asanaProject;
  beforeEach(() => {
    asanaProject = new Project();
    jest.restoreAllMocks();
  });
  test("Object is instance of class upon creation and methods are the correct type.", async function () {
    expect(typeof asanaProject.getSandboxProject).toBe("function");
    expect(asanaProject instanceof Project).toBe(true);
    expect(isObject(asanaProject)).toBe(true);
  });

  test("getSandboxProject(teamGid): Function call with asana methods mocked.", async function () {
    const answer = {
      gid: "1202453205610966",
      name: "Deal Execution Pipeline (Sandbox)",
    };
    const asanaResponse = {
      data: [
        { gid: "1202402175058587", name: "Refactoring OMC" },
        { gid: "1202416797600779", name: "sandbox" },
        {
          gid: "1202453205610966",
          name: "Deal Execution Pipeline (Sandbox)",
        },
      ],
    };
    const teamGID = "1202402175058585";

    const getProjectsForTeamMock = jest
      .spyOn(asana.resources.Projects.prototype, "getProjectsForTeam")
      .mockImplementation(() => {
        return asanaResponse;
      });

    const res = await asanaProject.getSandboxProject(teamGID);
    expect(getProjectsForTeamMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getSandboxProject(): Testing default parameter assigment for getSandboxProject() function call with no arguments, asana methods mocked.", async function () {
    const answer = {
      gid: "1202453205610966",
      name: "Deal Execution Pipeline (Sandbox)",
    };
    const asanaResponse = [
      { gid: "1202402175058587", name: "Refactoring OMC" },
      { gid: "1202416797600779", name: "sandbox" },
      {
        gid: "1202453205610966",
        name: "Deal Execution Pipeline (Sandbox)",
      },
    ];

    const getProjectsForTeamMock = jest
      .spyOn(asana.resources.Projects.prototype, "getProjectsForTeam")
      .mockImplementation(() => {
        return { data: asanaResponse };
      });

    const res = await asanaProject.getSandboxProject();
    expect(getProjectsForTeamMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getSandboxProject(): Function call with invalid argument and asana methods mocked.", async function () {
    const answer = {
      gid: "1202453205610966",
      name: "Deal Execution Pipeline (Sandbox)",
    };
    const asanaResponse = [
      { gid: "1202402175058587", name: "Refactoring OMC" },
      { gid: "1202416797600779", name: "sandbox" },
      {
        gid: "1202453205610966",
        name: "Deal Execution Pipeline (Sandbox)",
      },
    ];
    const teamGID = "invalid";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `project: Not a Long: ${teamGID}`,
            },
          ],
        },
      },
    };

    const getProjectsForTeamMock = jest
      .spyOn(asana.resources.Projects.prototype, "getProjectsForTeam")
      .mockImplementation(() => {
        throw new Error(errorObj);
      });

    const res = await asanaProject.getSandboxProject("invalid");
    expect(getProjectsForTeamMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
  });
});
