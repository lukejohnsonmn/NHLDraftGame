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

var selectedTeamId = "Select";
var captainIsSelected = false;
var scorerIsSelected = false;
var playmakerIsSelected = false;
var shooterIsSelected = false;
var blockerIsSelected = false;
var enforcerIsSelected = false;
var centerIsSelected = false;

var selectedPlayer = null;

var playerButtonsHTML = '<button type="button" class="roleButton" id="captainButton" onclick="light(0)">Captain<div class="subButton">Goals x2 & Assists x2</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="scorerButton" onclick="light(0)">Scorer<div class="subButton">Goals x2</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="playmakerButton" onclick="light(0)">Playmaker<div class="subButton">Assists x2</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="shooterButton" onclick="light(0)">Shooter<div class="subButton">Shots x3</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="blockerButton" onclick="light(0)">Blocker<div class="subButton">Blocked Shots x4</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="enforcerButton" onclick="light(0)">Enforcer<div class="subButton">Hits x3</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="centerButton" onclick="light(0)">Center<div class="subButton">Face Off Wins x2</div></button>';

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
    const myUrl = "http://localhost:8080/get-season-stats?" + selectedTeamId;
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
    htmlStr += '<td class="name-td">' + player.fullName + '</td>';
    if (finalRow) {
        htmlStr += '<td class="final-row salary-td">' + player.salary + '</td>';
    } else {
        htmlStr += '<td class="salary-td">' + player.salary + '</td>';
    }
    
    htmlStr += '<td class="gamesPlayed-td">' + player.games + '</td>';
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



function selectTeam() {
  selectedTeamId = document.getElementById("teamDropdown").value;
  beforeLoadingPlayers();
  setTimeout(function() {
    getSeasonStats();
    afterLoadingPlayers();
  }, 0);
  
  
}

function beforeLoadingPlayers() {
  selectColorScheme();
  resetAllSelectedPlayers();
  resetAllSelectedRoles();
  $("#playerTable").hide();
  document.getElementById('roleButtons').innerHTML = '<div>Loading Season Stats...</div>';
}

function afterLoadingPlayers() {
  document.getElementById('roleButtons').innerHTML = playerButtonsHTML;
  afterPlayerRowsLoaded();
  $("#playerTable").show();
}

function parsePlayerFromRow(id) {
  const playerId = document.getElementById(id).innerHTML.split('<div hidden="">')[1].split('</div>')[0];
  for (const player of roster) {
      if (player.id == playerId) {
          selectedPlayer = player;
      }
  }
}


function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function selectColorScheme() {
  switch(selectedTeamId) {
    case 'Avalanche':Avalanche();break;
    case 'Blackhawks':Blackhawks();break;
    case 'BlueJackets':BlueJackets();break;
    case 'Blues':Blues();break;
    case 'Bruins':Bruins();break;
    case 'Canadiens':Canadiens();break;
    case 'Canucks':Canucks();break;
    case 'Capitals':Capitals();break;
    case 'Coyotes':Coyotes();break;
    case 'Devils':Devils();break;
    case 'Ducks':Ducks();break;
    case 'Flames':Flames();break;
    case 'Flyers':Flyers();break;
    case 'GoldenKnights':GoldenKnights();break;
    case 'Hurricanes':Hurricanes();break;
    case 'Islanders':Islanders();break;
    case 'Jets':Jets();break;
    case 'Kings':Kings();break;
    case 'Kraken':Kraken();break;
    case 'Lightning':Lightning();break;
    case 'MapleLeafs':MapleLeafs();break;
    case 'Oilers':Oilers();break;
    case 'Panthers':Panthers();break;
    case 'Penguins':Penguins();break;
    case 'Predators':Predators();break;
    case 'Rangers':Rangers();break;
    case 'RedWings':RedWings();break;
    case 'Sabres':Sabres();break;
    case 'Senators':Senators();break;
    case 'Sharks':Sharks();break;
    case 'Stars':Stars();break;
    case 'Wild':Wild();break;
    default:Wild();
  }
}





