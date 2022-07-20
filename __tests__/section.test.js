const Section = require("../controllers/section");
const asana = require(`asana`);
const { isObject } = require("../utils/testUtils");
describe("Testing the Section Controller", function () {
  let asanaSection;
  beforeEach(() => {
    asanaSection = new Section();
    jest.restoreAllMocks();
  });
  test("Object is instance of class upon creation and methods are the correct type.", async function () {
    expect(typeof asanaSection.getSection).toBe("function");
    expect(typeof asanaSection.getSectionsByProject).toBe("function");
    expect(asanaSection instanceof Section).toBe(true);
    expect(isObject(asanaSection)).toBe(true);
  });

  test("getSection(sectionGID): Function call with correct arguments and asana methods mocked.", async function () {
    const answer = {
      gid: "1202453205610967",
      name: "Preclosing",
    };
    const asanaResponse = {
      data: {
        gid: "1202453205610967",
        name: "Preclosing",
      },
    };

    const preClosingSectionGID = "1202453205610967";
    const getProjectsForTeamMock = jest
      .spyOn(asana.resources.Sections.prototype, "getSection")
      .mockImplementation(() => {
        return asanaResponse;
      });
    const res = await asanaSection.getSection(preClosingSectionGID);
    expect(getProjectsForTeamMock).toHaveBeenCalled();

    expect(res).toEqual(answer);
  });
  test("getSection(): Function call with invalid/no argument and asana methods mocked.", async function () {
    const sectionGID = "invalid";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `section: Not a Long: ${sectionGID}`,
            },
          ],
        },
      },
    };
    const getProjectsForTeamMock = jest
      .spyOn(asana.resources.Sections.prototype, "getSection")
      .mockImplementation(() => {
        throw new Error(errorObj);
      });
    const res = await asanaSection.getSection(sectionGID);
    const noArgRes = await asanaSection.getSection();
    expect(getProjectsForTeamMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
    expect(noArgRes instanceof Error).toEqual(true);
  });
  test("getSectionsByProject(projectGID): Function call with correct arguments and asana methods mocked.", async function () {
    const answer = [
      {
        gid: "1202453205610967",
        name: "Preclosing",
      },
      {
        gid: "1202453210746719",
        name: "Closing",
      },
      {
        gid: "1202453210750836",
        name: "Closed",
      },
      {
        gid: "1202521677422114",
        name: "test",
      },
    ];
    const asanaResponse = {
      data: [
        {
          gid: "1202453205610967",
          name: "Preclosing",
        },
        {
          gid: "1202453210746719",
          name: "Closing",
        },
        {
          gid: "1202453210750836",
          name: "Closed",
        },
        {
          gid: "1202521677422114",
          name: "test",
        },
      ],
      next_page: null,
    };
    const projectGID = "1202453205610966";
    const etSectionsByProjectMock = jest
      .spyOn(asana.resources.Sections.prototype, "getSectionsForProject")
      .mockImplementation(() => {
        return asanaResponse;
      });
    const res = await asanaSection.getSectionsByProject(projectGID);
    expect(etSectionsByProjectMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getSectionsByProject(): Testing default parameter assigment for getSectionsByProject() function call with no arguments, asana methods mocked.", async function () {
    const answer = [
      {
        gid: "1202453205610967",
        name: "Preclosing",
      },
      {
        gid: "1202453210746719",
        name: "Closing",
      },
      {
        gid: "1202453210750836",
        name: "Closed",
      },
      {
        gid: "1202521677422114",
        name: "test",
      },
    ];
    const asanaResponse = {
      data: [
        {
          gid: "1202453205610967",
          name: "Preclosing",
        },
        {
          gid: "1202453210746719",
          name: "Closing",
        },
        {
          gid: "1202453210750836",
          name: "Closed",
        },
        {
          gid: "1202521677422114",
          name: "test",
        },
      ],
      next_page: null,
    };

    const etSectionsByProjectMock = jest
      .spyOn(asana.resources.Sections.prototype, "getSectionsForProject")
      .mockImplementation(() => {
        return asanaResponse;
      });
    const res = await asanaSection.getSectionsByProject();
    expect(etSectionsByProjectMock).toHaveBeenCalled();
    expect(res).toEqual(answer);
  });
  test("getSectionsByProject():  Function call with invalid argument and asana methods mocked.", async function () {
    const projectGID = "invalid";
    const errorObj = {
      error: {
        value: {
          errors: [
            {
              message: `project: Not a Long: ${projectGID}`,
            },
          ],
        },
      },
    };

    const getSectionsByProjectMock = jest
      .spyOn(asana.resources.Sections.prototype, "getSectionsForProject")
      .mockImplementation(() => {
        throw new Error(errorObj);
      });
    const res = await asanaSection.getSectionsByProject(projectGID);
    expect(getSectionsByProjectMock).toHaveBeenCalled();
    expect(res instanceof Error).toEqual(true);
  });
});
