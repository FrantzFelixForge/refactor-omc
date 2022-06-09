const taskNameInputEl = document.getElementById("taskNameInput");
const taskFormEl = document.getElementById("taskForm");
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

  return await response.json();
}

taskFormEl.addEventListener("submit", function (e) {
  e.preventDefault();

  const response = postDataSync(`/api/tasks/`, {
    taskName: taskNameInputEl.value,
  });
  taskNameInputEl.value = "";
  console.log("Form submission \n", response);
});