function afterPlayerRowsLoaded() {

    var p0Selected = false;var p1Selected = false;var p2Selected = false;var p3Selected = false;var p4Selected = false;
    var p5Selected = false;var p6Selected = false;var p7Selected = false;var p8Selected = false;var p9Selected = false;
    var p10Selected = false;var p11Selected = false;var p12Selected = false;var p13Selected = false;var p14Selected = false;
    var p15Selected = false;var p16Selected = false;var p17Selected = false;var p18Selected = false;var p19Selected = false;
    var p20Selected = false;var p21Selected = false;var p22Selected = false;var p23Selected = false;var p24Selected = false;
    var p25Selected = false;var p26Selected = false;var p27Selected = false;var p28Selected = false;var p29Selected = false;
    var p30Selected = false;var p31Selected = false;var p32Selected = false;var p33Selected = false;var p34Selected = false;
    var p35Selected = false;var p36Selected = false;var p37Selected = false;var p38Selected = false;var p39Selected = false;
    var p40Selected = false;var p41Selected = false;var p42Selected = false;var p43Selected = false;var p44Selected = false;
    var p45Selected = false;var p46Selected = false;var p47Selected = false;var p48Selected = false;var p49Selected = false;

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
    $(function() {$('#p30').hover(function() {if (!p30Selected) {$("#p30").addClass("lightGoldFire");}}, function() {if (!p30Selected) {$("#p30").removeClass("lightGoldFire");}});});
    $(function() {$('#p31').hover(function() {if (!p31Selected) {$("#p31").addClass("lightGoldFire");}}, function() {if (!p31Selected) {$("#p31").removeClass("lightGoldFire");}});});
    $(function() {$('#p32').hover(function() {if (!p32Selected) {$("#p32").addClass("lightGoldFire");}}, function() {if (!p32Selected) {$("#p32").removeClass("lightGoldFire");}});});
    $(function() {$('#p33').hover(function() {if (!p33Selected) {$("#p33").addClass("lightGoldFire");}}, function() {if (!p33Selected) {$("#p33").removeClass("lightGoldFire");}});});
    $(function() {$('#p34').hover(function() {if (!p34Selected) {$("#p34").addClass("lightGoldFire");}}, function() {if (!p34Selected) {$("#p34").removeClass("lightGoldFire");}});});
    $(function() {$('#p35').hover(function() {if (!p35Selected) {$("#p35").addClass("lightGoldFire");}}, function() {if (!p35Selected) {$("#p35").removeClass("lightGoldFire");}});});
    $(function() {$('#p36').hover(function() {if (!p36Selected) {$("#p36").addClass("lightGoldFire");}}, function() {if (!p36Selected) {$("#p36").removeClass("lightGoldFire");}});});
    $(function() {$('#p37').hover(function() {if (!p37Selected) {$("#p37").addClass("lightGoldFire");}}, function() {if (!p37Selected) {$("#p37").removeClass("lightGoldFire");}});});
    $(function() {$('#p38').hover(function() {if (!p38Selected) {$("#p38").addClass("lightGoldFire");}}, function() {if (!p38Selected) {$("#p38").removeClass("lightGoldFire");}});});
    $(function() {$('#p39').hover(function() {if (!p39Selected) {$("#p39").addClass("lightGoldFire");}}, function() {if (!p39Selected) {$("#p39").removeClass("lightGoldFire");}});});
    $(function() {$('#p40').hover(function() {if (!p40Selected) {$("#p40").addClass("lightGoldFire");}}, function() {if (!p40Selected) {$("#p40").removeClass("lightGoldFire");}});});
    $(function() {$('#p41').hover(function() {if (!p41Selected) {$("#p41").addClass("lightGoldFire");}}, function() {if (!p41Selected) {$("#p41").removeClass("lightGoldFire");}});});
    $(function() {$('#p42').hover(function() {if (!p42Selected) {$("#p42").addClass("lightGoldFire");}}, function() {if (!p42Selected) {$("#p42").removeClass("lightGoldFire");}});});
    $(function() {$('#p43').hover(function() {if (!p43Selected) {$("#p43").addClass("lightGoldFire");}}, function() {if (!p43Selected) {$("#p43").removeClass("lightGoldFire");}});});
    $(function() {$('#p44').hover(function() {if (!p44Selected) {$("#p44").addClass("lightGoldFire");}}, function() {if (!p44Selected) {$("#p44").removeClass("lightGoldFire");}});});
    $(function() {$('#p45').hover(function() {if (!p45Selected) {$("#p45").addClass("lightGoldFire");}}, function() {if (!p45Selected) {$("#p45").removeClass("lightGoldFire");}});});
    $(function() {$('#p46').hover(function() {if (!p46Selected) {$("#p46").addClass("lightGoldFire");}}, function() {if (!p46Selected) {$("#p46").removeClass("lightGoldFire");}});});
    $(function() {$('#p47').hover(function() {if (!p47Selected) {$("#p47").addClass("lightGoldFire");}}, function() {if (!p47Selected) {$("#p47").removeClass("lightGoldFire");}});});
    $(function() {$('#p48').hover(function() {if (!p48Selected) {$("#p48").addClass("lightGoldFire");}}, function() {if (!p48Selected) {$("#p48").removeClass("lightGoldFire");}});});
    $(function() {$('#p49').hover(function() {if (!p49Selected) {$("#p49").addClass("lightGoldFire");}}, function() {if (!p49Selected) {$("#p49").removeClass("lightGoldFire");}});});

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
    $(function() {$('#p30').click(function() {resetAllSelectedPlayers();if (p30Selected) {p30Selected = false;selectedPlayer = null;$("#p30").addClass("lightGoldFire");} else {resetAllSelectedStatus();p30Selected = true;selectedPlayer = parsePlayerFromRow('p30');$("#p30").addClass("goldFire");}});});
    $(function() {$('#p31').click(function() {resetAllSelectedPlayers();if (p31Selected) {p31Selected = false;selectedPlayer = null;$("#p31").addClass("lightGoldFire");} else {resetAllSelectedStatus();p31Selected = true;selectedPlayer = parsePlayerFromRow('p31');$("#p31").addClass("goldFire");}});});
    $(function() {$('#p32').click(function() {resetAllSelectedPlayers();if (p32Selected) {p32Selected = false;selectedPlayer = null;$("#p32").addClass("lightGoldFire");} else {resetAllSelectedStatus();p32Selected = true;selectedPlayer = parsePlayerFromRow('p32');$("#p32").addClass("goldFire");}});});
    $(function() {$('#p33').click(function() {resetAllSelectedPlayers();if (p33Selected) {p33Selected = false;selectedPlayer = null;$("#p33").addClass("lightGoldFire");} else {resetAllSelectedStatus();p33Selected = true;selectedPlayer = parsePlayerFromRow('p33');$("#p33").addClass("goldFire");}});});
    $(function() {$('#p34').click(function() {resetAllSelectedPlayers();if (p34Selected) {p34Selected = false;selectedPlayer = null;$("#p34").addClass("lightGoldFire");} else {resetAllSelectedStatus();p34Selected = true;selectedPlayer = parsePlayerFromRow('p34');$("#p34").addClass("goldFire");}});});
    $(function() {$('#p35').click(function() {resetAllSelectedPlayers();if (p35Selected) {p35Selected = false;selectedPlayer = null;$("#p35").addClass("lightGoldFire");} else {resetAllSelectedStatus();p35Selected = true;selectedPlayer = parsePlayerFromRow('p35');$("#p35").addClass("goldFire");}});});
    $(function() {$('#p36').click(function() {resetAllSelectedPlayers();if (p36Selected) {p36Selected = false;selectedPlayer = null;$("#p36").addClass("lightGoldFire");} else {resetAllSelectedStatus();p36Selected = true;selectedPlayer = parsePlayerFromRow('p36');$("#p36").addClass("goldFire");}});});
    $(function() {$('#p37').click(function() {resetAllSelectedPlayers();if (p37Selected) {p37Selected = false;selectedPlayer = null;$("#p37").addClass("lightGoldFire");} else {resetAllSelectedStatus();p37Selected = true;selectedPlayer = parsePlayerFromRow('p37');$("#p37").addClass("goldFire");}});});
    $(function() {$('#p38').click(function() {resetAllSelectedPlayers();if (p38Selected) {p38Selected = false;selectedPlayer = null;$("#p38").addClass("lightGoldFire");} else {resetAllSelectedStatus();p38Selected = true;selectedPlayer = parsePlayerFromRow('p38');$("#p38").addClass("goldFire");}});});
    $(function() {$('#p39').click(function() {resetAllSelectedPlayers();if (p39Selected) {p39Selected = false;selectedPlayer = null;$("#p39").addClass("lightGoldFire");} else {resetAllSelectedStatus();p39Selected = true;selectedPlayer = parsePlayerFromRow('p39');$("#p39").addClass("goldFire");}});});
    $(function() {$('#p40').click(function() {resetAllSelectedPlayers();if (p40Selected) {p40Selected = false;selectedPlayer = null;$("#p40").addClass("lightGoldFire");} else {resetAllSelectedStatus();p40Selected = true;selectedPlayer = parsePlayerFromRow('p40');$("#p40").addClass("goldFire");}});});
    $(function() {$('#p41').click(function() {resetAllSelectedPlayers();if (p41Selected) {p41Selected = false;selectedPlayer = null;$("#p41").addClass("lightGoldFire");} else {resetAllSelectedStatus();p41Selected = true;selectedPlayer = parsePlayerFromRow('p41');$("#p41").addClass("goldFire");}});});
    $(function() {$('#p42').click(function() {resetAllSelectedPlayers();if (p42Selected) {p42Selected = false;selectedPlayer = null;$("#p42").addClass("lightGoldFire");} else {resetAllSelectedStatus();p42Selected = true;selectedPlayer = parsePlayerFromRow('p42');$("#p42").addClass("goldFire");}});});
    $(function() {$('#p43').click(function() {resetAllSelectedPlayers();if (p43Selected) {p43Selected = false;selectedPlayer = null;$("#p43").addClass("lightGoldFire");} else {resetAllSelectedStatus();p43Selected = true;selectedPlayer = parsePlayerFromRow('p43');$("#p43").addClass("goldFire");}});});
    $(function() {$('#p44').click(function() {resetAllSelectedPlayers();if (p44Selected) {p44Selected = false;selectedPlayer = null;$("#p44").addClass("lightGoldFire");} else {resetAllSelectedStatus();p44Selected = true;selectedPlayer = parsePlayerFromRow('p44');$("#p44").addClass("goldFire");}});});
    $(function() {$('#p45').click(function() {resetAllSelectedPlayers();if (p45Selected) {p45Selected = false;selectedPlayer = null;$("#p45").addClass("lightGoldFire");} else {resetAllSelectedStatus();p45Selected = true;selectedPlayer = parsePlayerFromRow('p45');$("#p45").addClass("goldFire");}});});
    $(function() {$('#p46').click(function() {resetAllSelectedPlayers();if (p46Selected) {p46Selected = false;selectedPlayer = null;$("#p46").addClass("lightGoldFire");} else {resetAllSelectedStatus();p46Selected = true;selectedPlayer = parsePlayerFromRow('p46');$("#p46").addClass("goldFire");}});});
    $(function() {$('#p47').click(function() {resetAllSelectedPlayers();if (p47Selected) {p47Selected = false;selectedPlayer = null;$("#p47").addClass("lightGoldFire");} else {resetAllSelectedStatus();p47Selected = true;selectedPlayer = parsePlayerFromRow('p47');$("#p47").addClass("goldFire");}});});
    $(function() {$('#p48').click(function() {resetAllSelectedPlayers();if (p48Selected) {p48Selected = false;selectedPlayer = null;$("#p48").addClass("lightGoldFire");} else {resetAllSelectedStatus();p48Selected = true;selectedPlayer = parsePlayerFromRow('p48');$("#p48").addClass("goldFire");}});});
    $(function() {$('#p49').click(function() {resetAllSelectedPlayers();if (p49Selected) {p49Selected = false;selectedPlayer = null;$("#p49").addClass("lightGoldFire");} else {resetAllSelectedStatus();p49Selected = true;selectedPlayer = parsePlayerFromRow('p49');$("#p49").addClass("goldFire");}});});

    $(function() {
      $('#captainButton').hover(function() {
        if (!captainIsSelected) {
          if (!scorerIsSelected) {
            $('#captainButton').addClass("lightFire");
            $('.goals-td').addClass("lightFire");
            $('#headGoals').addClass("lightFire");
            $('#statGoals').addClass("blackFire");
            $('#statGoals').html('+30 per');
          }
          if (!playmakerIsSelected) {
            $('#captainButton').addClass("lightFire");
            $('.assists-td').addClass("lightFire");
            $('#headAssists').addClass("lightFire");
            $('#statAssists').addClass("blackFire");
            $('#statAssists').html('+20 per');
          }
        }
      }, function() {
        if (!captainIsSelected) {
          if (!scorerIsSelected) {
            $('#captainButton').removeClass("lightFire");
            $('.goals-td').removeClass("lightFire");
            $('#headGoals').removeClass("lightFire");
            $('#statGoals').removeClass("blackFire");
            $('#statGoals').html('+15 per');
          }
          if (!playmakerIsSelected) {
            $('#captainButton').removeClass("lightFire");
            $('.assists-td').removeClass("lightFire");
            $('#headAssists').removeClass("lightFire");
            $('#statAssists').removeClass("blackFire");
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
          $('#statGoals').removeClass("blackFire");
          $('#captainButton').addClass("lightFire");
          $('.goals-td').addClass("lightFire");
          $('#headGoals').addClass("lightFire");
          $('#statGoals').addClass("blackFire");
          $('#statGoals').html('+30 per');
          $('.assists-td').removeClass("fire");
          $('#headAssists').removeClass("fire");
          $('#statAssists').removeClass("blackFire");
          $('.assists-td').addClass("lightFire");
          $('#headAssists').addClass("lightFire");
          $('#statAssists').addClass("blackFire");
          $('#statAssists').html('+20 per');
        } else {
          resetAllSelectedRoles();
          captainIsSelected = true;
          $('#captainButton').addClass("fire");
          $('.goals-td').addClass("fire");
          $('#headGoals').addClass("fire");
          $('#statGoals').addClass("blackFire");
          $('#statGoals').html('+30 per');
          $('.assists-td').addClass("fire");
          $('#headAssists').addClass("fire");
          $('#statAssists').addClass("blackFire");
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
            $('#statGoals').addClass("blackFire");
            $('#statGoals').html('+30 per');
          }
        }
      }, function() {
        if (!scorerIsSelected) {
          $('#scorerButton').removeClass("lightFire");
          if (!captainIsSelected) {
            $('.goals-td').removeClass("lightFire");
            $('#headGoals').removeClass("lightFire");
            $('#statGoals').removeClass("blackFire");
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
          $('#statGoals').removeClass("blackFire");
          $('#scorerButton').addClass("lightFire");
          $('.goals-td').addClass("lightFire");
          $('#headGoals').addClass("lightFire");
          $('#statGoals').addClass("blackFire");
          $('#statGoals').html('+30 per');
        } else {
          resetAllSelectedRoles();
          scorerIsSelected = true;
          $('#scorerButton').addClass("fire");
          $('.goals-td').addClass("fire");
          $('#headGoals').addClass("fire");
          $('#statGoals').addClass("blackFire");
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
            $('#statAssists').addClass("blackFire");
            $('#statAssists').html('+20 per');
          }
        }
      }, function() {
        if (!playmakerIsSelected) {
          $('#playmakerButton').removeClass("lightFire");
          if (!captainIsSelected) {
            $('.assists-td').removeClass("lightFire");
            $('#headAssists').removeClass("lightFire");
            $('#statAssists').removeClass("blackFire");
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
          $('#statAssists').removeClass("blackFire");
          $('#playmakerButton').addClass("lightFire");
          $('.assists-td').addClass("lightFire");
          $('#headAssists').addClass("lightFire");
          $('#statAssists').addClass("blackFire");
          $('#statAssists').html('+20 per');
        } else {
          resetAllSelectedRoles();
          playmakerIsSelected = true;
          $('#playmakerButton').addClass("fire");
          $('.assists-td').addClass("fire");
          $('#headAssists').addClass("fire");
          $('#statAssists').addClass("blackFire");
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
          $('#statShots').addClass("blackFire");
          $('#statShots').html('+3 per');
        }
      }, function() {
        if (!shooterIsSelected) {
          $('#shooterButton').removeClass("lightFire");
          $('.shots-td').removeClass("lightFire");
          $('#headShots').removeClass("lightFire");
          $('#statShots').removeClass("blackFire");
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
          $('#statShots').removeClass("blackFire");
          $('#shooterButton').addClass("lightFire");
          $('.shots-td').addClass("lightFire");
          $('#headShots').addClass("lightFire");
          $('#statShots').addClass("blackFire");
          $('#statShots').html('+3 per');
        } else {
          resetAllSelectedRoles();
          shooterIsSelected = true;
          $('#shooterButton').addClass("fire");
          $('.shots-td').addClass("fire");
          $('#headShots').addClass("fire");
          $('#statShots').addClass("blackFire");
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
          $('#statBlocked').addClass("blackFire");
          $('#statBlocked').html('+4 per');
        }
      }, function() {
        if (!blockerIsSelected) {
          $('#blockerButton').removeClass("lightFire");
          $('.blocked-td').removeClass("lightFire");
          $('#headBlocked').removeClass("lightFire");
          $('#statBlocked').removeClass("blackFire");
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
          $('#statBlocked').removeClass("blackFire");
          $('#blockerButton').addClass("lightFire");
          $('.blocked-td').addClass("lightFire");
          $('#headBlocked').addClass("lightFire");
          $('#statBlocked').addClass("blackFire");
          $('#statBlocked').html('+4 per');
        } else {
          resetAllSelectedRoles();
          blockerIsSelected = true;
          $('#blockerButton').addClass("fire");
          $('.blocked-td').addClass("fire");
          $('#headBlocked').addClass("fire");
          $('#statBlocked').addClass("blackFire");
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
          $('#statHits').addClass("blackFire");
          $('#statHits').html('+3 per');
        }
      }, function() {
        if (!enforcerIsSelected) {
          $('#enforcerButton').removeClass("lightFire");
          $('.hits-td').removeClass("lightFire");
          $('#headHits').removeClass("lightFire");
          $('#statHits').removeClass("blackFire");
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
          $('#statHits').removeClass("blackFire");
          $('#enforcerButton').addClass("lightFire");
          $('.hits-td').addClass("lightFire");
          $('#headHits').addClass("lightFire");
          $('#statHits').addClass("blackFire");
          $('#statHits').html('+3 per');
        } else {
          resetAllSelectedRoles();
          enforcerIsSelected = true;
          $('#enforcerButton').addClass("fire");
          $('.hits-td').addClass("fire");
          $('#headHits').addClass("fire");
          $('#statHits').addClass("blackFire");
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
          $('#statFaceOffs').addClass("blackFire");
          $('#statFaceOffs').html('+2 per win<br>-1 per loss');
        }
      }, function() {
        if (!centerIsSelected) {
          $('#centerButton').removeClass("lightFire");
          $('.faceOffPct-td').removeClass("lightFire");
          $('#headFaceOffs').removeClass("lightFire");
          $('#statFaceOffs').removeClass("blackFire");
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
          $('#statFaceOffs').removeClass("blackFire");
          $('#centerButton').addClass("lightFire");
          $('.faceOffPct-td').addClass("lightFire");
          $('#headFaceOffs').addClass("lightFire");
          $('#statFaceOffs').addClass("blackFire");
          $('#statFaceOffs').html('+2 per win<br>-1 per loss');
        } else {
          resetAllSelectedRoles();
          centerIsSelected = true;
          $('#centerButton').addClass("fire");
          $('.faceOffPct-td').addClass("fire");
          $('#headFaceOffs').addClass("fire");
          $('#statFaceOffs').addClass("blackFire");
          $('#statFaceOffs').html('+2 per win<br>-1 per loss');
        }
      });
    });

    function resetAllSelectedStatus() {
        p0Selected = false;p1Selected = false;p2Selected = false;p3Selected = false;p4Selected = false;
        p5Selected = false;p6Selected = false;p7Selected = false;p8Selected = false;p9Selected = false;
        p10Selected = false;p11Selected = false;p12Selected = false;p13Selected = false;p14Selected = false;
        p15Selected = false;p16Selected = false;p17Selected = false;p18Selected = false;p19Selected = false;
        p20Selected = false;p21Selected = false;p22Selected = false;p23Selected = false;p24Selected = false;
        p25Selected = false;p26Selected = false;p27Selected = false;p28Selected = false;p29Selected = false;
        p30Selected = false;p31Selected = false;p32Selected = false;p33Selected = false;p34Selected = false;
        p35Selected = false;p36Selected = false;p37Selected = false;p38Selected = false;p39Selected = false;
        p40Selected = false;p41Selected = false;p42Selected = false;p43Selected = false;p44Selected = false;
        p45Selected = false;p46Selected = false;p47Selected = false;p48Selected = false;p49Selected = false;
    }
}

function resetAllSelectedPlayers() {
    selectedPlayer = null;

    $('#p0').removeClass("lightGoldFire");$('#p1').removeClass("lightGoldFire");$('#p2').removeClass("lightGoldFire");$('#p3').removeClass("lightGoldFire");$('#p4').removeClass("lightGoldFire");
    $('#p5').removeClass("lightGoldFire");$('#p6').removeClass("lightGoldFire");$('#p7').removeClass("lightGoldFire");$('#p8').removeClass("lightGoldFire");$('#p9').removeClass("lightGoldFire");
    $('#p10').removeClass("lightGoldFire");$('#p11').removeClass("lightGoldFire");$('#p12').removeClass("lightGoldFire");$('#p13').removeClass("lightGoldFire");$('#p14').removeClass("lightGoldFire");
    $('#p15').removeClass("lightGoldFire");$('#p16').removeClass("lightGoldFire");$('#p17').removeClass("lightGoldFire");$('#p18').removeClass("lightGoldFire");$('#p19').removeClass("lightGoldFire");
    $('#p20').removeClass("lightGoldFire");$('#p21').removeClass("lightGoldFire");$('#p22').removeClass("lightGoldFire");$('#p23').removeClass("lightGoldFire");$('#p24').removeClass("lightGoldFire");
    $('#p25').removeClass("lightGoldFire");$('#p26').removeClass("lightGoldFire");$('#p27').removeClass("lightGoldFire");$('#p28').removeClass("lightGoldFire");$('#p29').removeClass("lightGoldFire");
    $('#p30').removeClass("lightGoldFire");$('#p31').removeClass("lightGoldFire");$('#p32').removeClass("lightGoldFire");$('#p33').removeClass("lightGoldFire");$('#p34').removeClass("lightGoldFire");
    $('#p35').removeClass("lightGoldFire");$('#p36').removeClass("lightGoldFire");$('#p37').removeClass("lightGoldFire");$('#p38').removeClass("lightGoldFire");$('#p39').removeClass("lightGoldFire");
    $('#p40').removeClass("lightGoldFire");$('#p41').removeClass("lightGoldFire");$('#p42').removeClass("lightGoldFire");$('#p43').removeClass("lightGoldFire");$('#p44').removeClass("lightGoldFire");
    $('#p45').removeClass("lightGoldFire");$('#p46').removeClass("lightGoldFire");$('#p47').removeClass("lightGoldFire");$('#p48').removeClass("lightGoldFire");$('#p49').removeClass("lightGoldFire");

    $('#p0').removeClass("goldFire");$('#p1').removeClass("goldFire");$('#p2').removeClass("goldFire");$('#p3').removeClass("goldFire");$('#p4').removeClass("goldFire");
    $('#p5').removeClass("goldFire");$('#p6').removeClass("goldFire");$('#p7').removeClass("goldFire");$('#p8').removeClass("goldFire");$('#p9').removeClass("goldFire");
    $('#p10').removeClass("goldFire");$('#p11').removeClass("goldFire");$('#p12').removeClass("goldFire");$('#p13').removeClass("goldFire");$('#p14').removeClass("goldFire");
    $('#p15').removeClass("goldFire");$('#p16').removeClass("goldFire");$('#p17').removeClass("goldFire");$('#p18').removeClass("goldFire");$('#p19').removeClass("goldFire");
    $('#p20').removeClass("goldFire");$('#p21').removeClass("goldFire");$('#p22').removeClass("goldFire");$('#p23').removeClass("goldFire");$('#p24').removeClass("goldFire");
    $('#p25').removeClass("goldFire");$('#p26').removeClass("goldFire");$('#p27').removeClass("goldFire");$('#p28').removeClass("goldFire");$('#p29').removeClass("goldFire");
    $('#p30').removeClass("goldFire");$('#p31').removeClass("goldFire");$('#p32').removeClass("goldFire");$('#p33').removeClass("goldFire");$('#p34').removeClass("goldFire");
    $('#p35').removeClass("goldFire");$('#p36').removeClass("goldFire");$('#p37').removeClass("goldFire");$('#p38').removeClass("goldFire");$('#p39').removeClass("goldFire");
    $('#p40').removeClass("goldFire");$('#p41').removeClass("goldFire");$('#p42').removeClass("goldFire");$('#p43').removeClass("goldFire");$('#p44').removeClass("goldFire");
    $('#p45').removeClass("goldFire");$('#p46').removeClass("goldFire");$('#p47').removeClass("goldFire");$('#p48').removeClass("goldFire");$('#p49').removeClass("goldFire");
}

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
  $('#statGoals').removeClass("blackFire");
  $('.assists-td').removeClass("lightFire");
  $('#headAssists').removeClass("lightFire");
  $('#statAssists').removeClass("blackFire");
  $('.shots-td').removeClass("lightFire");
  $('#headShots').removeClass("lightFire");
  $('#statShots').removeClass("blackFire");
  $('.blocked-td').removeClass("lightFire");
  $('#headBlocked').removeClass("lightFire");
  $('#statBlocked').removeClass("blackFire");
  $('.hits-td').removeClass("lightFire");
  $('#headHits').removeClass("lightFire");
  $('#statHits').removeClass("blackFire");
  $('.faceOffPct-td').removeClass("lightFire");
  $('#headFaceOffs').removeClass("lightFire");
  $('#statFaceOffs').removeClass("blackFire");
  $('.goals-td').removeClass("fire");
  $('#headGoals').removeClass("fire");
  $('#statGoals').removeClass("blackFire");
  $('.assists-td').removeClass("fire");
  $('#headAssists').removeClass("fire");
  $('#statAssists').removeClass("blackFire");
  $('.shots-td').removeClass("fire");
  $('#headShots').removeClass("fire");
  $('#statShots').removeClass("blackFire");
  $('.blocked-td').removeClass("fire");
  $('#headBlocked').removeClass("fire");
  $('#statBlocked').removeClass("blackFire");
  $('.hits-td').removeClass("fire");
  $('#headHits').removeClass("fire");
  $('#statHits').removeClass("blackFire");
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

var r = document.querySelector(':root');

function Avalanche() {
  r.style.setProperty('--primaryLight', '#4c1a2a');
  r.style.setProperty('--primary', '#39141f');
  r.style.setProperty('--primaryDark', '#260d15');
  //r.style.setProperty('--secondary', '#236192');
  r.style.setProperty('--secondaryLight', '#5ba1d7');
  r.style.setProperty('--secondaryDark', '#286ea4');
}

function Blackhawks() {
  r.style.setProperty('--primaryLight', '#610514');
  r.style.setProperty('--primary', '#49030f');
  r.style.setProperty('--primaryDark', '#31020a');
  //r.style.setProperty('--secondary', '#FFD100');
  r.style.setProperty('--secondaryLight', '#ffda33');
  r.style.setProperty('--secondaryDark', '#cca700');
}

function BlueJackets() {
  r.style.setProperty('--primaryLight', '#002e66');
  r.style.setProperty('--primary', '#00224d');
  r.style.setProperty('--primaryDark', '#001733');
  //r.style.setProperty('--secondary', '#CE1126');
  r.style.setProperty('--secondaryLight', '#f04257');
  r.style.setProperty('--secondaryDark', '#bd0f24');
}

function Blues() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  //r.style.setProperty('--secondary', '#FCB514');
  r.style.setProperty('--secondaryLight', '#fcc136');
  r.style.setProperty('--secondaryDark', '#c98e03');
}

