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

async function getExecutions(idBot, token) {
  const data = { id: idBot }
  const options = {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('https://api.dashboard.beecker.ai/api/executionsTable/', options);
  return await response.json();
}

async function getExecutionID(id, token) {
  const data = { id: id }
  const options = {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('https://api.dashboard.beecker.ai/api/transactionsTable/', options);
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

async function getExecutionsFormated(executionStart, executionLast) {
  let token = await getToken()
  let executions = await getExecutions(74, token);
  executions = executions.executions;
  //console.log(JSON.stringify(executions));
  const executionFormated = []
  for (let i = 0; i < executions.length; i++) {
    if (executions[i].id <= executionLast && executions[i].id >= executionStart) {
      let infoExecution = await getExecutionID(executions[i].id, token)
      infoExecution.data_raw.forEach(currectCase => {
        console.log(JSON.stringify(currectCase));
        executionFormated.push({
          date: getFormatDate(executions[i].start_run),
          startRun: getFormatHour(executions[i].start_run),
          endRun: getFormatHour(executions[i].end_run),
          caseId : currectCase["case id"],
          senderEmail : currectCase["sender email"],
          caseTitle : currectCase["case title"],
          caseDescription : currectCase["case description"],
          category : currectCase.category,
          subcategory : currectCase.subcategory,
          status: executions[i].run_state
        });
      });
    };
  }
  console.log('End taks: ' + JSON.stringify(executionFormated));
  return executionFormated
}
//getExecutionsFormated(76811, 74)