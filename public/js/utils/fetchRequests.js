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