function Bruins() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  //r.style.setProperty('--secondary', '#FFB81C');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Canadiens() {
  r.style.setProperty('--primaryLight', '#570f16');
  r.style.setProperty('--primary', '#410b11');
  r.style.setProperty('--primaryDark', '#2c070b');
  //r.style.setProperty('--secondary', '#192168');
  r.style.setProperty('--secondaryLight', '#5b67d7');
  r.style.setProperty('--secondaryDark', '#2834a4');
}

function Canucks() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  //r.style.setProperty('--secondary', '#192168');
  r.style.setProperty('--secondaryLight', '#33ff92');
  r.style.setProperty('--secondaryDark', '#00cc5f');
}

function Capitals() {
  r.style.setProperty('--primaryLight', '#5e0816');
  r.style.setProperty('--primary', '#470611');
  r.style.setProperty('--primaryDark', '#2f040b');
  //r.style.setProperty('--secondary', '#041E42');
  r.style.setProperty('--secondaryLight', '#3e8af4');
  r.style.setProperty('--secondaryDark', '#267bf2');
}

function Coyotes() {
  r.style.setProperty('--primaryLight', '#50161e');
  r.style.setProperty('--primary', '#3c1016');
  r.style.setProperty('--primaryDark', '#280b0f');
  //r.style.setProperty('--secondary', '#E2D6B5');
  r.style.setProperty('--secondaryLight', '#c6ae6c');
  r.style.setProperty('--secondaryDark', '#937b39');
}

