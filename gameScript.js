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
        this.id = infoArr[0];
        this.positionCode = infoArr[1];
        this.jerseyNumber = infoArr[2];
        this.fullName = infoArr[3];
        this.salary = infoArr[4];
        this.role = infoArr[5];
    }
}

var roster = null;
var selectedPlayer = null;

var selectedTeamId = "Select";
var captainIsSelected = false;
var scorerIsSelected = false;
var playmakerIsSelected = false;
var shooterIsSelected = false;
var blockerIsSelected = false;
var enforcerIsSelected = false;
var centerIsSelected = false;



var playerButtonsHTML = '<button type="button" class="roleButton" id="captainButton">Captain<div class="subButton">Goals x2 & Assists x2</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="scorerButton">Scorer<div class="subButton">Goals x2</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="playmakerButton">Playmaker<div class="subButton">Assists x2</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="shooterButton">Shooter<div class="subButton">Shots x3</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="blockerButton">Blocker<div class="subButton">Blocked Shots x4</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="enforcerButton">Enforcer<div class="subButton">Hits x3</div></button>';
playerButtonsHTML += '<button type="button" class="roleButton" id="centerButton">Center<div class="subButton">Face Off Wins x2</div></button>';

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
        if (i % 2 == 0) {
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr id="p'+i+'" class="player-row even-row">' + getHTMLForPlayer(playerArr[i]) + '</tr>';
            } else {
                tableStr += '<tr id="p'+i+'" class="player-row even-row non-starter">' + getHTMLForPlayer(playerArr[i]) + '</tr>';
            }
            
        } else {
            
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr id="p'+i+'" class="player-row">' + getHTMLForPlayer(playerArr[i]) + '</tr>';
            } else {
                tableStr += '<tr id="p'+i+'" class="player-row non-starter">' + getHTMLForPlayer(playerArr[i]) + '</tr>';
            }
        }
    }
    tableStr += '<tr class="tableEnd"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
    document.getElementById('playerTableBody').innerHTML = tableStr;
}

function getHTMLForPlayer(player) {
    var htmlStr = '<td><div hidden>'+player.id+'</div>' + player.positionCode + '</td>';
    htmlStr += '<td>' + player.jerseyNumber + '</td>';
    htmlStr += '<td class="name-td">' + player.fullName + '</td>';
    htmlStr += '<td class="salary-td">' + player.salary + '</td>';
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
  }, 250);
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

function getSelectedRole() {
  if (captainIsSelected)
    return 1;
  if (scorerIsSelected)
    return 2;
  if (playmakerIsSelected)
    return 3;
  if (shooterIsSelected)
    return 4;
  if (blockerIsSelected)
    return 5;
  if (enforcerIsSelected)
    return 6;
  if (centerIsSelected)
    return 7;
  return 0;
}

function tryInsertPlayer() {
  const selectedRole = getSelectedRole();
  if (selectedPlayer != null && selectedRole > 0) {
    const curLineup = getCurLineup();
    console.log("selected stuff: " + selectedRole + ", " + selectedPlayer.fullName);
  }
}

function getCurLineup() {
  var lineupList = [];
  for (var i = 0; i < 5; i++) {
    const player = parsePlayerFromLineup('pl' + i);
    if (player != null) {
      lineupList.push(player);
    }
  }
  return lineupList;
}

function playerIsAlreadyInLineup(playerId) {
  for (const player of roster) {
    if (player.id == playerId) {
        return true;
    }
  }
  return false;
}

