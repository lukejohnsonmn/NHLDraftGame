class Player {
    constructor(infoArr) {
        this.fullName = infoArr[0];
        this.jerseyNumber = infoArr[1];
        this.positionCode = infoArr[2];
        this.startedLastGame = infoArr[3];
        this.salary = infoArr[4];
        this.games = infoArr[5];
        this.timeOnIce = infoArr[6];
        this.goals = infoArr[7];
        this.assists = infoArr[8];
        this.shots = infoArr[9];
        this.blocked = infoArr[10];
        this.hits = infoArr[11];
        this.faceOffPct = infoArr[12];
        this.penaltyMinutes = infoArr[13];
        this.plusMinus = infoArr[14];
    }
}

function comparePlayerSalary(a, b) {
    if (a.salary < b.salary) {
        return -1;
    }
    if (a.salary > b.salary) {
        return 1;
    }
    return 0;
}

function getSeasonStats() {
    const myUrl = "http://localhost:8080/get-season-stats";
    const response = httpGet(myUrl);
    const roster = createRoster(response)
    return response;
}

function createRoster(responseCsv) {
    const playerCsvArr = responseCsv.split("|");
    const playerArr = [];
    for (const playerCsv of playerCsvArr) {
        playerArr.push(new Player(playerCsv.split(",")));
    }

    const starters = [];
    const nonStarters = [];
    for (var i=0; i < playerArr.length; i++) {
        if (playerArr[i].startedLastGame == "True") {
            starters.push(playerArr[i]);
        } else {
            nonStarters.push(playerArr[i]);
        }
    }

    for (var i=0; i < nonStarters.length; i++) {
        starters.push(nonStarters[i]);
    }

    populateTable(starters);
    

    return playerArr;
}

function populateTable(playerArr) {
    var tableStr = '';
    for (var i=0; i < playerArr.length; i++) {
        var finalRow = false;
        if (i == playerArr.length-1) {
            finalRow = true;
        }
        if (i % 2 == 0) {
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr class="player-row even-row" id="p'+i+'">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            } else {
                tableStr += '<tr class="player-row even-row non-starter" id="p'+i+'">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            }
            
        } else {
            
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr class="player-row" id="p'+i+'">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            } else {
                tableStr += '<tr class="player-row non-starter" id="p'+i+'">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            }
        }
    }
    document.getElementById('playerTableBody').innerHTML = tableStr;
}

function getHTMLForPlayer(player, finalRow) {
    var htmlStr = '<td>' + player.positionCode + '</td>';
    htmlStr += '<td>' + player.jerseyNumber + '</td>';
    htmlStr += '<td>' + player.fullName + '</td>';
    if (finalRow) {
        htmlStr += '<td class="salary-td final-row">' + player.salary + '</td>';
    } else {
        htmlStr += '<td class="salary-td">' + player.salary + '</td>';
    }
    
    htmlStr += '<td>' + player.games + '</td>';
    htmlStr += '<td class="goals-td">' + player.goals + '</td>';
    htmlStr += '<td class="assists-td">' + player.assists + '</td>';
    htmlStr += '<td class="shots-td">' + player.shots + '</td>';
    htmlStr += '<td class="blocked-td">' + player.blocked + '</td>';
    htmlStr += '<td class="hits-td">' + player.hits + '</td>';
    htmlStr += '<td class="faceOffPct-td">' + player.faceOffPct + '</td>';
    htmlStr += '<td>' + player.plusMinus + '</td>';
    htmlStr += '<td>' + player.penaltyMinutes + '</td>';
    htmlStr += '<td>' + player.timeOnIce + '</td>';
    return htmlStr
}



function light(sw) {  
    var myText;  
    if (sw == 0) {  
        myText = "Light off!";
    } else if (sw == 1) {  
        myText = "Light on!";
    }  else {
        myText = getSeasonStats();
    }
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}