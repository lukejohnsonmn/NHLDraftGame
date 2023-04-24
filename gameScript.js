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
                tableStr += '<tr id="p'+i+'" class="player-row even-row">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            } else {
                tableStr += '<tr id="p'+i+'" class="player-row even-row non-starter">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            }
            
        } else {
            
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr id="p'+i+'" class="player-row">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
            } else {
                tableStr += '<tr id="p'+i+'" class="player-row non-starter">' + getHTMLForPlayer(playerArr[i], finalRow) + '</tr>';
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


var playerRowsLoaded = false;
function light(sw) {  
    var myText;  
    if (sw == 0) {  
        myText = "Light off!";
    } else if (sw == 1) {  
        myText = "Light on!";
    }  else {
        myText = getSeasonStats();
        afterPlayerRowsLoaded();
    }
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function afterPlayerRowsLoaded() {
    var p0Selected = false;
    var p1Selected = false;
    var p2Selected = false;
    var p3Selected = false;
    var p4Selected = false;
    var p5Selected = false;
    var p6Selected = false;
    var p7Selected = false;
    var p8Selected = false;
    var p9Selected = false;
    var p10Selected = false;
    var p11Selected = false;
    var p12Selected = false;
    var p13Selected = false;
    var p14Selected = false;
    var p15Selected = false;
    var p16Selected = false;
    var p17Selected = false;
    var p18Selected = false;
    var p19Selected = false;
    var p20Selected = false;
    var p21Selected = false;
    var p22Selected = false;
    var p23Selected = false;
    var p24Selected = false;
    var p25Selected = false;
    var p26Selected = false;
    var p27Selected = false;
    var p28Selected = false;
    var p29Selected = false;
    var p30Selected = false;
    $(function() {$('#p0').hover(function() {if (!p0Selected) {$("#p0").addClass("fire");}}, function() {if (!p0Selected) {$("#p0").removeClass("fire");}});});
    $(function() {$('#p1').hover(function() {if (!p1Selected) {$("#p1").addClass("fire");}}, function() {if (!p1Selected) {$("#p1").removeClass("fire");}});});
    $(function() {$('#p2').hover(function() {if (!p2Selected) {$("#p2").addClass("fire");}}, function() {if (!p2Selected) {$("#p2").removeClass("fire");}});});
    $(function() {$('#p3').hover(function() {if (!p3Selected) {$("#p3").addClass("fire");}}, function() {if (!p3Selected) {$("#p3").removeClass("fire");}});});
    $(function() {$('#p4').hover(function() {if (!p4Selected) {$("#p4").addClass("fire");}}, function() {if (!p4Selected) {$("#p4").removeClass("fire");}});});
    $(function() {$('#p5').hover(function() {if (!p5Selected) {$("#p5").addClass("fire");}}, function() {if (!p5Selected) {$("#p5").removeClass("fire");}});});
    $(function() {$('#p6').hover(function() {if (!p6Selected) {$("#p6").addClass("fire");}}, function() {if (!p6Selected) {$("#p6").removeClass("fire");}});});
    $(function() {$('#p7').hover(function() {if (!p7Selected) {$("#p7").addClass("fire");}}, function() {if (!p7Selected) {$("#p7").removeClass("fire");}});});
    $(function() {$('#p8').hover(function() {if (!p8Selected) {$("#p8").addClass("fire");}}, function() {if (!p8Selected) {$("#p8").removeClass("fire");}});});
    $(function() {$('#p9').hover(function() {if (!p9Selected) {$("#p9").addClass("fire");}}, function() {if (!p9Selected) {$("#p9").removeClass("fire");}});});
    $(function() {$('#p10').hover(function() {if (!p10Selected) {$("#p10").addClass("fire");}}, function() {if (!p10Selected) {$("#p10").removeClass("fire");}});});
    $(function() {$('#p11').hover(function() {if (!p11Selected) {$("#p11").addClass("fire");}}, function() {if (!p11Selected) {$("#p11").removeClass("fire");}});});
    $(function() {$('#p12').hover(function() {if (!p12Selected) {$("#p12").addClass("fire");}}, function() {if (!p12Selected) {$("#p12").removeClass("fire");}});});
    $(function() {$('#p13').hover(function() {if (!p13Selected) {$("#p13").addClass("fire");}}, function() {if (!p13Selected) {$("#p13").removeClass("fire");}});});
    $(function() {$('#p14').hover(function() {if (!p14Selected) {$("#p14").addClass("fire");}}, function() {if (!p14Selected) {$("#p14").removeClass("fire");}});});
    $(function() {$('#p15').hover(function() {if (!p15Selected) {$("#p15").addClass("fire");}}, function() {if (!p15Selected) {$("#p15").removeClass("fire");}});});
    $(function() {$('#p16').hover(function() {if (!p16Selected) {$("#p16").addClass("fire");}}, function() {if (!p16Selected) {$("#p16").removeClass("fire");}});});
    $(function() {$('#p17').hover(function() {if (!p17Selected) {$("#p17").addClass("fire");}}, function() {if (!p17Selected) {$("#p17").removeClass("fire");}});});
    $(function() {$('#p18').hover(function() {if (!p18Selected) {$("#p18").addClass("fire");}}, function() {if (!p18Selected) {$("#p18").removeClass("fire");}});});
    $(function() {$('#p19').hover(function() {if (!p19Selected) {$("#p19").addClass("fire");}}, function() {if (!p19Selected) {$("#p19").removeClass("fire");}});});
    $(function() {$('#p20').hover(function() {if (!p20Selected) {$("#p20").addClass("fire");}}, function() {if (!p20Selected) {$("#p20").removeClass("fire");}});});
    $(function() {$('#p21').hover(function() {if (!p21Selected) {$("#p21").addClass("fire");}}, function() {if (!p21Selected) {$("#p21").removeClass("fire");}});});
    $(function() {$('#p22').hover(function() {if (!p22Selected) {$("#p22").addClass("fire");}}, function() {if (!p22Selected) {$("#p22").removeClass("fire");}});});
    $(function() {$('#p23').hover(function() {if (!p23Selected) {$("#p23").addClass("fire");}}, function() {if (!p23Selected) {$("#p23").removeClass("fire");}});});
    $(function() {$('#p24').hover(function() {if (!p24Selected) {$("#p24").addClass("fire");}}, function() {if (!p24Selected) {$("#p24").removeClass("fire");}});});
    $(function() {$('#p25').hover(function() {if (!p25Selected) {$("#p25").addClass("fire");}}, function() {if (!p25Selected) {$("#p25").removeClass("fire");}});});
    $(function() {$('#p26').hover(function() {if (!p26Selected) {$("#p26").addClass("fire");}}, function() {if (!p26Selected) {$("#p26").removeClass("fire");}});});
    $(function() {$('#p27').hover(function() {if (!p27Selected) {$("#p27").addClass("fire");}}, function() {if (!p27Selected) {$("#p27").removeClass("fire");}});});
    $(function() {$('#p28').hover(function() {if (!p28Selected) {$("#p28").addClass("fire");}}, function() {if (!p28Selected) {$("#p28").removeClass("fire");}});});
    $(function() {$('#p29').hover(function() {if (!p29Selected) {$("#p29").addClass("fire");}}, function() {if (!p29Selected) {$("#p29").removeClass("fire");}});});
    $(function() {$('#p30').hover(function() {if (!p30Selected) {$("#p30").addClass("fire");}}, function() {if (!p30Selected) {$("#p30").removeClass("fire");}});});
    
    
    
    
    
    $(function() {
        $('#p0').click(function() {
          resetAllSelectedPlayers();
          p0Selected = true;
          $("#p0").addClass("goldFire");
        });
      });
}