function Devils() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  //r.style.setProperty('--secondary', '#CE1126');
  r.style.setProperty('--secondaryLight', '#f04257');
  r.style.setProperty('--secondaryDark', '#bd0f24');
}

function Ducks() {
  r.style.setProperty('--primaryLight', '#612505');
  r.style.setProperty('--primary', '#491c04');
  r.style.setProperty('--primaryDark', '#301303');
  //r.style.setProperty('--secondary', '#B9975B');
  r.style.setProperty('--secondaryLight', '#c2a470');
  r.style.setProperty('--secondaryDark', '#8f713d');
}

function Flames() {
  r.style.setProperty('--primaryLight', '#66000e');
  r.style.setProperty('--primary', '#4d000a');
  r.style.setProperty('--primaryDark', '#330007');
  //r.style.setProperty('--secondary', '#FFB81C');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Flyers() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  //r.style.setProperty('--secondary', '#F74902');
  r.style.setProperty('--secondaryLight', '#fd6e35');
  r.style.setProperty('--secondaryDark', '#ca3b02');
}

function GoldenKnights() {
  r.style.setProperty('--primaryLight', '#2c373a');
  r.style.setProperty('--primary', '#21292b');
  r.style.setProperty('--primaryDark', '#161b1d');
  //r.style.setProperty('--secondary', '#B4975A');
  r.style.setProperty('--secondaryLight', '#c0a772');
  r.style.setProperty('--secondaryDark', '#8d743f');
}

