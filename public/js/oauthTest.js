async function postData(url, data) {
  console.log(`${data.code}`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

const queryParamsArray = window.location.search.substring(1).split(`&`);
const queryParamsObj = {};
for (let i = 0; i < queryParamsArray.length; i++) {
  const [key, value] = queryParamsArray[i].split(`=`);
  queryParamsObj[`${key}`] = decodeURIComponent(value);
}

postData(`/api/bearerToken`, queryParamsObj).then(function (data) {
  console.log(data, "here");
});
