class Player {
    constructor(infoArr) {
        this.id = infoArr[0];
        this.fullName = infoArr[1];
        this.jerseyNumber = infoArr[2];
        this.positionCode = infoArr[3];
        this.startedLastGame = infoArr[4];
        this.salary = infoArr[5];
        this.games = infoArr[6];
        this.timeOnIce = infoArr[7];
        this.goals = infoArr[8];
        this.assists = infoArr[9];
        this.shots = infoArr[10];
        this.blocked = infoArr[11];
        this.hits = infoArr[12];
        this.faceOffPct = infoArr[13];
        this.penaltyMinutes = infoArr[14];
        this.plusMinus = infoArr[15];
    }
}

class SalaryPlayer {
    constructor(infoArr) {
        this.positionCode = infoArr[0];
        this.jerseyNumber = infoArr[1];
        this.fullName = infoArr[2];
        this.salary = infoArr[3];
    }
}

var roster = null;

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
    roster = createRoster(response);
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
    var htmlStr = '<td><div hidden>'+player.id+'</div>' + player.positionCode + '</td>';
    htmlStr += '<td>' + player.jerseyNumber + '</td>';
    htmlStr += '<td>' + player.fullName + '</td>';
    if (finalRow) {
        htmlStr += '<td class="final-row salary-td">' + player.salary + '</td>';
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

var selectedPlayer = null;

function afterPlayerRowsLoaded() {
    var p0Selected = false;var p1Selected = false;var p2Selected = false;var p3Selected = false;var p4Selected = false;var p5Selected = false;
    var p6Selected = false;var p7Selected = false;var p8Selected = false;var p9Selected = false;var p10Selected = false;var p11Selected = false;
    var p12Selected = false;var p13Selected = false;var p14Selected = false;var p15Selected = false;var p16Selected = false;var p17Selected = false;
    var p18Selected = false;var p19Selected = false;var p20Selected = false;var p21Selected = false;var p22Selected = false;var p23Selected = false;
    var p24Selected = false;var p25Selected = false;var p26Selected = false;var p27Selected = false;var p28Selected = false;var p29Selected = false;

    $(function() {$('#p0').hover(function() {if (!p0Selected) {$("#p0").addClass("lightGoldFire");}}, function() {if (!p0Selected) {$("#p0").removeClass("lightGoldFire");}});});
    $(function() {$('#p1').hover(function() {if (!p1Selected) {$("#p1").addClass("lightGoldFire");}}, function() {if (!p1Selected) {$("#p1").removeClass("lightGoldFire");}});});
    $(function() {$('#p2').hover(function() {if (!p2Selected) {$("#p2").addClass("lightGoldFire");}}, function() {if (!p2Selected) {$("#p2").removeClass("lightGoldFire");}});});
    $(function() {$('#p3').hover(function() {if (!p3Selected) {$("#p3").addClass("lightGoldFire");}}, function() {if (!p3Selected) {$("#p3").removeClass("lightGoldFire");}});});
    $(function() {$('#p4').hover(function() {if (!p4Selected) {$("#p4").addClass("lightGoldFire");}}, function() {if (!p4Selected) {$("#p4").removeClass("lightGoldFire");}});});
    $(function() {$('#p5').hover(function() {if (!p5Selected) {$("#p5").addClass("lightGoldFire");}}, function() {if (!p5Selected) {$("#p5").removeClass("lightGoldFire");}});});
    $(function() {$('#p6').hover(function() {if (!p6Selected) {$("#p6").addClass("lightGoldFire");}}, function() {if (!p6Selected) {$("#p6").removeClass("lightGoldFire");}});});
    $(function() {$('#p7').hover(function() {if (!p7Selected) {$("#p7").addClass("lightGoldFire");}}, function() {if (!p7Selected) {$("#p7").removeClass("lightGoldFire");}});});
    $(function() {$('#p8').hover(function() {if (!p8Selected) {$("#p8").addClass("lightGoldFire");}}, function() {if (!p8Selected) {$("#p8").removeClass("lightGoldFire");}});});
    $(function() {$('#p9').hover(function() {if (!p9Selected) {$("#p9").addClass("lightGoldFire");}}, function() {if (!p9Selected) {$("#p9").removeClass("lightGoldFire");}});});
    $(function() {$('#p10').hover(function() {if (!p10Selected) {$("#p10").addClass("lightGoldFire");}}, function() {if (!p10Selected) {$("#p10").removeClass("lightGoldFire");}});});
    $(function() {$('#p11').hover(function() {if (!p11Selected) {$("#p11").addClass("lightGoldFire");}}, function() {if (!p11Selected) {$("#p11").removeClass("lightGoldFire");}});});
    $(function() {$('#p12').hover(function() {if (!p12Selected) {$("#p12").addClass("lightGoldFire");}}, function() {if (!p12Selected) {$("#p12").removeClass("lightGoldFire");}});});
    $(function() {$('#p13').hover(function() {if (!p13Selected) {$("#p13").addClass("lightGoldFire");}}, function() {if (!p13Selected) {$("#p13").removeClass("lightGoldFire");}});});
    $(function() {$('#p14').hover(function() {if (!p14Selected) {$("#p14").addClass("lightGoldFire");}}, function() {if (!p14Selected) {$("#p14").removeClass("lightGoldFire");}});});
    $(function() {$('#p15').hover(function() {if (!p15Selected) {$("#p15").addClass("lightGoldFire");}}, function() {if (!p15Selected) {$("#p15").removeClass("lightGoldFire");}});});
    $(function() {$('#p16').hover(function() {if (!p16Selected) {$("#p16").addClass("lightGoldFire");}}, function() {if (!p16Selected) {$("#p16").removeClass("lightGoldFire");}});});
    $(function() {$('#p17').hover(function() {if (!p17Selected) {$("#p17").addClass("lightGoldFire");}}, function() {if (!p17Selected) {$("#p17").removeClass("lightGoldFire");}});});
    $(function() {$('#p18').hover(function() {if (!p18Selected) {$("#p18").addClass("lightGoldFire");}}, function() {if (!p18Selected) {$("#p18").removeClass("lightGoldFire");}});});
    $(function() {$('#p19').hover(function() {if (!p19Selected) {$("#p19").addClass("lightGoldFire");}}, function() {if (!p19Selected) {$("#p19").removeClass("lightGoldFire");}});});
    $(function() {$('#p20').hover(function() {if (!p20Selected) {$("#p20").addClass("lightGoldFire");}}, function() {if (!p20Selected) {$("#p20").removeClass("lightGoldFire");}});});
    $(function() {$('#p21').hover(function() {if (!p21Selected) {$("#p21").addClass("lightGoldFire");}}, function() {if (!p21Selected) {$("#p21").removeClass("lightGoldFire");}});});
    $(function() {$('#p22').hover(function() {if (!p22Selected) {$("#p22").addClass("lightGoldFire");}}, function() {if (!p22Selected) {$("#p22").removeClass("lightGoldFire");}});});
    $(function() {$('#p23').hover(function() {if (!p23Selected) {$("#p23").addClass("lightGoldFire");}}, function() {if (!p23Selected) {$("#p23").removeClass("lightGoldFire");}});});
    $(function() {$('#p24').hover(function() {if (!p24Selected) {$("#p24").addClass("lightGoldFire");}}, function() {if (!p24Selected) {$("#p24").removeClass("lightGoldFire");}});});
    $(function() {$('#p25').hover(function() {if (!p25Selected) {$("#p25").addClass("lightGoldFire");}}, function() {if (!p25Selected) {$("#p25").removeClass("lightGoldFire");}});});
    $(function() {$('#p26').hover(function() {if (!p26Selected) {$("#p26").addClass("lightGoldFire");}}, function() {if (!p26Selected) {$("#p26").removeClass("lightGoldFire");}});});
    $(function() {$('#p27').hover(function() {if (!p27Selected) {$("#p27").addClass("lightGoldFire");}}, function() {if (!p27Selected) {$("#p27").removeClass("lightGoldFire");}});});
    $(function() {$('#p28').hover(function() {if (!p28Selected) {$("#p28").addClass("lightGoldFire");}}, function() {if (!p28Selected) {$("#p28").removeClass("lightGoldFire");}});});
    $(function() {$('#p29').hover(function() {if (!p29Selected) {$("#p29").addClass("lightGoldFire");}}, function() {if (!p29Selected) {$("#p29").removeClass("lightGoldFire");}});});

    $(function() {$('#p0').click(function() {resetAllSelectedPlayers();if (p0Selected) {p0Selected = false;selectedPlayer = null;$("#p0").addClass("lightGoldFire");} else {resetAllSelectedStatus();p0Selected = true;selectedPlayer = parsePlayerFromRow('p0');$("#p0").addClass("goldFire");}});});
    $(function() {$('#p1').click(function() {resetAllSelectedPlayers();if (p1Selected) {p1Selected = false;selectedPlayer = null;$("#p1").addClass("lightGoldFire");} else {resetAllSelectedStatus();p1Selected = true;selectedPlayer = parsePlayerFromRow('p1');$("#p1").addClass("goldFire");}});});
    $(function() {$('#p2').click(function() {resetAllSelectedPlayers();if (p2Selected) {p2Selected = false;selectedPlayer = null;$("#p2").addClass("lightGoldFire");} else {resetAllSelectedStatus();p2Selected = true;selectedPlayer = parsePlayerFromRow('p2');$("#p2").addClass("goldFire");}});});
    $(function() {$('#p3').click(function() {resetAllSelectedPlayers();if (p3Selected) {p3Selected = false;selectedPlayer = null;$("#p3").addClass("lightGoldFire");} else {resetAllSelectedStatus();p3Selected = true;selectedPlayer = parsePlayerFromRow('p3');$("#p3").addClass("goldFire");}});});
    $(function() {$('#p4').click(function() {resetAllSelectedPlayers();if (p4Selected) {p4Selected = false;selectedPlayer = null;$("#p4").addClass("lightGoldFire");} else {resetAllSelectedStatus();p4Selected = true;selectedPlayer = parsePlayerFromRow('p4');$("#p4").addClass("goldFire");}});});
    $(function() {$('#p5').click(function() {resetAllSelectedPlayers();if (p5Selected) {p5Selected = false;selectedPlayer = null;$("#p5").addClass("lightGoldFire");} else {resetAllSelectedStatus();p5Selected = true;selectedPlayer = parsePlayerFromRow('p5');$("#p5").addClass("goldFire");}});});
    $(function() {$('#p6').click(function() {resetAllSelectedPlayers();if (p6Selected) {p6Selected = false;selectedPlayer = null;$("#p6").addClass("lightGoldFire");} else {resetAllSelectedStatus();p6Selected = true;selectedPlayer = parsePlayerFromRow('p6');$("#p6").addClass("goldFire");}});});
    $(function() {$('#p7').click(function() {resetAllSelectedPlayers();if (p7Selected) {p7Selected = false;selectedPlayer = null;$("#p7").addClass("lightGoldFire");} else {resetAllSelectedStatus();p7Selected = true;selectedPlayer = parsePlayerFromRow('p7');$("#p7").addClass("goldFire");}});});
    $(function() {$('#p8').click(function() {resetAllSelectedPlayers();if (p8Selected) {p8Selected = false;selectedPlayer = null;$("#p8").addClass("lightGoldFire");} else {resetAllSelectedStatus();p8Selected = true;selectedPlayer = parsePlayerFromRow('p8');$("#p8").addClass("goldFire");}});});
    $(function() {$('#p9').click(function() {resetAllSelectedPlayers();if (p9Selected) {p9Selected = false;selectedPlayer = null;$("#p9").addClass("lightGoldFire");} else {resetAllSelectedStatus();p9Selected = true;selectedPlayer = parsePlayerFromRow('p9');$("#p9").addClass("goldFire");}});});
    $(function() {$('#p10').click(function() {resetAllSelectedPlayers();if (p10Selected) {p10Selected = false;selectedPlayer = null;$("#p10").addClass("lightGoldFire");} else {resetAllSelectedStatus();p10Selected = true;selectedPlayer = parsePlayerFromRow('p10');$("#p10").addClass("goldFire");}});});
    $(function() {$('#p11').click(function() {resetAllSelectedPlayers();if (p11Selected) {p11Selected = false;selectedPlayer = null;$("#p11").addClass("lightGoldFire");} else {resetAllSelectedStatus();p11Selected = true;selectedPlayer = parsePlayerFromRow('p11');$("#p11").addClass("goldFire");}});});
    $(function() {$('#p12').click(function() {resetAllSelectedPlayers();if (p12Selected) {p12Selected = false;selectedPlayer = null;$("#p12").addClass("lightGoldFire");} else {resetAllSelectedStatus();p12Selected = true;selectedPlayer = parsePlayerFromRow('p12');$("#p12").addClass("goldFire");}});});
    $(function() {$('#p13').click(function() {resetAllSelectedPlayers();if (p13Selected) {p13Selected = false;selectedPlayer = null;$("#p13").addClass("lightGoldFire");} else {resetAllSelectedStatus();p13Selected = true;selectedPlayer = parsePlayerFromRow('p13');$("#p13").addClass("goldFire");}});});
    $(function() {$('#p14').click(function() {resetAllSelectedPlayers();if (p14Selected) {p14Selected = false;selectedPlayer = null;$("#p14").addClass("lightGoldFire");} else {resetAllSelectedStatus();p14Selected = true;selectedPlayer = parsePlayerFromRow('p14');$("#p14").addClass("goldFire");}});});
    $(function() {$('#p15').click(function() {resetAllSelectedPlayers();if (p15Selected) {p15Selected = false;selectedPlayer = null;$("#p15").addClass("lightGoldFire");} else {resetAllSelectedStatus();p15Selected = true;selectedPlayer = parsePlayerFromRow('p15');$("#p15").addClass("goldFire");}});});
    $(function() {$('#p16').click(function() {resetAllSelectedPlayers();if (p16Selected) {p16Selected = false;selectedPlayer = null;$("#p16").addClass("lightGoldFire");} else {resetAllSelectedStatus();p16Selected = true;selectedPlayer = parsePlayerFromRow('p16');$("#p16").addClass("goldFire");}});});
    $(function() {$('#p17').click(function() {resetAllSelectedPlayers();if (p17Selected) {p17Selected = false;selectedPlayer = null;$("#p17").addClass("lightGoldFire");} else {resetAllSelectedStatus();p17Selected = true;selectedPlayer = parsePlayerFromRow('p17');$("#p17").addClass("goldFire");}});});
    $(function() {$('#p18').click(function() {resetAllSelectedPlayers();if (p18Selected) {p18Selected = false;selectedPlayer = null;$("#p18").addClass("lightGoldFire");} else {resetAllSelectedStatus();p18Selected = true;selectedPlayer = parsePlayerFromRow('p18');$("#p18").addClass("goldFire");}});});
    $(function() {$('#p19').click(function() {resetAllSelectedPlayers();if (p19Selected) {p19Selected = false;selectedPlayer = null;$("#p19").addClass("lightGoldFire");} else {resetAllSelectedStatus();p19Selected = true;selectedPlayer = parsePlayerFromRow('p19');$("#p19").addClass("goldFire");}});});
    $(function() {$('#p20').click(function() {resetAllSelectedPlayers();if (p20Selected) {p20Selected = false;selectedPlayer = null;$("#p20").addClass("lightGoldFire");} else {resetAllSelectedStatus();p20Selected = true;selectedPlayer = parsePlayerFromRow('p20');$("#p20").addClass("goldFire");}});});
    $(function() {$('#p21').click(function() {resetAllSelectedPlayers();if (p21Selected) {p21Selected = false;selectedPlayer = null;$("#p21").addClass("lightGoldFire");} else {resetAllSelectedStatus();p21Selected = true;selectedPlayer = parsePlayerFromRow('p21');$("#p21").addClass("goldFire");}});});
    $(function() {$('#p22').click(function() {resetAllSelectedPlayers();if (p22Selected) {p22Selected = false;selectedPlayer = null;$("#p22").addClass("lightGoldFire");} else {resetAllSelectedStatus();p22Selected = true;selectedPlayer = parsePlayerFromRow('p22');$("#p22").addClass("goldFire");}});});
    $(function() {$('#p23').click(function() {resetAllSelectedPlayers();if (p23Selected) {p23Selected = false;selectedPlayer = null;$("#p23").addClass("lightGoldFire");} else {resetAllSelectedStatus();p23Selected = true;selectedPlayer = parsePlayerFromRow('p23');$("#p23").addClass("goldFire");}});});
    $(function() {$('#p24').click(function() {resetAllSelectedPlayers();if (p24Selected) {p24Selected = false;selectedPlayer = null;$("#p24").addClass("lightGoldFire");} else {resetAllSelectedStatus();p24Selected = true;selectedPlayer = parsePlayerFromRow('p24');$("#p24").addClass("goldFire");}});});
    $(function() {$('#p25').click(function() {resetAllSelectedPlayers();if (p25Selected) {p25Selected = false;selectedPlayer = null;$("#p25").addClass("lightGoldFire");} else {resetAllSelectedStatus();p25Selected = true;selectedPlayer = parsePlayerFromRow('p25');$("#p25").addClass("goldFire");}});});
    $(function() {$('#p26').click(function() {resetAllSelectedPlayers();if (p26Selected) {p26Selected = false;selectedPlayer = null;$("#p26").addClass("lightGoldFire");} else {resetAllSelectedStatus();p26Selected = true;selectedPlayer = parsePlayerFromRow('p26');$("#p26").addClass("goldFire");}});});
    $(function() {$('#p27').click(function() {resetAllSelectedPlayers();if (p27Selected) {p27Selected = false;selectedPlayer = null;$("#p27").addClass("lightGoldFire");} else {resetAllSelectedStatus();p27Selected = true;selectedPlayer = parsePlayerFromRow('p27');$("#p27").addClass("goldFire");}});});
    $(function() {$('#p28').click(function() {resetAllSelectedPlayers();if (p28Selected) {p28Selected = false;selectedPlayer = null;$("#p28").addClass("lightGoldFire");} else {resetAllSelectedStatus();p28Selected = true;selectedPlayer = parsePlayerFromRow('p28');$("#p28").addClass("goldFire");}});});
    $(function() {$('#p29').click(function() {resetAllSelectedPlayers();if (p29Selected) {p29Selected = false;selectedPlayer = null;$("#p29").addClass("lightGoldFire");} else {resetAllSelectedStatus();p29Selected = true;selectedPlayer = parsePlayerFromRow('p29');$("#p29").addClass("goldFire");}});});

    function resetAllSelectedStatus() {
        p0Selected = false;p1Selected = false;p2Selected = false;p3Selected = false;p4Selected = false;p5Selected = false;
        p6Selected = false;p7Selected = false;p8Selected = false;p9Selected = false;p10Selected = false;p11Selected = false;
        p12Selected = false;p13Selected = false;p14Selected = false;p15Selected = false;p16Selected = false;p17Selected = false;
        p18Selected = false;p19Selected = false;p20Selected = false;p21Selected = false;p22Selected = false;p23Selected = false;
        p24Selected = false;p25Selected = false;p26Selected = false;p27Selected = false;p28Selected = false;p29Selected = false;
    }
}

function resetAllSelectedPlayers() {
    $('#p0').removeClass("lightGoldFire");$('#p1').removeClass("lightGoldFire");$('#p2').removeClass("lightGoldFire");$('#p3').removeClass("lightGoldFire");$('#p4').removeClass("lightGoldFire");$('#p5').removeClass("lightGoldFire");
    $('#p6').removeClass("lightGoldFire");$('#p7').removeClass("lightGoldFire");$('#p8').removeClass("lightGoldFire");$('#p9').removeClass("lightGoldFire");$('#p10').removeClass("lightGoldFire");$('#p11').removeClass("lightGoldFire");
    $('#p12').removeClass("lightGoldFire");$('#p13').removeClass("lightGoldFire");$('#p14').removeClass("lightGoldFire");$('#p15').removeClass("lightGoldFire");$('#p16').removeClass("lightGoldFire");$('#p17').removeClass("lightGoldFire");
    $('#p18').removeClass("lightGoldFire");$('#p19').removeClass("lightGoldFire");$('#p20').removeClass("lightGoldFire");$('#p21').removeClass("lightGoldFire");$('#p22').removeClass("lightGoldFire");$('#p23').removeClass("lightGoldFire");
    $('#p24').removeClass("lightGoldFire");$('#p25').removeClass("lightGoldFire");$('#p26').removeClass("lightGoldFire");$('#p27').removeClass("lightGoldFire");$('#p28').removeClass("lightGoldFire");$('#p29').removeClass("lightGoldFire");

    $('#p0').removeClass("goldFire");$('#p1').removeClass("goldFire");$('#p2').removeClass("goldFire");$('#p3').removeClass("goldFire");$('#p4').removeClass("goldFire");$('#p5').removeClass("goldFire");
    $('#p6').removeClass("goldFire");$('#p7').removeClass("goldFire");$('#p8').removeClass("goldFire");$('#p9').removeClass("goldFire");$('#p10').removeClass("goldFire");$('#p11').removeClass("goldFire");
    $('#p12').removeClass("goldFire");$('#p13').removeClass("goldFire");$('#p14').removeClass("goldFire");$('#p15').removeClass("goldFire");$('#p16').removeClass("goldFire");$('#p17').removeClass("goldFire");
    $('#p18').removeClass("goldFire");$('#p19').removeClass("goldFire");$('#p20').removeClass("goldFire");$('#p21').removeClass("goldFire");$('#p22').removeClass("goldFire");$('#p23').removeClass("goldFire");
    $('#p24').removeClass("goldFire");$('#p25').removeClass("goldFire");$('#p26').removeClass("goldFire");$('#p27').removeClass("goldFire");$('#p28').removeClass("goldFire");$('#p29').removeClass("goldFire");
}

function parsePlayerFromRow(id) {
    const playerId = document.getElementById(id).innerHTML.split('<div hidden="">')[1].split('</div>')[0];
    for (const player of roster) {
        if (player.id == playerId) {
            selectedPlayer = player;
        }
    }
}

var captainIsSelected = false;
var scorerIsSelected = false;
var playmakerIsSelected = false;
var shooterIsSelected = false;
var blockerIsSelected = false;
var enforcerIsSelected = false;
var centerIsSelected = false;

$(function() {
  $('#captainButton').hover(function() {
    if (!captainIsSelected) {
      if (!scorerIsSelected) {
        $('#captainButton').addClass("lightFire");
        $('.goals-td').addClass("lightFire");
        $('#headGoals').addClass("lightFire");
        $('#statGoals').addClass("lightFire");
        $('#statGoals').html('+30 per');
      }
      if (!playmakerIsSelected) {
        $('#captainButton').addClass("lightFire");
        $('.assists-td').addClass("lightFire");
        $('#headAssists').addClass("lightFire");
        $('#statAssists').addClass("lightFire");
        $('#statAssists').html('+20 per');
      }
    }
  }, function() {
    if (!captainIsSelected) {
      if (!scorerIsSelected) {
        $('#captainButton').removeClass("lightFire");
        $('.goals-td').removeClass("lightFire");
        $('#headGoals').removeClass("lightFire");
        $('#statGoals').removeClass("lightFire");
        $('#statGoals').html('+15 per');
      }
      if (!playmakerIsSelected) {
        $('#captainButton').removeClass("lightFire");
        $('.assists-td').removeClass("lightFire");
        $('#headAssists').removeClass("lightFire");
        $('#statAssists').removeClass("lightFire");
        $('#statAssists').html('+10 per');
      }
    }
  });
});
$(function() {
  $('#captainButton').click(function() {

    if (captainIsSelected) {
      captainIsSelected = false;
      $('#captainButton').removeClass("fire");
      $('.goals-td').removeClass("fire");
      $('#headGoals').removeClass("fire");
      $('#statGoals').removeClass("fire");
      $('#captainButton').addClass("lightFire");
      $('.goals-td').addClass("lightFire");
      $('#headGoals').addClass("lightFire");
      $('#statGoals').addClass("lightFire");
      $('#statGoals').html('+30 per');
      $('.assists-td').removeClass("fire");
      $('#headAssists').removeClass("fire");
      $('#statAssists').removeClass("fire");
      $('.assists-td').addClass("lightFire");
      $('#headAssists').addClass("lightFire");
      $('#statAssists').addClass("lightFire");
      $('#statAssists').html('+20 per');
    } else {
      resetAllSelectedRoles();
      captainIsSelected = true;
      $('#captainButton').addClass("fire");
      $('.goals-td').addClass("fire");
      $('#headGoals').addClass("fire");
      $('#statGoals').addClass("fire");
      $('#statGoals').html('+30 per');
      $('.assists-td').addClass("fire");
      $('#headAssists').addClass("fire");
      $('#statAssists').addClass("fire");
      $('#statAssists').html('+20 per');
    }
  });
});




$(function() {
  $('#scorerButton').hover(function() {
    if (!scorerIsSelected) {
      $('#scorerButton').addClass("lightFire");
      if (!captainIsSelected) {
        $('.goals-td').addClass("lightFire");
        $('#headGoals').addClass("lightFire");
        $('#statGoals').addClass("lightFire");
        $('#statGoals').html('+30 per');
      }
    }
  }, function() {
    if (!scorerIsSelected) {
      $('#scorerButton').removeClass("lightFire");
      if (!captainIsSelected) {
        $('.goals-td').removeClass("lightFire");
        $('#headGoals').removeClass("lightFire");
        $('#statGoals').removeClass("lightFire");
        $('#statGoals').html('+15 per');
      }
    }
  });
});
$(function() {
  $('#scorerButton').click(function() {

    if (scorerIsSelected) {
      scorerIsSelected = false;
      $('#scorerButton').removeClass("fire");
      $('.goals-td').removeClass("fire");
      $('#headGoals').removeClass("fire");
      $('#statGoals').removeClass("fire");
      $('#scorerButton').addClass("lightFire");
      $('.goals-td').addClass("lightFire");
      $('#headGoals').addClass("lightFire");
      $('#statGoals').addClass("lightFire");
      $('#statGoals').html('+30 per');
    } else {
      resetAllSelectedRoles();
      scorerIsSelected = true;
      $('#scorerButton').addClass("fire");
      $('.goals-td').addClass("fire");
      $('#headGoals').addClass("fire");
      $('#statGoals').addClass("fire");
      $('#statGoals').html('+30 per');
    }
  });
});



$(function() {
  $('#playmakerButton').hover(function() {
    if (!playmakerIsSelected) {
      $('#playmakerButton').addClass("lightFire");
      if (!captainIsSelected) {
        $('.assists-td').addClass("lightFire");
        $('#headAssists').addClass("lightFire");
        $('#statAssists').addClass("lightFire");
        $('#statAssists').html('+20 per');
      }
    }
  }, function() {
    if (!playmakerIsSelected) {
      $('#playmakerButton').removeClass("lightFire");
      if (!captainIsSelected) {
        $('.assists-td').removeClass("lightFire");
        $('#headAssists').removeClass("lightFire");
        $('#statAssists').removeClass("lightFire");
        $('#statAssists').html('+10 per');
      }
    }
  });
});
$(function() {
  $('#playmakerButton').click(function() {
    if (playmakerIsSelected) {
      playmakerIsSelected = false;
      $('#playmakerButton').removeClass("fire");
      $('.assists-td').removeClass("fire");
      $('#headAssists').removeClass("fire");
      $('#statAssists').removeClass("fire");
      $('#playmakerButton').addClass("lightFire");
      $('.assists-td').addClass("lightFire");
      $('#headAssists').addClass("lightFire");
      $('#statAssists').addClass("lightFire");
      $('#statAssists').html('+20 per');
    } else {
      resetAllSelectedRoles();
      playmakerIsSelected = true;
      $('#playmakerButton').addClass("fire");
      $('.assists-td').addClass("fire");
      $('#headAssists').addClass("fire");
      $('#statAssists').addClass("fire");
      $('#statAssists').html('+20 per');
    }
  });
});




$(function() {
  $('#shooterButton').hover(function() {
    if (!shooterIsSelected) {
      $('#shooterButton').addClass("lightFire");
      $('.shots-td').addClass("lightFire");
      $('#headShots').addClass("lightFire");
      $('#statShots').addClass("lightFire");
      $('#statShots').html('+3 per');
    }
  }, function() {
    if (!shooterIsSelected) {
      $('#shooterButton').removeClass("lightFire");
      $('.shots-td').removeClass("lightFire");
      $('#headShots').removeClass("lightFire");
      $('#statShots').removeClass("lightFire");
      $('#statShots').html('+1 per');
    }
  });
});
$(function() {
  $('#shooterButton').click(function() {
    if (shooterIsSelected) {
      shooterIsSelected = false;
      $('#shooterButton').removeClass("fire");
      $('.shots-td').removeClass("fire");
      $('#headShots').removeClass("fire");
      $('#statBlocked').removeClass("fire");
      $('#shooterButton').addClass("lightFire");
      $('.shots-td').addClass("lightFire");
      $('#headShots').addClass("lightFire");
      $('#statShots').addClass("lightFire");
      $('#statShots').html('+3 per');
    } else {
      resetAllSelectedRoles();
      shooterIsSelected = true;
      $('#shooterButton').addClass("fire");
      $('.shots-td').addClass("fire");
      $('#headShots').addClass("fire");
      $('#statShots').addClass("fire");
      $('#statShots').html('+3 per');
    }
  });
});




$(function() {
  $('#blockerButton').hover(function() {
    if (!blockerIsSelected) {
      $('#blockerButton').addClass("lightFire");
      $('.blocked-td').addClass("lightFire");
      $('#headBlocked').addClass("lightFire");
      $('#statBlocked').addClass("lightFire");
      $('#statBlocked').html('+4 per');
    }
  }, function() {
    if (!blockerIsSelected) {
      $('#blockerButton').removeClass("lightFire");
      $('.blocked-td').removeClass("lightFire");
      $('#headBlocked').removeClass("lightFire");
      $('#statBlocked').removeClass("lightFire");
      $('#statBlocked').html('+1 per');
    }
  });
});
$(function() {
  $('#blockerButton').click(function() {
    if (blockerIsSelected) {
      blockerIsSelected = false;
      $('#blockerButton').removeClass("fire");
      $('.blocked-td').removeClass("fire");
      $('#headBlocked').removeClass("fire");
      $('#statBlocked').removeClass("fire");
      $('#blockerButton').addClass("lightFire");
      $('.blocked-td').addClass("lightFire");
      $('#headBlocked').addClass("lightFire");
      $('#statBlocked').addClass("lightFire");
      $('#statBlocked').html('+4 per');
    } else {
      resetAllSelectedRoles();
      blockerIsSelected = true;
      $('#blockerButton').addClass("fire");
      $('.blocked-td').addClass("fire");
      $('#headBlocked').addClass("fire");
      $('#statBlocked').addClass("fire");
      $('#statBlocked').html('+4 per');
    }
  });
});




$(function() {
  $('#enforcerButton').hover(function() {
    if (!enforcerIsSelected) {
      $('#enforcerButton').addClass("lightFire");
      $('.hits-td').addClass("lightFire");
      $('#headHits').addClass("lightFire");
      $('#statHits').addClass("lightFire");
      $('#statHits').html('+3 per');
    }
  }, function() {
    if (!enforcerIsSelected) {
      $('#enforcerButton').removeClass("lightFire");
      $('.hits-td').removeClass("lightFire");
      $('#headHits').removeClass("lightFire");
      $('#statHits').removeClass("lightFire");
      $('#statHits').html('+1 per');
    }
  });
});
$(function() {
  $('#enforcerButton').click(function() {
    if (enforcerIsSelected) {
      enforcerIsSelected = false;
      $('#enforcerButton').removeClass("fire");
      $('.hits-td').removeClass("fire");
      $('#headHits').removeClass("fire");
      $('#statHits').removeClass("fire");
      $('#enforcerButton').addClass("lightFire");
      $('.hits-td').addClass("lightFire");
      $('#headHits').addClass("lightFire");
      $('#statHits').addClass("lightFire");
      $('#statHits').html('+3 per');
    } else {
      resetAllSelectedRoles();
      enforcerIsSelected = true;
      $('#enforcerButton').addClass("fire");
      $('.hits-td').addClass("fire");
      $('#headHits').addClass("fire");
      $('#statHits').addClass("fire");
      $('#statHits').html('+3 per');
    }
  });
});




$(function() {
  $('#centerButton').hover(function() {
    if (!centerIsSelected) {
      $('#centerButton').addClass("lightFire");
      $('.faceOffPct-td').addClass("lightFire");
      $('#headFaceOffs').addClass("lightFire");
      $('#statFaceOffs').addClass("lightFire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    }
  }, function() {
    if (!centerIsSelected) {
      $('#centerButton').removeClass("lightFire");
      $('.faceOffPct-td').removeClass("lightFire");
      $('#headFaceOffs').removeClass("lightFire");
      $('#statFaceOffs').removeClass("lightFire");
      $('#statFaceOffs').html('+1 per win<br>-1 per loss');
    }
  });
});
$(function() {
  $('#centerButton').click(function() {
    if (centerIsSelected) {
      centerIsSelected = false;
      $('#centerButton').removeClass("fire");
      $('.faceOffPct-td').removeClass("fire");
      $('#headFaceOffs').removeClass("fire");
      $('#statFaceOffs').removeClass("fire");
      $('#centerButton').addClass("lightFire");
      $('.faceOffPct-td').addClass("lightFire");
      $('#headFaceOffs').addClass("lightFire");
      $('#statFaceOffs').addClass("lightFire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    } else {
      resetAllSelectedRoles();
      centerIsSelected = true;
      $('#centerButton').addClass("fire");
      $('.faceOffPct-td').addClass("fire");
      $('#headFaceOffs').addClass("fire");
      $('#statFaceOffs').addClass("fire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    }
  });
});




function resetAllSelectedRoles() {
  captainIsSelected = false;
  scorerIsSelected = false;
  playmakerIsSelected = false;
  shooterIsSelected = false;
  blockerIsSelected = false;
  enforcerIsSelected = false;
  centerIsSelected = false;
  $('#captainButton').removeClass("lightFire");
  $('#scorerButton').removeClass("lightFire");
  $('#playmakerButton').removeClass("lightFire");
  $('#shooterButton').removeClass("lightFire");
  $('#blockerButton').removeClass("lightFire");
  $('#enforcerButton').removeClass("lightFire");
  $('#centerButton').removeClass("lightFire");

  $('#captainButton').removeClass("fire");
  $('#scorerButton').removeClass("fire");
  $('#playmakerButton').removeClass("fire");
  $('#shooterButton').removeClass("fire");
  $('#blockerButton').removeClass("fire");
  $('#enforcerButton').removeClass("fire");
  $('#centerButton').removeClass("fire");

  $('.goals-td').removeClass("lightFire");
  $('#headGoals').removeClass("lightFire");
  $('#statGoals').removeClass("lightFire");
  $('.assists-td').removeClass("lightFire");
  $('#headAssists').removeClass("lightFire");
  $('#statAssists').removeClass("lightFire");
  $('.shots-td').removeClass("lightFire");
  $('#headShots').removeClass("lightFire");
  $('#statShots').removeClass("lightFire");
  $('.blocked-td').removeClass("lightFire");
  $('#headBlocked').removeClass("lightFire");
  $('#statBlocked').removeClass("lightFire");
  $('.hits-td').removeClass("lightFire");
  $('#headHits').removeClass("lightFire");
  $('#statHits').removeClass("lightFire");
  $('.faceOffPct-td').removeClass("lightFire");
  $('#headFaceOffs').removeClass("lightFire");
  $('#statFaceOffs').removeClass("lightFire");
  $('.goals-td').removeClass("fire");
  $('#headGoals').removeClass("fire");
  $('#statGoals').removeClass("fire");
  $('.assists-td').removeClass("fire");
  $('#headAssists').removeClass("fire");
  $('#statAssists').removeClass("fire");
  $('.shots-td').removeClass("fire");
  $('#headShots').removeClass("fire");
  $('#statShots').removeClass("fire");
  $('.blocked-td').removeClass("fire");
  $('#headBlocked').removeClass("fire");
  $('#statBlocked').removeClass("fire");
  $('.hits-td').removeClass("fire");
  $('#headHits').removeClass("fire");
  $('#statHits').removeClass("fire");
  $('.faceOffPct-td').removeClass("fire");
  $('#headFaceOffs').removeClass("fire");
  $('#statFaceOffs').removeClass("fire");

  $('#statGoals').html('+15 per');
  $('#statAssists').html('+10 per');
  $('#statShots').html('+1 per');
  $('#statBlocked').html('+1 per');
  $('#statHits').html('+1 per');
  $('#statFaceOffs').html('+1 per win<br>-1 per loss');
}