function parsePlayerFromLineup(id) {
  const playerId = document.getElementById(id).innerHTML.split('<div hidden="">')[1].split('</div>')[0];
  for (const player of roster) {
      if (player.id == playerId) {
          return player;
      }
  }
  return null;
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

    $(function() {$('#p0').hover(function() {if (!p0Selected) {$("#p0").addClass("goldShadow");}}, function() {if (!p0Selected) {$("#p0").removeClass("goldShadow");}});});
    $(function() {$('#p1').hover(function() {if (!p1Selected) {$("#p1").addClass("goldShadow");}}, function() {if (!p1Selected) {$("#p1").removeClass("goldShadow");}});});
    $(function() {$('#p2').hover(function() {if (!p2Selected) {$("#p2").addClass("goldShadow");}}, function() {if (!p2Selected) {$("#p2").removeClass("goldShadow");}});});
    $(function() {$('#p3').hover(function() {if (!p3Selected) {$("#p3").addClass("goldShadow");}}, function() {if (!p3Selected) {$("#p3").removeClass("goldShadow");}});});
    $(function() {$('#p4').hover(function() {if (!p4Selected) {$("#p4").addClass("goldShadow");}}, function() {if (!p4Selected) {$("#p4").removeClass("goldShadow");}});});
    $(function() {$('#p5').hover(function() {if (!p5Selected) {$("#p5").addClass("goldShadow");}}, function() {if (!p5Selected) {$("#p5").removeClass("goldShadow");}});});
    $(function() {$('#p6').hover(function() {if (!p6Selected) {$("#p6").addClass("goldShadow");}}, function() {if (!p6Selected) {$("#p6").removeClass("goldShadow");}});});
    $(function() {$('#p7').hover(function() {if (!p7Selected) {$("#p7").addClass("goldShadow");}}, function() {if (!p7Selected) {$("#p7").removeClass("goldShadow");}});});
    $(function() {$('#p8').hover(function() {if (!p8Selected) {$("#p8").addClass("goldShadow");}}, function() {if (!p8Selected) {$("#p8").removeClass("goldShadow");}});});
    $(function() {$('#p9').hover(function() {if (!p9Selected) {$("#p9").addClass("goldShadow");}}, function() {if (!p9Selected) {$("#p9").removeClass("goldShadow");}});});
    $(function() {$('#p10').hover(function() {if (!p10Selected) {$("#p10").addClass("goldShadow");}}, function() {if (!p10Selected) {$("#p10").removeClass("goldShadow");}});});
    $(function() {$('#p11').hover(function() {if (!p11Selected) {$("#p11").addClass("goldShadow");}}, function() {if (!p11Selected) {$("#p11").removeClass("goldShadow");}});});
    $(function() {$('#p12').hover(function() {if (!p12Selected) {$("#p12").addClass("goldShadow");}}, function() {if (!p12Selected) {$("#p12").removeClass("goldShadow");}});});
    $(function() {$('#p13').hover(function() {if (!p13Selected) {$("#p13").addClass("goldShadow");}}, function() {if (!p13Selected) {$("#p13").removeClass("goldShadow");}});});
    $(function() {$('#p14').hover(function() {if (!p14Selected) {$("#p14").addClass("goldShadow");}}, function() {if (!p14Selected) {$("#p14").removeClass("goldShadow");}});});
    $(function() {$('#p15').hover(function() {if (!p15Selected) {$("#p15").addClass("goldShadow");}}, function() {if (!p15Selected) {$("#p15").removeClass("goldShadow");}});});
    $(function() {$('#p16').hover(function() {if (!p16Selected) {$("#p16").addClass("goldShadow");}}, function() {if (!p16Selected) {$("#p16").removeClass("goldShadow");}});});
    $(function() {$('#p17').hover(function() {if (!p17Selected) {$("#p17").addClass("goldShadow");}}, function() {if (!p17Selected) {$("#p17").removeClass("goldShadow");}});});
    $(function() {$('#p18').hover(function() {if (!p18Selected) {$("#p18").addClass("goldShadow");}}, function() {if (!p18Selected) {$("#p18").removeClass("goldShadow");}});});
    $(function() {$('#p19').hover(function() {if (!p19Selected) {$("#p19").addClass("goldShadow");}}, function() {if (!p19Selected) {$("#p19").removeClass("goldShadow");}});});
    $(function() {$('#p20').hover(function() {if (!p20Selected) {$("#p20").addClass("goldShadow");}}, function() {if (!p20Selected) {$("#p20").removeClass("goldShadow");}});});
    $(function() {$('#p21').hover(function() {if (!p21Selected) {$("#p21").addClass("goldShadow");}}, function() {if (!p21Selected) {$("#p21").removeClass("goldShadow");}});});
    $(function() {$('#p22').hover(function() {if (!p22Selected) {$("#p22").addClass("goldShadow");}}, function() {if (!p22Selected) {$("#p22").removeClass("goldShadow");}});});
    $(function() {$('#p23').hover(function() {if (!p23Selected) {$("#p23").addClass("goldShadow");}}, function() {if (!p23Selected) {$("#p23").removeClass("goldShadow");}});});
    $(function() {$('#p24').hover(function() {if (!p24Selected) {$("#p24").addClass("goldShadow");}}, function() {if (!p24Selected) {$("#p24").removeClass("goldShadow");}});});
    $(function() {$('#p25').hover(function() {if (!p25Selected) {$("#p25").addClass("goldShadow");}}, function() {if (!p25Selected) {$("#p25").removeClass("goldShadow");}});});
    $(function() {$('#p26').hover(function() {if (!p26Selected) {$("#p26").addClass("goldShadow");}}, function() {if (!p26Selected) {$("#p26").removeClass("goldShadow");}});});
    $(function() {$('#p27').hover(function() {if (!p27Selected) {$("#p27").addClass("goldShadow");}}, function() {if (!p27Selected) {$("#p27").removeClass("goldShadow");}});});
    $(function() {$('#p28').hover(function() {if (!p28Selected) {$("#p28").addClass("goldShadow");}}, function() {if (!p28Selected) {$("#p28").removeClass("goldShadow");}});});
    $(function() {$('#p29').hover(function() {if (!p29Selected) {$("#p29").addClass("goldShadow");}}, function() {if (!p29Selected) {$("#p29").removeClass("goldShadow");}});});
    $(function() {$('#p30').hover(function() {if (!p30Selected) {$("#p30").addClass("goldShadow");}}, function() {if (!p30Selected) {$("#p30").removeClass("goldShadow");}});});
    $(function() {$('#p31').hover(function() {if (!p31Selected) {$("#p31").addClass("goldShadow");}}, function() {if (!p31Selected) {$("#p31").removeClass("goldShadow");}});});
    $(function() {$('#p32').hover(function() {if (!p32Selected) {$("#p32").addClass("goldShadow");}}, function() {if (!p32Selected) {$("#p32").removeClass("goldShadow");}});});
    $(function() {$('#p33').hover(function() {if (!p33Selected) {$("#p33").addClass("goldShadow");}}, function() {if (!p33Selected) {$("#p33").removeClass("goldShadow");}});});
    $(function() {$('#p34').hover(function() {if (!p34Selected) {$("#p34").addClass("goldShadow");}}, function() {if (!p34Selected) {$("#p34").removeClass("goldShadow");}});});
    $(function() {$('#p35').hover(function() {if (!p35Selected) {$("#p35").addClass("goldShadow");}}, function() {if (!p35Selected) {$("#p35").removeClass("goldShadow");}});});
    $(function() {$('#p36').hover(function() {if (!p36Selected) {$("#p36").addClass("goldShadow");}}, function() {if (!p36Selected) {$("#p36").removeClass("goldShadow");}});});
    $(function() {$('#p37').hover(function() {if (!p37Selected) {$("#p37").addClass("goldShadow");}}, function() {if (!p37Selected) {$("#p37").removeClass("goldShadow");}});});
    $(function() {$('#p38').hover(function() {if (!p38Selected) {$("#p38").addClass("goldShadow");}}, function() {if (!p38Selected) {$("#p38").removeClass("goldShadow");}});});
    $(function() {$('#p39').hover(function() {if (!p39Selected) {$("#p39").addClass("goldShadow");}}, function() {if (!p39Selected) {$("#p39").removeClass("goldShadow");}});});
    $(function() {$('#p40').hover(function() {if (!p40Selected) {$("#p40").addClass("goldShadow");}}, function() {if (!p40Selected) {$("#p40").removeClass("goldShadow");}});});
    $(function() {$('#p41').hover(function() {if (!p41Selected) {$("#p41").addClass("goldShadow");}}, function() {if (!p41Selected) {$("#p41").removeClass("goldShadow");}});});
    $(function() {$('#p42').hover(function() {if (!p42Selected) {$("#p42").addClass("goldShadow");}}, function() {if (!p42Selected) {$("#p42").removeClass("goldShadow");}});});
    $(function() {$('#p43').hover(function() {if (!p43Selected) {$("#p43").addClass("goldShadow");}}, function() {if (!p43Selected) {$("#p43").removeClass("goldShadow");}});});
    $(function() {$('#p44').hover(function() {if (!p44Selected) {$("#p44").addClass("goldShadow");}}, function() {if (!p44Selected) {$("#p44").removeClass("goldShadow");}});});
    $(function() {$('#p45').hover(function() {if (!p45Selected) {$("#p45").addClass("goldShadow");}}, function() {if (!p45Selected) {$("#p45").removeClass("goldShadow");}});});
    $(function() {$('#p46').hover(function() {if (!p46Selected) {$("#p46").addClass("goldShadow");}}, function() {if (!p46Selected) {$("#p46").removeClass("goldShadow");}});});
    $(function() {$('#p47').hover(function() {if (!p47Selected) {$("#p47").addClass("goldShadow");}}, function() {if (!p47Selected) {$("#p47").removeClass("goldShadow");}});});
    $(function() {$('#p48').hover(function() {if (!p48Selected) {$("#p48").addClass("goldShadow");}}, function() {if (!p48Selected) {$("#p48").removeClass("goldShadow");}});});
    $(function() {$('#p49').hover(function() {if (!p49Selected) {$("#p49").addClass("goldShadow");}}, function() {if (!p49Selected) {$("#p49").removeClass("goldShadow");}});});

    $(function() {$('#p0').click(function() {resetAllSelectedPlayers();if (p0Selected) {p0Selected = false;selectedPlayer = null;$("#p0").addClass("goldShadow");} else {resetAllSelectedStatus();p0Selected = true;parsePlayerFromRow('p0');$("#p0").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p1').click(function() {resetAllSelectedPlayers();if (p1Selected) {p1Selected = false;selectedPlayer = null;$("#p1").addClass("goldShadow");} else {resetAllSelectedStatus();p1Selected = true;parsePlayerFromRow('p1');$("#p1").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p2').click(function() {resetAllSelectedPlayers();if (p2Selected) {p2Selected = false;selectedPlayer = null;$("#p2").addClass("goldShadow");} else {resetAllSelectedStatus();p2Selected = true;parsePlayerFromRow('p2');$("#p2").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p3').click(function() {resetAllSelectedPlayers();if (p3Selected) {p3Selected = false;selectedPlayer = null;$("#p3").addClass("goldShadow");} else {resetAllSelectedStatus();p3Selected = true;parsePlayerFromRow('p3');$("#p3").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p4').click(function() {resetAllSelectedPlayers();if (p4Selected) {p4Selected = false;selectedPlayer = null;$("#p4").addClass("goldShadow");} else {resetAllSelectedStatus();p4Selected = true;parsePlayerFromRow('p4');$("#p4").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p5').click(function() {resetAllSelectedPlayers();if (p5Selected) {p5Selected = false;selectedPlayer = null;$("#p5").addClass("goldShadow");} else {resetAllSelectedStatus();p5Selected = true;parsePlayerFromRow('p5');$("#p5").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p6').click(function() {resetAllSelectedPlayers();if (p6Selected) {p6Selected = false;selectedPlayer = null;$("#p6").addClass("goldShadow");} else {resetAllSelectedStatus();p6Selected = true;parsePlayerFromRow('p6');$("#p6").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p7').click(function() {resetAllSelectedPlayers();if (p7Selected) {p7Selected = false;selectedPlayer = null;$("#p7").addClass("goldShadow");} else {resetAllSelectedStatus();p7Selected = true;parsePlayerFromRow('p7');$("#p7").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p8').click(function() {resetAllSelectedPlayers();if (p8Selected) {p8Selected = false;selectedPlayer = null;$("#p8").addClass("goldShadow");} else {resetAllSelectedStatus();p8Selected = true;parsePlayerFromRow('p8');$("#p8").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p9').click(function() {resetAllSelectedPlayers();if (p9Selected) {p9Selected = false;selectedPlayer = null;$("#p9").addClass("goldShadow");} else {resetAllSelectedStatus();p9Selected = true;parsePlayerFromRow('p9');$("#p9").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p10').click(function() {resetAllSelectedPlayers();if (p10Selected) {p10Selected = false;selectedPlayer = null;$("#p10").addClass("goldShadow");} else {resetAllSelectedStatus();p10Selected = true;parsePlayerFromRow('p10');$("#p10").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p11').click(function() {resetAllSelectedPlayers();if (p11Selected) {p11Selected = false;selectedPlayer = null;$("#p11").addClass("goldShadow");} else {resetAllSelectedStatus();p11Selected = true;parsePlayerFromRow('p11');$("#p11").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p12').click(function() {resetAllSelectedPlayers();if (p12Selected) {p12Selected = false;selectedPlayer = null;$("#p12").addClass("goldShadow");} else {resetAllSelectedStatus();p12Selected = true;parsePlayerFromRow('p12');$("#p12").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p13').click(function() {resetAllSelectedPlayers();if (p13Selected) {p13Selected = false;selectedPlayer = null;$("#p13").addClass("goldShadow");} else {resetAllSelectedStatus();p13Selected = true;parsePlayerFromRow('p13');$("#p13").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p14').click(function() {resetAllSelectedPlayers();if (p14Selected) {p14Selected = false;selectedPlayer = null;$("#p14").addClass("goldShadow");} else {resetAllSelectedStatus();p14Selected = true;parsePlayerFromRow('p14');$("#p14").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p15').click(function() {resetAllSelectedPlayers();if (p15Selected) {p15Selected = false;selectedPlayer = null;$("#p15").addClass("goldShadow");} else {resetAllSelectedStatus();p15Selected = true;parsePlayerFromRow('p15');$("#p15").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p16').click(function() {resetAllSelectedPlayers();if (p16Selected) {p16Selected = false;selectedPlayer = null;$("#p16").addClass("goldShadow");} else {resetAllSelectedStatus();p16Selected = true;parsePlayerFromRow('p16');$("#p16").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p17').click(function() {resetAllSelectedPlayers();if (p17Selected) {p17Selected = false;selectedPlayer = null;$("#p17").addClass("goldShadow");} else {resetAllSelectedStatus();p17Selected = true;parsePlayerFromRow('p17');$("#p17").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p18').click(function() {resetAllSelectedPlayers();if (p18Selected) {p18Selected = false;selectedPlayer = null;$("#p18").addClass("goldShadow");} else {resetAllSelectedStatus();p18Selected = true;parsePlayerFromRow('p18');$("#p18").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p19').click(function() {resetAllSelectedPlayers();if (p19Selected) {p19Selected = false;selectedPlayer = null;$("#p19").addClass("goldShadow");} else {resetAllSelectedStatus();p19Selected = true;parsePlayerFromRow('p19');$("#p19").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p20').click(function() {resetAllSelectedPlayers();if (p20Selected) {p20Selected = false;selectedPlayer = null;$("#p20").addClass("goldShadow");} else {resetAllSelectedStatus();p20Selected = true;parsePlayerFromRow('p20');$("#p20").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p21').click(function() {resetAllSelectedPlayers();if (p21Selected) {p21Selected = false;selectedPlayer = null;$("#p21").addClass("goldShadow");} else {resetAllSelectedStatus();p21Selected = true;parsePlayerFromRow('p21');$("#p21").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p22').click(function() {resetAllSelectedPlayers();if (p22Selected) {p22Selected = false;selectedPlayer = null;$("#p22").addClass("goldShadow");} else {resetAllSelectedStatus();p22Selected = true;parsePlayerFromRow('p22');$("#p22").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p23').click(function() {resetAllSelectedPlayers();if (p23Selected) {p23Selected = false;selectedPlayer = null;$("#p23").addClass("goldShadow");} else {resetAllSelectedStatus();p23Selected = true;parsePlayerFromRow('p23');$("#p23").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p24').click(function() {resetAllSelectedPlayers();if (p24Selected) {p24Selected = false;selectedPlayer = null;$("#p24").addClass("goldShadow");} else {resetAllSelectedStatus();p24Selected = true;parsePlayerFromRow('p24');$("#p24").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p25').click(function() {resetAllSelectedPlayers();if (p25Selected) {p25Selected = false;selectedPlayer = null;$("#p25").addClass("goldShadow");} else {resetAllSelectedStatus();p25Selected = true;parsePlayerFromRow('p25');$("#p25").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p26').click(function() {resetAllSelectedPlayers();if (p26Selected) {p26Selected = false;selectedPlayer = null;$("#p26").addClass("goldShadow");} else {resetAllSelectedStatus();p26Selected = true;parsePlayerFromRow('p26');$("#p26").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p27').click(function() {resetAllSelectedPlayers();if (p27Selected) {p27Selected = false;selectedPlayer = null;$("#p27").addClass("goldShadow");} else {resetAllSelectedStatus();p27Selected = true;parsePlayerFromRow('p27');$("#p27").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p28').click(function() {resetAllSelectedPlayers();if (p28Selected) {p28Selected = false;selectedPlayer = null;$("#p28").addClass("goldShadow");} else {resetAllSelectedStatus();p28Selected = true;parsePlayerFromRow('p28');$("#p28").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p29').click(function() {resetAllSelectedPlayers();if (p29Selected) {p29Selected = false;selectedPlayer = null;$("#p29").addClass("goldShadow");} else {resetAllSelectedStatus();p29Selected = true;parsePlayerFromRow('p29');$("#p29").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p30').click(function() {resetAllSelectedPlayers();if (p30Selected) {p30Selected = false;selectedPlayer = null;$("#p30").addClass("goldShadow");} else {resetAllSelectedStatus();p30Selected = true;parsePlayerFromRow('p30');$("#p30").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p31').click(function() {resetAllSelectedPlayers();if (p31Selected) {p31Selected = false;selectedPlayer = null;$("#p31").addClass("goldShadow");} else {resetAllSelectedStatus();p31Selected = true;parsePlayerFromRow('p31');$("#p31").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p32').click(function() {resetAllSelectedPlayers();if (p32Selected) {p32Selected = false;selectedPlayer = null;$("#p32").addClass("goldShadow");} else {resetAllSelectedStatus();p32Selected = true;parsePlayerFromRow('p32');$("#p32").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p33').click(function() {resetAllSelectedPlayers();if (p33Selected) {p33Selected = false;selectedPlayer = null;$("#p33").addClass("goldShadow");} else {resetAllSelectedStatus();p33Selected = true;parsePlayerFromRow('p33');$("#p33").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p34').click(function() {resetAllSelectedPlayers();if (p34Selected) {p34Selected = false;selectedPlayer = null;$("#p34").addClass("goldShadow");} else {resetAllSelectedStatus();p34Selected = true;parsePlayerFromRow('p34');$("#p34").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p35').click(function() {resetAllSelectedPlayers();if (p35Selected) {p35Selected = false;selectedPlayer = null;$("#p35").addClass("goldShadow");} else {resetAllSelectedStatus();p35Selected = true;parsePlayerFromRow('p35');$("#p35").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p36').click(function() {resetAllSelectedPlayers();if (p36Selected) {p36Selected = false;selectedPlayer = null;$("#p36").addClass("goldShadow");} else {resetAllSelectedStatus();p36Selected = true;parsePlayerFromRow('p36');$("#p36").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p37').click(function() {resetAllSelectedPlayers();if (p37Selected) {p37Selected = false;selectedPlayer = null;$("#p37").addClass("goldShadow");} else {resetAllSelectedStatus();p37Selected = true;parsePlayerFromRow('p37');$("#p37").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p38').click(function() {resetAllSelectedPlayers();if (p38Selected) {p38Selected = false;selectedPlayer = null;$("#p38").addClass("goldShadow");} else {resetAllSelectedStatus();p38Selected = true;parsePlayerFromRow('p38');$("#p38").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p39').click(function() {resetAllSelectedPlayers();if (p39Selected) {p39Selected = false;selectedPlayer = null;$("#p39").addClass("goldShadow");} else {resetAllSelectedStatus();p39Selected = true;parsePlayerFromRow('p39');$("#p39").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p40').click(function() {resetAllSelectedPlayers();if (p40Selected) {p40Selected = false;selectedPlayer = null;$("#p40").addClass("goldShadow");} else {resetAllSelectedStatus();p40Selected = true;parsePlayerFromRow('p40');$("#p40").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p41').click(function() {resetAllSelectedPlayers();if (p41Selected) {p41Selected = false;selectedPlayer = null;$("#p41").addClass("goldShadow");} else {resetAllSelectedStatus();p41Selected = true;parsePlayerFromRow('p41');$("#p41").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p42').click(function() {resetAllSelectedPlayers();if (p42Selected) {p42Selected = false;selectedPlayer = null;$("#p42").addClass("goldShadow");} else {resetAllSelectedStatus();p42Selected = true;parsePlayerFromRow('p42');$("#p42").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p43').click(function() {resetAllSelectedPlayers();if (p43Selected) {p43Selected = false;selectedPlayer = null;$("#p43").addClass("goldShadow");} else {resetAllSelectedStatus();p43Selected = true;parsePlayerFromRow('p43');$("#p43").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p44').click(function() {resetAllSelectedPlayers();if (p44Selected) {p44Selected = false;selectedPlayer = null;$("#p44").addClass("goldShadow");} else {resetAllSelectedStatus();p44Selected = true;parsePlayerFromRow('p44');$("#p44").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p45').click(function() {resetAllSelectedPlayers();if (p45Selected) {p45Selected = false;selectedPlayer = null;$("#p45").addClass("goldShadow");} else {resetAllSelectedStatus();p45Selected = true;parsePlayerFromRow('p45');$("#p45").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p46').click(function() {resetAllSelectedPlayers();if (p46Selected) {p46Selected = false;selectedPlayer = null;$("#p46").addClass("goldShadow");} else {resetAllSelectedStatus();p46Selected = true;parsePlayerFromRow('p46');$("#p46").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p47').click(function() {resetAllSelectedPlayers();if (p47Selected) {p47Selected = false;selectedPlayer = null;$("#p47").addClass("goldShadow");} else {resetAllSelectedStatus();p47Selected = true;parsePlayerFromRow('p47');$("#p47").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p48').click(function() {resetAllSelectedPlayers();if (p48Selected) {p48Selected = false;selectedPlayer = null;$("#p48").addClass("goldShadow");} else {resetAllSelectedStatus();p48Selected = true;parsePlayerFromRow('p48');$("#p48").addClass("selectedGoldShadow");tryInsertPlayer();}});});
    $(function() {$('#p49').click(function() {resetAllSelectedPlayers();if (p49Selected) {p49Selected = false;selectedPlayer = null;$("#p49").addClass("goldShadow");} else {resetAllSelectedStatus();p49Selected = true;parsePlayerFromRow('p49');$("#p49").addClass("selectedGoldShadow");tryInsertPlayer();}});});

    $(function() {
      $('#captainButton').hover(function() {
        if (!captainIsSelected) {
          if (!scorerIsSelected) {
            $('#captainButton').addClass("selectedFire");
            $('.goals-td').addClass("selectedFire");
            $('#headGoals').addClass("selectedFire");
            $('#statGoals').addClass("selectedFire");
            $('#statGoals').html('+30 per');
          }
          if (!playmakerIsSelected) {
            $('#captainButton').addClass("selectedFire");
            $('.assists-td').addClass("selectedFire");
            $('#headAssists').addClass("selectedFire");
            $('#statAssists').addClass("selectedFire");
            $('#statAssists').html('+20 per');
          }
        }
      }, function() {
        if (!captainIsSelected) {
          if (!scorerIsSelected) {
            $('#captainButton').removeClass("selectedFire");
            $('.goals-td').removeClass("selectedFire");
            $('#headGoals').removeClass("selectedFire");
            $('#statGoals').removeClass("selectedFire");
            $('#statGoals').html('+15 per');
          }
          if (!playmakerIsSelected) {
            $('#captainButton').removeClass("selectedFire");
            $('.assists-td').removeClass("selectedFire");
            $('#headAssists').removeClass("selectedFire");
            $('#statAssists').removeClass("selectedFire");
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
          $('#captainButton').addClass("selectedFire");
          $('.goals-td').addClass("selectedFire");
          $('#headGoals').addClass("selectedFire");
          $('#statGoals').addClass("selectedFire");
          $('#statGoals').html('+30 per');
          $('.assists-td').removeClass("fire");
          $('#headAssists').removeClass("fire");
          $('#statAssists').removeClass("fire");
          $('.assists-td').addClass("selectedFire");
          $('#headAssists').addClass("selectedFire");
          $('#statAssists').addClass("selectedFire");
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
          tryInsertPlayer();
        }
      });
    });
    
    
    
    
    $(function() {
      $('#scorerButton').hover(function() {
        if (!scorerIsSelected) {
          $('#scorerButton').addClass("selectedFire");
          if (!captainIsSelected) {
            $('.goals-td').addClass("selectedFire");
            $('#headGoals').addClass("selectedFire");
            $('#statGoals').addClass("selectedFire");
            $('#statGoals').html('+30 per');
          }
        }
      }, function() {
        if (!scorerIsSelected) {
          $('#scorerButton').removeClass("selectedFire");
          if (!captainIsSelected) {
            $('.goals-td').removeClass("selectedFire");
            $('#headGoals').removeClass("selectedFire");
            $('#statGoals').removeClass("selectedFire");
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
          $('#scorerButton').addClass("selectedFire");
          $('.goals-td').addClass("selectedFire");
          $('#headGoals').addClass("selectedFire");
          $('#statGoals').addClass("selectedFire");
          $('#statGoals').html('+30 per');
        } else {
          resetAllSelectedRoles();
          scorerIsSelected = true;
          $('#scorerButton').addClass("fire");
          $('.goals-td').addClass("fire");
          $('#headGoals').addClass("fire");
          $('#statGoals').addClass("fire");
          $('#statGoals').html('+30 per');
          tryInsertPlayer();
        }
      });
    });
    
    
    
    $(function() {
      $('#playmakerButton').hover(function() {
        if (!playmakerIsSelected) {
          $('#playmakerButton').addClass("selectedFire");
          if (!captainIsSelected) {
            $('.assists-td').addClass("selectedFire");
            $('#headAssists').addClass("selectedFire");
            $('#statAssists').addClass("selectedFire");
            $('#statAssists').html('+20 per');
          }
        }
      }, function() {
        if (!playmakerIsSelected) {
          $('#playmakerButton').removeClass("selectedFire");
          if (!captainIsSelected) {
            $('.assists-td').removeClass("selectedFire");
            $('#headAssists').removeClass("selectedFire");
            $('#statAssists').removeClass("selectedFire");
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
          $('#playmakerButton').addClass("selectedFire");
          $('.assists-td').addClass("selectedFire");
          $('#headAssists').addClass("selectedFire");
          $('#statAssists').addClass("selectedFire");
          $('#statAssists').html('+20 per');
        } else {
          resetAllSelectedRoles();
          playmakerIsSelected = true;
          $('#playmakerButton').addClass("fire");
          $('.assists-td').addClass("fire");
          $('#headAssists').addClass("fire");
          $('#statAssists').addClass("fire");
          $('#statAssists').html('+20 per');
          tryInsertPlayer();
        }
      });
    });
    
    
    
    
    $(function() {
      $('#shooterButton').hover(function() {
        if (!shooterIsSelected) {
          $('#shooterButton').addClass("selectedFire");
          $('.shots-td').addClass("selectedFire");
          $('#headShots').addClass("selectedFire");
          $('#statShots').addClass("selectedFire");
          $('#statShots').html('+3 per');
        }
      }, function() {
        if (!shooterIsSelected) {
          $('#shooterButton').removeClass("selectedFire");
          $('.shots-td').removeClass("selectedFire");
          $('#headShots').removeClass("selectedFire");
          $('#statShots').removeClass("selectedFire");
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
          $('#statShots').removeClass("fire");
          $('#shooterButton').addClass("selectedFire");
          $('.shots-td').addClass("selectedFire");
          $('#headShots').addClass("selectedFire");
          $('#statShots').addClass("selectedFire");
          $('#statShots').html('+3 per');
        } else {
          resetAllSelectedRoles();
          shooterIsSelected = true;
          $('#shooterButton').addClass("fire");
          $('.shots-td').addClass("fire");
          $('#headShots').addClass("fire");
          $('#statShots').addClass("fire");
          $('#statShots').html('+3 per');
          tryInsertPlayer();
        }
      });
    });
    
    
    
    
    $(function() {
      $('#blockerButton').hover(function() {
        if (!blockerIsSelected) {
          $('#blockerButton').addClass("selectedFire");
          $('.blocked-td').addClass("selectedFire");
          $('#headBlocked').addClass("selectedFire");
          $('#statBlocked').addClass("selectedFire");
          $('#statBlocked').html('+4 per');
        }
      }, function() {
        if (!blockerIsSelected) {
          $('#blockerButton').removeClass("selectedFire");
          $('.blocked-td').removeClass("selectedFire");
          $('#headBlocked').removeClass("selectedFire");
          $('#statBlocked').removeClass("selectedFire");
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
          $('#blockerButton').addClass("selectedFire");
          $('.blocked-td').addClass("selectedFire");
          $('#headBlocked').addClass("selectedFire");
          $('#statBlocked').addClass("selectedFire");
          $('#statBlocked').html('+4 per');
        } else {
          resetAllSelectedRoles();
          blockerIsSelected = true;
          $('#blockerButton').addClass("fire");
          $('.blocked-td').addClass("fire");
          $('#headBlocked').addClass("fire");
          $('#statBlocked').addClass("fire");
          $('#statBlocked').html('+4 per');
          tryInsertPlayer();
        }
      });
    });
    
    
    
    
    $(function() {
      $('#enforcerButton').hover(function() {
        if (!enforcerIsSelected) {
          $('#enforcerButton').addClass("selectedFire");
          $('.hits-td').addClass("selectedFire");
          $('#headHits').addClass("selectedFire");
          $('#statHits').addClass("selectedFire");
          $('#statHits').html('+3 per');
        }
      }, function() {
        if (!enforcerIsSelected) {
          $('#enforcerButton').removeClass("selectedFire");
          $('.hits-td').removeClass("selectedFire");
          $('#headHits').removeClass("selectedFire");
          $('#statHits').removeClass("selectedFire");
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
          $('#enforcerButton').addClass("selectedFire");
          $('.hits-td').addClass("selectedFire");
          $('#headHits').addClass("selectedFire");
          $('#statHits').addClass("selectedFire");
          $('#statHits').html('+3 per');
        } else {
          resetAllSelectedRoles();
          enforcerIsSelected = true;
          $('#enforcerButton').addClass("fire");
          $('.hits-td').addClass("fire");
          $('#headHits').addClass("fire");
          $('#statHits').addClass("fire");
          $('#statHits').html('+3 per');
          tryInsertPlayer();
        }
      });
    });
    
    
    
    
    $(function() {
      $('#centerButton').hover(function() {
        if (!centerIsSelected) {
          $('#centerButton').addClass("selectedFire");
          $('.faceOffPct-td').addClass("selectedFire");
          $('#headFaceOffs').addClass("selectedFire");
          $('#statFaceOffs').addClass("selectedFire");
          $('#statFaceOffs').html('+2 per win<br>-1 per loss');
        }
      }, function() {
        if (!centerIsSelected) {
          $('#centerButton').removeClass("selectedFire");
          $('.faceOffPct-td').removeClass("selectedFire");
          $('#headFaceOffs').removeClass("selectedFire");
          $('#statFaceOffs').removeClass("selectedFire");
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
          $('#centerButton').addClass("selectedFire");
          $('.faceOffPct-td').addClass("selectedFire");
          $('#headFaceOffs').addClass("selectedFire");
          $('#statFaceOffs').addClass("selectedFire");
          $('#statFaceOffs').html('+2 per win<br>-1 per loss');
        } else {
          resetAllSelectedRoles();
          centerIsSelected = true;
          $('#centerButton').addClass("fire");
          $('.faceOffPct-td').addClass("fire");
          $('#headFaceOffs').addClass("fire");
          $('#statFaceOffs').addClass("fire");
          $('#statFaceOffs').html('+2 per win<br>-1 per loss');
          tryInsertPlayer();
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

    $('#p0').removeClass("goldShadow");$('#p1').removeClass("goldShadow");$('#p2').removeClass("goldShadow");$('#p3').removeClass("goldShadow");$('#p4').removeClass("goldShadow");
    $('#p5').removeClass("goldShadow");$('#p6').removeClass("goldShadow");$('#p7').removeClass("goldShadow");$('#p8').removeClass("goldShadow");$('#p9').removeClass("goldShadow");
    $('#p10').removeClass("goldShadow");$('#p11').removeClass("goldShadow");$('#p12').removeClass("goldShadow");$('#p13').removeClass("goldShadow");$('#p14').removeClass("goldShadow");
    $('#p15').removeClass("goldShadow");$('#p16').removeClass("goldShadow");$('#p17').removeClass("goldShadow");$('#p18').removeClass("goldShadow");$('#p19').removeClass("goldShadow");
    $('#p20').removeClass("goldShadow");$('#p21').removeClass("goldShadow");$('#p22').removeClass("goldShadow");$('#p23').removeClass("goldShadow");$('#p24').removeClass("goldShadow");
    $('#p25').removeClass("goldShadow");$('#p26').removeClass("goldShadow");$('#p27').removeClass("goldShadow");$('#p28').removeClass("goldShadow");$('#p29').removeClass("goldShadow");
    $('#p30').removeClass("goldShadow");$('#p31').removeClass("goldShadow");$('#p32').removeClass("goldShadow");$('#p33').removeClass("goldShadow");$('#p34').removeClass("goldShadow");
    $('#p35').removeClass("goldShadow");$('#p36').removeClass("goldShadow");$('#p37').removeClass("goldShadow");$('#p38').removeClass("goldShadow");$('#p39').removeClass("goldShadow");
    $('#p40').removeClass("goldShadow");$('#p41').removeClass("goldShadow");$('#p42').removeClass("goldShadow");$('#p43').removeClass("goldShadow");$('#p44').removeClass("goldShadow");
    $('#p45').removeClass("goldShadow");$('#p46').removeClass("goldShadow");$('#p47').removeClass("goldShadow");$('#p48').removeClass("goldShadow");$('#p49').removeClass("goldShadow");

    $('#p0').removeClass("selectedGoldShadow");$('#p1').removeClass("selectedGoldShadow");$('#p2').removeClass("selectedGoldShadow");$('#p3').removeClass("selectedGoldShadow");$('#p4').removeClass("selectedGoldShadow");
    $('#p5').removeClass("selectedGoldShadow");$('#p6').removeClass("selectedGoldShadow");$('#p7').removeClass("selectedGoldShadow");$('#p8').removeClass("selectedGoldShadow");$('#p9').removeClass("selectedGoldShadow");
    $('#p10').removeClass("selectedGoldShadow");$('#p11').removeClass("selectedGoldShadow");$('#p12').removeClass("selectedGoldShadow");$('#p13').removeClass("selectedGoldShadow");$('#p14').removeClass("selectedGoldShadow");
    $('#p15').removeClass("selectedGoldShadow");$('#p16').removeClass("selectedGoldShadow");$('#p17').removeClass("selectedGoldShadow");$('#p18').removeClass("selectedGoldShadow");$('#p19').removeClass("selectedGoldShadow");
    $('#p20').removeClass("selectedGoldShadow");$('#p21').removeClass("selectedGoldShadow");$('#p22').removeClass("selectedGoldShadow");$('#p23').removeClass("selectedGoldShadow");$('#p24').removeClass("selectedGoldShadow");
    $('#p25').removeClass("selectedGoldShadow");$('#p26').removeClass("selectedGoldShadow");$('#p27').removeClass("selectedGoldShadow");$('#p28').removeClass("selectedGoldShadow");$('#p29').removeClass("selectedGoldShadow");
    $('#p30').removeClass("selectedGoldShadow");$('#p31').removeClass("selectedGoldShadow");$('#p32').removeClass("selectedGoldShadow");$('#p33').removeClass("selectedGoldShadow");$('#p34').removeClass("selectedGoldShadow");
    $('#p35').removeClass("selectedGoldShadow");$('#p36').removeClass("selectedGoldShadow");$('#p37').removeClass("selectedGoldShadow");$('#p38').removeClass("selectedGoldShadow");$('#p39').removeClass("selectedGoldShadow");
    $('#p40').removeClass("selectedGoldShadow");$('#p41').removeClass("selectedGoldShadow");$('#p42').removeClass("selectedGoldShadow");$('#p43').removeClass("selectedGoldShadow");$('#p44').removeClass("selectedGoldShadow");
    $('#p45').removeClass("selectedGoldShadow");$('#p46').removeClass("selectedGoldShadow");$('#p47').removeClass("selectedGoldShadow");$('#p48').removeClass("selectedGoldShadow");$('#p49').removeClass("selectedGoldShadow");
}

function resetAllSelectedRoles() {
  captainIsSelected = false;
  scorerIsSelected = false;
  playmakerIsSelected = false;
  shooterIsSelected = false;
  blockerIsSelected = false;
  enforcerIsSelected = false;
  centerIsSelected = false;
  $('#captainButton').removeClass("selectedFire");
  $('#scorerButton').removeClass("selectedFire");
  $('#playmakerButton').removeClass("selectedFire");
  $('#shooterButton').removeClass("selectedFire");
  $('#blockerButton').removeClass("selectedFire");
  $('#enforcerButton').removeClass("selectedFire");
  $('#centerButton').removeClass("selectedFire");

  $('#captainButton').removeClass("fire");
  $('#scorerButton').removeClass("fire");
  $('#playmakerButton').removeClass("fire");
  $('#shooterButton').removeClass("fire");
  $('#blockerButton').removeClass("fire");
  $('#enforcerButton').removeClass("fire");
  $('#centerButton').removeClass("fire");

  $('.goals-td').removeClass("selectedFire");
  $('#headGoals').removeClass("selectedFire");
  $('#statGoals').removeClass("selectedFire");
  $('.assists-td').removeClass("selectedFire");
  $('#headAssists').removeClass("selectedFire");
  $('#statAssists').removeClass("selectedFire");
  $('.shots-td').removeClass("selectedFire");
  $('#headShots').removeClass("selectedFire");
  $('#statShots').removeClass("selectedFire");
  $('.blocked-td').removeClass("selectedFire");
  $('#headBlocked').removeClass("selectedFire");
  $('#statBlocked').removeClass("selectedFire");
  $('.hits-td').removeClass("selectedFire");
  $('#headHits').removeClass("selectedFire");
  $('#statHits').removeClass("selectedFire");
  $('.faceOffPct-td').removeClass("selectedFire");
  $('#headFaceOffs').removeClass("selectedFire");
  $('#statFaceOffs').removeClass("selectedFire");
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
  r.style.setProperty('--secondaryLight', '#ffffff');
  r.style.setProperty('--secondaryDark', '#aeb5b7');
}

function Kraken() {
  r.style.setProperty('--primaryLight', '#003866');
  r.style.setProperty('--primary', '#002a4d');
  r.style.setProperty('--primaryDark', '#001c33');
  //r.style.setProperty('--secondary', '#99D9D9');
  r.style.setProperty('--secondaryLight', '#e4e6e7');
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
