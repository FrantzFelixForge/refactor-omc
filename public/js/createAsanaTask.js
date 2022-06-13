const taskNameInputEl = document.getElementById("taskNameInput");
const taskDescriptionTextAreaEl = document.getElementById(
  "taskDescriptionTextArea"
);
const taskCompletionDateEl = document.getElementById("taskCompletionDate");
const taskFormEl = document.getElementById("taskForm");
const workspaceSelectEl = document.getElementById("workspaceSelect");
const teamSelectEl = document.getElementById("teamSelect");
const projectSelectEl = document.getElementById("projectSelect");
const assigneeSelectEl = document.getElementById("assigneeSelect");
// console.log(response, "\n ^response^");
async function postDataSync(url, data) {
  console.log(data);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
async function getDataSync(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const result = await response.json();
  return result;
}
function createOptions(dataArray, locationEl) {
  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i];
    console.log(data);
    const currentOption = document.createElement("option");
    currentOption.textContent = data.name;
    currentOption.value = data.gid;
    locationEl.appendChild(currentOption);
  }
}
async function initOptions() {
  const me = await getDataSync(`/api/users/me`);
  const workspaceResponse = await getDataSync(`/api/workspaces/`);
  const teamResponse = await getDataSync(
    `/api/teams/?gid=${me.gid}&organization=${workspaceResponse.gid}`
  );
  const teamGid = teamResponse[0].gid;
  const projectResponse = await getDataSync(`/api/projects/?gid=${teamGid}`);

  // const assigneeResponse = await getDataSync(`/api/assignee/`);

  createOptions([workspaceResponse], workspaceSelectEl);
  createOptions(teamResponse, teamSelectEl);
  createOptions(projectResponse, projectSelectEl);
  createOptions([me], assigneeSelectEl);
}
initOptions();

taskFormEl.addEventListener("submit", async function (e) {
  e.preventDefault();

  const response = await postDataSync(`/api/tasks/`, {
    taskName: taskNameInputEl.value,
    taskDescription: taskDescriptionTextAreaEl.value,
    taskCompletionDate: taskCompletionDateEl.value,
    projectGid: projectSelectEl.options[projectSelectEl.selectedIndex].value,
    assigneeGid: assigneeSelectEl.options[assigneeSelectEl.selectedIndex].value,
    workspaceGid:
      workspaceSelectEl.options[projectSelectEl.selectedIndex].value,
  });
  console.log(response, "\n");
  taskNameInputEl.value = "";
  taskDescriptionTextAreaEl.value = "";
});