function Hurricanes() {
  r.style.setProperty('--primaryLight', '#5e0812');
  r.style.setProperty('--primary', '#47060d');
  r.style.setProperty('--primaryDark', '#2f0409');
  //r.style.setProperty('--secondary', '#A4A9AD');
  r.style.setProperty('--secondaryLight', '#949a9e');
  r.style.setProperty('--secondaryDark', '#61676b');
}

function Islanders() {
  r.style.setProperty('--primaryLight', '#003666');
  r.style.setProperty('--primary', '#00294d');
  r.style.setProperty('--primaryDark', '#001b33');
  //r.style.setProperty('--secondary', '#F47D30');
  r.style.setProperty('--secondaryLight', '#f5873d');
  r.style.setProperty('--secondaryDark', '#c2540a');
}

function Jets() {
  r.style.setProperty('--primaryLight', '#062b60');
  r.style.setProperty('--primary', '#042148');
  r.style.setProperty('--primaryDark', '#031630');
  //r.style.setProperty('--secondary', '#7B303E');
  r.style.setProperty('--secondaryLight', '#c66c7d');
  r.style.setProperty('--secondaryDark', '#93394a');
}

function Kings() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  //r.style.setProperty('--secondary', '#A2AAAD');
  r.style.setProperty('--secondaryLight', '#939c9f');
  r.style.setProperty('--secondaryDark', '#60696c');
}

