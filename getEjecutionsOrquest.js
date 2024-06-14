async function getToken(clientId,userKey) {
    const credentials = {
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: userKey
    }

    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    };

    const response = await fetch('https://account.uipath.com/oauth/token', options);
    const responseData = await response.json();
    //console.log(responseData.access_token);
    return responseData.access_token;
};

async function getExecutions(botName,clientId,userKey) {
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken(clientId,userKey)}`
        }
    };
    const endPoint = botName ? 
    `https://cloud.uipath.com/brookrpfaldp/Prod/orchestrator_/odata/Jobs?$select=ReleaseName,EndTime,StartTime,key&$orderby=StartTime%20desc&$filter=ReleaseName eq '${botName}'` :
    'https://cloud.uipath.com/brookrpfaldp/Prod/orchestrator_/odata/Jobs?$select=ReleaseName,EndTime,StartTime,key&$orderby=StartTime%20desc'
    console.log(endPoint);
    const response = await fetch(endPoint, options);
    //console.log(await response.json());
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

function calculateTimeDifference(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const diffInMs = endDate - startDate;
  
    //seconds
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const seconds = diffInSeconds % 60;
  
    //minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const minutes = diffInMinutes % 60;
  
    //hours
    const hours = Math.floor(diffInMinutes / 60);
  
    //format
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

async function getExecutionsFormated(executionKey,botName,clientId,userKey) {
    let executions = await getExecutions(botName,clientId,userKey);
    executions = executions.value;
    //console.log(executions);
    let executionFormated = []
    for (let i = 0; i < executions.length; i++) {
        if (executions[i].Key != executionKey) {
            executionFormated.push({
                botName: executions[i].ReleaseName,
                date: getFormatDate(executions[i].StartTime),
                startRun: getFormatHour(executions[i].StartTime),
                endRun: getFormatHour(executions[i].EndTime),
                totalTime: calculateTimeDifference(executions[i].StartTime, executions[i].EndTime)
            });
        } else
            break;
    }
    executionFormated = executionFormated.reverse()

    console.log('End taks: ' + JSON.stringify(executionFormated));
    return executionFormated
}
//getExecutionsFormated("73159b87-b5eb-4252-a655-0d567ec82ae5", "Vena_Performer")