async function getToken() {
  const credentials = new FormData();
  credentials.append('username', 'beeckercoapi');
  credentials.append('password', 'prei1mZMQ7Krydn4');

  const options = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: credentials
  };

  const response = await fetch('https://api.dashboard.beecker.ai/generate_token/', options);
  const responseData = await response.json();
  console.log('Response:', responseData.token);
  return responseData.token;
};

async function getExecutions(idBot) {
  const data = { id: idBot }
  const options = {
    method: 'POST',
    headers: {
      Authorization: `token ${await getToken()}`
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('https://api.dashboard.beecker.ai/api/executionsTable/', options);
  return await response.json();
}

function getFormatHour(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getFormatDate(dateTimeString) {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function getExecutionsFormated(idTope, idBot) {
  let executions = await getExecutions(idBot);
  executions = executions.executions;
  //console.log(JSON.stringify(executions));
  const executionFormated = []
  executions.forEach(execution => {
    if (execution.id >= idTope) {
      executionFormated.push({
        date: getFormatDate(execution.start_run),
        startRun: getFormatHour(execution.start_run),
        endRun: getFormatHour(execution.end_run)
      });
    };
  });
  console.log('End taks: ' + JSON.stringify(executionFormated));
  return executionFormated
}
//getExecutionsFormated(76811, 74)