function Kraken() {
  r.style.setProperty('--primaryLight', '#003866');
  r.style.setProperty('--primary', '#002a4d');
  r.style.setProperty('--primaryDark', '#001c33');
  //r.style.setProperty('--secondary', '#99D9D9');
  r.style.setProperty('--secondaryLight', '#6ac8c8');
  r.style.setProperty('--secondaryDark', '#379595');
}

function Lightning() {
  r.style.setProperty('--primaryLight', '#002868');
  r.style.setProperty('--primary', '#001d4d');
  r.style.setProperty('--primaryDark', '#001433');
  //r.style.setProperty('--secondary', '#FFFFFF');
  r.style.setProperty('--secondaryLight', '#cccccc');
  r.style.setProperty('--secondaryDark', '#999999');
}

function MapleLeafs() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  //r.style.setProperty('--secondary', '#FFFFFF');
  r.style.setProperty('--secondaryLight', '#cccccc');
  r.style.setProperty('--secondaryDark', '#999999');
}

function Oilers() {
  r.style.setProperty('--primaryLight', '#062b60');
  r.style.setProperty('--primary', '#042148');
  r.style.setProperty('--primaryDark', '#031630');
  //r.style.setProperty('--secondary', '#FF4C00');
  r.style.setProperty('--secondaryLight', '#ff7033');
  r.style.setProperty('--secondaryDark', '#cc3d00');
}

