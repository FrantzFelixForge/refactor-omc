const taskNameInputEl = document.getElementById("taskNameInput");
const taskFormEl = document.getElementById("taskForm");
// const response = postDataSync(`url`, data);
// console.log(response, "\n ^response^");

taskFormEl.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submission");
});