function Panthers() {
  r.style.setProperty('--primaryLight', '#5e0816');
  r.style.setProperty('--primary', '#470611');
  r.style.setProperty('--primaryDark', '#2f040b');
  //r.style.setProperty('--secondary', '#B9975B');
  r.style.setProperty('--secondaryLight', '#c2a470');
  r.style.setProperty('--secondaryDark', '#8f713d');
}

function Penguins() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  //r.style.setProperty('--secondary', '#FCB514');
  r.style.setProperty('--secondaryLight', '#fcc136');
  r.style.setProperty('--secondaryDark', '#c98e03');
}

function Predators() {
  r.style.setProperty('--primaryLight', '#062b60');
  r.style.setProperty('--primary', '#042148');
  r.style.setProperty('--primaryDark', '#031630');
  //r.style.setProperty('--secondary', '#FFB81C');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Rangers() {
  r.style.setProperty('--primaryLight', '#002266');
  r.style.setProperty('--primary', '#001a4d');
  r.style.setProperty('--primaryDark', '#001133');
  //r.style.setProperty('--secondary', '#CE1126');
  r.style.setProperty('--secondaryLight', '#f04257');
  r.style.setProperty('--secondaryDark', '#bd0f24');
}

function RedWings() {
  r.style.setProperty('--primaryLight', '#5e0812');
  r.style.setProperty('--primary', '#47060d');
  r.style.setProperty('--primaryDark', '#2f0409');
  //r.style.setProperty('--secondary', '#FFFFFF');
  r.style.setProperty('--secondaryLight', '#cccccc');
  r.style.setProperty('--secondaryDark', '#999999');
}

function Sabres() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  //r.style.setProperty('--secondary', '#FFB81C');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Senators() {
  r.style.setProperty('--primaryLight', '#5b0b14');
  r.style.setProperty('--primary', '#44080f');
  r.style.setProperty('--primaryDark', '#2e050a');
  //r.style.setProperty('--secondary', '#B79257');
  r.style.setProperty('--secondaryLight', '#c2a370');
  r.style.setProperty('--secondaryDark', '#8f703d');
}

function Sharks() {
  r.style.setProperty('--primaryLight', '#005f66');
  r.style.setProperty('--primary', '#00474d');
  r.style.setProperty('--primaryDark', '#003033');
  //r.style.setProperty('--secondary', '#EA7200');
  r.style.setProperty('--secondaryLight', '#ff9633');
  r.style.setProperty('--secondaryDark', '#cc6300');
}

function Stars() {
  r.style.setProperty('--primaryLight', '#006847');
  r.style.setProperty('--primary', '#004d34');
  r.style.setProperty('--primaryDark', '#003323');
  //r.style.setProperty('--secondary', '#8F8F8C');
  r.style.setProperty('--secondaryLight', '#9a9a98');
  r.style.setProperty('--secondaryDark', '#676765');
}

function Wild() {
  r.style.setProperty('--primaryLight', '#174f39');
  r.style.setProperty('--primary', '#123b2b');
  r.style.setProperty('--primaryDark', '#0c271d');
  r.style.setProperty('--secondaryLight', '#e44e64');
  r.style.setProperty('--secondaryDark', '#b11b31');
}
