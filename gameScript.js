class Player {
    constructor(infoArr) {
        this.id = infoArr[0];
        this.fullName = infoArr[1];
        this.jerseyNumber = infoArr[2];
        this.positionCode = infoArr[3];
        this.startedLastGame = infoArr[4];
        this.salary = infoArr[5];
        this.games = infoArr[6];
        this.goals = infoArr[7];
        this.assists = infoArr[8];
        this.shots = infoArr[9];
        this.blocked = infoArr[10];
        this.hits = infoArr[11];
        this.faceOffPct = infoArr[12];
        this.penaltyMinutes = infoArr[13];
        this.plusMinus = infoArr[14];
        this.available = true;
        this.perGameStats = new PerGameStats(this);
    }
}

class PerGameStats {
  constructor(player) {
    this.id = player.id;
    this.fullName = player.fullName;
    this.jerseyNumber = player.jerseyNumber;
    this.positionCode = player.positionCode;
    this.startedLastGame = player.startedLastGame;
    this.salary = player.salary;
    this.games = player.games;
    const gp = parseFloat(this.games) / 100;
    this.goals = calcAndFormat(player.goals, gp);
    this.assists = calcAndFormat(player.assists, gp);
    this.shots = calcAndFormat(player.shots, gp);
    this.blocked = calcAndFormat(player.blocked, gp);
    this.hits = calcAndFormat(player.hits, gp);
    this.faceOffPct = player.faceOffPct;
    this.penaltyMinutes = calcAndFormat(player.penaltyMinutes, gp);
    this.plusMinus = calcAndFormat(player.plusMinus, gp);
  }
}

function calcAndFormat(stat, gp) {
  stat = stat.split(":");
  if (stat.length == 1) {
    return (Math.round(parseInt(stat[0]) / gp) / 100).toString();
  } else {
    const totalSecondsPerGame = Math.round((parseInt(stat[0]) * 60 + parseInt(stat[1]))  / (gp * 100))
    const minsPerGame = Math.floor(totalSecondsPerGame / 60).toString();
    var secsPerGame = totalSecondsPerGame % 60;
    if (secsPerGame < 10) {
      secsPerGame = '0' + secsPerGame.toString();
    } else {
      secsPerGame = secsPerGame.toString();
    }
    return minsPerGame + ':' + secsPerGame;
  }
}

class SalaryPlayer {
    constructor(player, roleId) {
        this.id = player.id;
        this.positionCode = player.positionCode;
        this.jerseyNumber = player.jerseyNumber;
        this.formatName(player.fullName);
        this.salary = player.salary;
        this.roleId = roleId;
        this.role = getRoleStr(roleId);
    }

    changeRole(roleId) {
      this.roleId = roleId;
      this.role = getRoleStr(roleId);
    }

    formatName(fullName) {
      fullName = fullName.replaceAll('ä', 'a');
      fullName = fullName.replaceAll('ö', 'o');
      fullName = fullName.replaceAll('ü', 'u');
      fullName = fullName.replaceAll('Ä', 'a');
      fullName = fullName.replaceAll('Ö', 'o');
      fullName = fullName.replaceAll('Ü', 'u');
      this.fullName = fullName;
    }
}

class Lineup {
  constructor(lineupDataCsv) {
    lineupDataCsv = lineupDataCsv.replaceAll("%27", "'")
    const lineupData = lineupDataCsv.split('|');
    this.id = lineupData[0];
    this.team = lineupData[1];
    this.name = lineupData[2];
    this.players = []
    this.players.push(lineupData[3].split(','));
    this.players.push(lineupData[4].split(','));
    this.players.push(lineupData[5].split(','));
    this.players.push(lineupData[6].split(','));
    this.players.push(lineupData[7].split(','));
  }
}

var roster = null;
const salaryCap = 100000;
var remainingSalary = salaryCap;
const curLineup = [];
const pAvailable = [];
var selectedPlayer = null;

var selectedTeamId = "Select";
var captainIsSelected = false;
var scorerIsSelected = false;
var playmakerIsSelected = false;
var shooterIsSelected = false;
var blockerIsSelected = false;
var enforcerIsSelected = false;
var centerIsSelected = false;

var displayPerGameStats = false;

function calcSalaryCap() {
  remainingSalary = salaryCap;
  for (const player of curLineup) {
    remainingSalary -= parseInt(player.salary);
  }
  $("#salaryCap").html(remainingSalary)
  setDisplayForUnavailablePlayers();;
}

function setDisplayForUnavailablePlayers() {
  for (const player of roster) {
    player.available = true;
  }

  for (const player of curLineup) {
    setPlayerAvailable(player.id);
  }

  var availableSalary = remainingSalary;
  var playersLeft = 4 - curLineup.length;
  for (var i = roster.length - 1; i >= 0; i--) {
    if (playersLeft < 0) {
      availableSalary = 0;
      break;
    } else if (playersLeft == 0) {
      break;
    }
    
    if (roster[i].available && roster[i].startedLastGame == "True") {
      availableSalary -= roster[i].salary;
      playersLeft--;
    }
  }

  for (var i = 0; i < roster.length; i++) {
    if (roster[i].salary > availableSalary) {
      roster[i].available = false;
    }
  }

  const starters = getStartersArr(roster);
  for (var i = 0; i < roster.length; i++) {
    pAvailable[i] = starters[i].available;
  }
  
}

function setPlayerAvailable(id) {
  for (var i = 0; i < roster.length; i++) {
    if (roster[i].id == id) {
      roster[i].available = false;
    }
  }
}

function togglePerGameStats() {
    displayPerGameStats = !displayPerGameStats;

    const starters = getStartersArr(roster);
    populateTable(starters);
    resetAllSelectedPlayers();
    resetAllSelectedRoles();
    afterLoadingPlayers();
}

function getSeasonStats() {
    const myUrl = "http://localhost:8080/get-season-stats?" + selectedTeamId;
    const response = httpGet(myUrl);
    roster = createRoster(response);
    curLineup.length = 0;
    rewriteLineupHTML();
    return response;
}

function getStartersArr(playerArr) {
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
    return starters;
}

function createRoster(responseCsv) {
    const playerCsvArr = responseCsv.split("|");
    const playerArr = [];
    for (const playerCsv of playerCsvArr) {
        playerArr.push(new Player(playerCsv.split(",")));
    }

    const starters = getStartersArr(playerArr);
    populateTable(starters);
    return playerArr;
}

function populateTable(playerArr) {
    var tableStr = '';
    for (var i=0; i < playerArr.length; i++) {
        var playerInfo = playerArr[i];
        if (displayPerGameStats) {
          playerInfo = playerInfo.perGameStats;
        }

        if (i % 2 == 0) {
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr id="p'+i+'" class="player-row even-row">' + getHTMLForPlayer(playerInfo) + '</tr>';
            } else {
                tableStr += '<tr id="p'+i+'" class="player-row even-row non-starter">' + getHTMLForPlayer(playerInfo) + '</tr>';
            }
            
        } else {
            
            if (playerArr[i].startedLastGame == "True") {
                tableStr += '<tr id="p'+i+'" class="player-row">' + getHTMLForPlayer(playerInfo) + '</tr>';
            } else {
                tableStr += '<tr id="p'+i+'" class="player-row non-starter">' + getHTMLForPlayer(playerInfo) + '</tr>';
            }
        }
    }
    tableStr += '<tr class="tableEnd"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
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
    if (parseFloat(player.plusMinus) > 0) {
        htmlStr += '<td>+' + player.plusMinus + '</td>';
    } else {
        htmlStr += '<td>' + player.plusMinus + '</td>';
    }
    
    htmlStr += '<td>' + player.penaltyMinutes + '</td>';
    return htmlStr
}



function selectTeam() {
  selectedTeamId = document.getElementById("teamDropdown").value;
  beforeLoadingPlayers();
  setTimeout(function() {
    getSeasonStats();
    refreshPage();
    getLineups()
  }, 250);
}

function beforeLoadingPlayers() {
  selectColorScheme();
  resetAllSelectedPlayers();
  resetAllSelectedRoles();
  $("#playerTable").hide();
  $("#curLineupDiv").hide();
  document.getElementById('roleButtons').innerHTML = '<div>Loading Season Stats...</div>';
}

function afterLoadingPlayers() {
  document.getElementById('roleButtons').innerHTML = generateRoleButtonsHTML();
  calcSalaryCap();
  afterPlayerRowsLoaded();
  
  $("#playerTable").show();
  $("#curLineupDiv").show();
}

function generateRoleButtonsHTML() {
  var roleButtonsHTML = '';
  if (curLineup.length < 5) {
    if (roleIsStillAvailable(1)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="captainButton">Captain<div class="subButton">Goals x2 & Assists x2</div></button>';
    }
    if (roleIsStillAvailable(2)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="scorerButton">Scorer<div class="subButton">Goals x2</div></button>';
    }
    if (roleIsStillAvailable(3)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="playmakerButton">Playmaker<div class="subButton">Assists x2</div></button>';
    }
    if (roleIsStillAvailable(4)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="shooterButton">Shooter<div class="subButton">Shots x3</div></button>';
    }
    if (roleIsStillAvailable(5)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="blockerButton">Blocker<div class="subButton">Blocked Shots x4</div></button>';
    }
    if (roleIsStillAvailable(6)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="enforcerButton">Enforcer<div class="subButton">Hits x3</div></button>';
    }
    if (roleIsStillAvailable(7)) {
      roleButtonsHTML += '<button type="button" class="roleButton" id="centerButton">Center<div class="subButton">Face Off Wins x2</div></button>';
    }
  }
  return roleButtonsHTML;
}

function roleIsStillAvailable(roleId) {
  for (salaryPlayer of curLineup) {
    if (salaryPlayer.roleId == roleId) {
      return false;
    }
  }
  return true;
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

function getSelectedRoleId() {
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

function getRoleStr(roleId) {
  if (roleId == 1)
    return 'Captain';
  if (roleId == 2)
    return 'Scorer';
  if (roleId == 3)
    return 'Playmaker';
  if (roleId == 4)
    return 'Shooter';
  if (roleId == 5)
    return 'Blocker';
  if (roleId == 6)
    return 'Enforcer';
  if (roleId == 7)
    return 'Center';
  return 'No role assigned';
}

function getRoleId(roleStr) {
  if (roleStr == 'Captain')
    return 1;
  if (roleStr == 'Scorer')
    return 2;
  if (roleStr == 'Playmaker')
    return 3;
  if (roleStr == 'Shooter')
    return 4;
  if (roleStr == 'Blocker')
    return 5;
  if (roleStr == 'Enforcer')
    return 6;
  if (roleStr == 'Center')
    return 7;
  return 'No role assigned';
}

function tryInsertPlayer() {
  const selectedRoleId = getSelectedRoleId();
  if (selectedPlayer != null && selectedRoleId > 0 && curLineup.length < 5) {
    if (playerIsAlreadyInLineup(selectedPlayer.id)) {

    } else {
      const newPlayer = new SalaryPlayer(selectedPlayer, selectedRoleId);
      curLineup.push(newPlayer);
    }
    refreshPage();
  }
}

function playerIsAlreadyInLineup(playerId) {
  for (const player of curLineup) {
    if (player.id == playerId) {
        return true;
    }
  }
  return false;
}

function parsePlayerFromLineup(id) {
  const playerId = document.getElementById(id).innerHTML.split('<div hidden="">')[1].split('</div>')[0];
  const role = document.getElementById(id).innerHTML.split('rightGlow">')[1].split('</div>')[0];
  for (const player of roster) {
      if (player.id == playerId) {
          return new SalaryPlayer(player, role);
      }
  }
  return null;
}

function submitCurLineup() {
  const team = document.getElementById('teamDropdown').value;
  const lineupName = document.getElementById('lineupName').value;
  var urlParam = team + '_' + lineupName;
  for (var i = 0; i < curLineup.length; i++) {
    urlParam += '_' + curLineup[i].id + '-' + curLineup[i].positionCode + '-' + curLineup[i].jerseyNumber + '-' + curLineup[i].fullName + '-' + curLineup[i].salary + '-' + curLineup[i].role;
  }
  const myUrl = "http://localhost:8080/submit-lineup?" + urlParam;
  const response = httpGet(myUrl);
  writeLineupResponse(response);
  clearCurLineup();
  document.getElementById('lineupName').value = '';
}

function getLineups() {
  const myUrl = "http://localhost:8080/get-lineups";
  const response = httpGet(myUrl);
  writeLineupResponse(response);
}


function editLineupButton(lineupId) {
  const myUrl = "http://localhost:8080/get-lineup-by-id?" + lineupId;
  const response = httpGet(myUrl);
  const lineupToEditCsv = response.split('_')[0];
  const otherLineupsCsv = response.split('_')[1];
  const lineupToEdit = new Lineup(lineupToEditCsv);
  document.getElementById('lineupName').value = lineupToEdit.name;
  if (lineupToEdit.team != document.getElementById('teamDropdown').value) {
    document.getElementById('teamDropdown').value = lineupToEdit.team;
    selectedTeamId = document.getElementById("teamDropdown").value;
    beforeLoadingPlayers();
    setTimeout(function() {
      getSeasonStats();
      getLineups();
      lineupToCurLineup(lineupToEdit);
      writeLineupResponse(otherLineupsCsv);
      refreshPage();
    }, 250);
  } else {
    lineupToCurLineup(lineupToEdit);
    writeLineupResponse(otherLineupsCsv);
    refreshPage();
  }

  
}

function lineupToCurLineup(lineup) {
  curLineup.length = 0;
  for (var i = 0; i < lineup.players.length; i++) {
    for (var j = 0; j < roster.length; j++) {
      if (roster[j].id == lineup.players[i][0]) {
        curLineup.push(new SalaryPlayer(roster[j], getRoleId(lineup.players[i][5])));
      }
    }
  }
}

function deleteLineupButton(lineupId) {
  const myUrl = "http://localhost:8080/delete-lineup?" + lineupId;
  const response = httpGet(myUrl);
  writeLineupResponse(response);
}

function writeLineupResponse(response) {
  if (response.length < 1) {
    $('#allLineupsDiv').hide();
  } else {
    const allLineupsCsv = response.split('\n');
    var lineupHTML =  '';
    for (var i = 0; i < allLineupsCsv.length; i++) {
      const lineup = new Lineup(allLineupsCsv[i]);
      var tableStr = '';
      tableStr += '<table id="lineupsTable'+lineup.id+'" class="allLineupsTable '+lineup.team+'LightBorder">';
      tableStr += '<caption id="lineupsCaption'+lineup.id+'" class="allLineupsCaption '+lineup.team+'Primary '+lineup.team+'LightBorder"><table class="allLineupsCaptionTable"><thead><tr><th class="lineupButtons"><div class="clearSavedLineup" onclick="deleteLineupButton('+lineup.id+')">X</div><div class="editSavedLineup" onclick="editLineupButton('+lineup.id+')">Edit</div></th><th>'+lineup.name.replaceAll('%20',' ')+'</th><th>'+lineup.team.replace(/([A-Z])/g, ' $1').trim()+'</th></thead></table></caption>';
      tableStr += '<thead id="lineupsThead'+lineup.id+'" class="'+lineup.team+'Light">';
      tableStr += '<tr>';
      tableStr += '<th>Pos.</th>';
      tableStr += '<th>#</th>';
      tableStr += '<th>Name</th>';
      tableStr += '<th class="lineupTh">Salary</th>';
      tableStr += '<th class="lineupTh">Role</th>';
      tableStr += '</tr>';
      tableStr += '</thead>';
      tableStr += '<tbody id="lineupsTbody'+lineup.id+'" class="'+lineup.team+'Primary">';
      tableStr += '<tr class="'+lineup.team+'Dark"><td><div hidden>'+lineup.players[0][0]+'</div>'+lineup.players[0][1]+'</td><td>'+lineup.players[0][2]+'</td><td class="'+lineup.team+'LeftGlow">'+lineup.players[0][3].replaceAll('%20',' ')+'</td><td>'+lineup.players[0][4]+'</td><td class="'+lineup.team+'RightGlow selectedFire">'+lineup.players[0][5]+'</td></tr>';
      tableStr += '<tr><td><div hidden>'+lineup.players[1][0]+'</div>'+lineup.players[1][1]+'</td><td>'+lineup.players[1][2]+'</td><td class="'+lineup.team+'LeftGlow">'+lineup.players[1][3].replaceAll('%20',' ')+'</td><td>'+lineup.players[1][4]+'</td><td class="'+lineup.team+'RightGlow selectedFire">'+lineup.players[1][5]+'</td></tr>';
      tableStr += '<tr class="'+lineup.team+'Dark"><td><div hidden>'+lineup.players[2][0]+'</div>'+lineup.players[2][1]+'</td><td>'+lineup.players[2][2]+'</td><td class="'+lineup.team+'LeftGlow">'+lineup.players[2][3].replaceAll('%20',' ')+'</td><td>'+lineup.players[2][4]+'</td><td class="'+lineup.team+'RightGlow selectedFire">'+lineup.players[2][5]+'</td></tr>';
      tableStr += '<tr><td><div hidden>'+lineup.players[3][0]+'</div>'+lineup.players[3][1]+'</td><td>'+lineup.players[3][2]+'</td><td class="'+lineup.team+'LeftGlow">'+lineup.players[3][3].replaceAll('%20',' ')+'</td><td>'+lineup.players[3][4]+'</td><td class="'+lineup.team+'RightGlow selectedFire">'+lineup.players[3][5]+'</td></tr>';
      tableStr += '<tr class="'+lineup.team+'Dark"><td><div hidden>'+lineup.players[4][0]+'</div>'+lineup.players[4][1]+'</td><td>'+lineup.players[4][2]+'</td><td class="'+lineup.team+'LeftGlow">'+lineup.players[4][3].replaceAll('%20',' ')+'</td><td>'+lineup.players[4][4]+'</td><td class="'+lineup.team+'RightGlow selectedFire">'+lineup.players[4][5]+'</td></tr>';
      tableStr += '<tr class="'+lineup.team+'Light"><td></td><td></td><td></td><td></td><td></td></tr>';
      tableStr += '</tbody>';
      tableStr += '</table>';
      lineupHTML += tableStr;
      document.getElementById('allLineupsDiv').innerHTML = lineupHTML;
      $('#allLineupsDiv').show();
    }
  }


}

function rewriteLineupHTML() {
  curLineup.sort((a, b) => {
    return b.salary - a.salary;
  });
  for (var i = 0; i < 5; i++) {
    var playerHTML = '';
    if (i < curLineup.length) {
      playerHTML = '<td id="pltd'+i+'1" class="inLineup"><div hidden>' + curLineup[i].id + '</div>' + curLineup[i].positionCode + '</td>';
      playerHTML += '<td id="pltd'+i+'2" class="inLineup">' + curLineup[i].jerseyNumber + '</td>';
      playerHTML += '<td id="pltd'+i+'3" class="leftGlow inLineup">' + curLineup[i].fullName + '</td>';
      playerHTML += '<td id="pltd'+i+'4" class="inLineup">' + curLineup[i].salary + '</td>';
      playerHTML += '<td id="pltd'+i+'5" class="selectedFire inLineup rightGlow">' + getAvailableRolesDropdownHTML(curLineup[i].id, curLineup[i].roleId) + '</td>';
    } else {
      playerHTML = '<td>_</td><td></td><td class="leftGlow"></td><td></td><td class="rightGlow  selectedFire"></td>';
    }
    if (curLineup.length == 5 && document.getElementById('lineupName').value != "") {
      $('#submitLineup').show();
    } else {
      $('#submitLineup').hide();
    }
    $('#pl' + i).html(playerHTML);
  }
}

function getAvailableRolesDropdownHTML(salaryPlayerId, roleId) {
  var dropdownHTML = '<option value="' + roleId + '">' + getRoleStr(roleId) + '</option>';
  for (var i = 1; i <= 7; i++) {
    if (i != roleId && roleIsStillAvailable(i)) {
      dropdownHTML += '<option value="' + i + '">' + getRoleStr(i) + '</option>';
    }
  }
  playerHTML = '<select class="plDropdown" id="plDropdown'+ salaryPlayerId + '" onchange="reArrangeRoles(' + salaryPlayerId + ');">' + dropdownHTML + '</select>';
  return playerHTML;
}

function reArrangeRoles(salaryPlayerId) {
  const newRoleId = document.getElementById('plDropdown' + salaryPlayerId).value;
  for (var i = 0; i < curLineup.length; i++) {
    if (curLineup[i].id == salaryPlayerId) {
      curLineup[i].changeRole(newRoleId);
    }
  }
  refreshPage();
}

function clearCurLineup() {
  for (var i = 0; i < curLineup.length; i++) {
    for (var j = 0; j < roster.length; j++) {
      if (roster[j].id == curLineup[i].id) {
        roster[j].available = true;
      }
    }
  }
  curLineup.length = 0;
  refreshPage();
}

function refreshPage() {
  rewriteLineupHTML();
  resetAllSelectedPlayers();
  resetAllSelectedRoles();
  afterLoadingPlayers();
}

function removePlayerFromLineup(id) {
  const salaryPlayer = parsePlayerFromLineup(id);
  const tempLineup = [];
  for (var i = 0; i < curLineup.length; i++) {
    if (curLineup[i].id != salaryPlayer.id) {
      tempLineup.push(curLineup[i]);
    }
  }
  curLineup.length = 0;
  for (var i = 0; i < tempLineup.length; i++) {
    curLineup.push(tempLineup[i]);
  }

  for (var i = 0; i < roster.length; i++) {
    if (roster[i].id == salaryPlayer.id) {
      roster[i].available = true;
    }
  }
  refreshPage();
}

function afterPlayerRowsLoaded() {

    for (var i = 0; i < 5; i++) {
      for (var j = 1; j < 5; j++) {
        $('#pltd' + i + j).unbind();
      }
    }
    for (var i = 0; i < 40; i++) {
      $('#p' + i).unbind();
    }
    $('#captainButton').unbind();
    $('#scorerButton').unbind();
    $('#playmakerButton').unbind();
    $('#shooterButton').unbind();
    $('#blockerButton').unbind();
    $('#enforcerButton').unbind();
    $('#centerButton').unbind();

    const pSelected = [];
    for (var i = 0; i < 50; i++) {
      pSelected.push(false);
      pAvailable.push(true);
    }



    $('#pltd01').hover(function() {$("#pl0").addClass("redShadow");}, function() {$("#pl0").removeClass("redShadow");});
    $('#pltd02').hover(function() {$("#pl0").addClass("redShadow");}, function() {$("#pl0").removeClass("redShadow");});
    $('#pltd03').hover(function() {$("#pl0").addClass("redShadow");}, function() {$("#pl0").removeClass("redShadow");});
    $('#pltd04').hover(function() {$("#pl0").addClass("redShadow");}, function() {$("#pl0").removeClass("redShadow");});
    $('#pltd11').hover(function() {$("#pl1").addClass("redShadow");}, function() {$("#pl1").removeClass("redShadow");});
    $('#pltd12').hover(function() {$("#pl1").addClass("redShadow");}, function() {$("#pl1").removeClass("redShadow");});
    $('#pltd13').hover(function() {$("#pl1").addClass("redShadow");}, function() {$("#pl1").removeClass("redShadow");});
    $('#pltd14').hover(function() {$("#pl1").addClass("redShadow");}, function() {$("#pl1").removeClass("redShadow");});
    $('#pltd21').hover(function() {$("#pl2").addClass("redShadow");}, function() {$("#pl2").removeClass("redShadow");});
    $('#pltd22').hover(function() {$("#pl2").addClass("redShadow");}, function() {$("#pl2").removeClass("redShadow");});
    $('#pltd23').hover(function() {$("#pl2").addClass("redShadow");}, function() {$("#pl2").removeClass("redShadow");});
    $('#pltd24').hover(function() {$("#pl2").addClass("redShadow");}, function() {$("#pl2").removeClass("redShadow");});
    $('#pltd31').hover(function() {$("#pl3").addClass("redShadow");}, function() {$("#pl3").removeClass("redShadow");});
    $('#pltd32').hover(function() {$("#pl3").addClass("redShadow");}, function() {$("#pl3").removeClass("redShadow");});
    $('#pltd33').hover(function() {$("#pl3").addClass("redShadow");}, function() {$("#pl3").removeClass("redShadow");});
    $('#pltd34').hover(function() {$("#pl3").addClass("redShadow");}, function() {$("#pl3").removeClass("redShadow");});
    $('#pltd41').hover(function() {$("#pl4").addClass("redShadow");}, function() {$("#pl4").removeClass("redShadow");});
    $('#pltd42').hover(function() {$("#pl4").addClass("redShadow");}, function() {$("#pl4").removeClass("redShadow");});
    $('#pltd43').hover(function() {$("#pl4").addClass("redShadow");}, function() {$("#pl4").removeClass("redShadow");});
    $('#pltd44').hover(function() {$("#pl4").addClass("redShadow");}, function() {$("#pl4").removeClass("redShadow");});

    $('#pltd01').click(function() {removePlayerFromLineup('pl0');$("#pl0").removeClass("redShadow");});
    $('#pltd02').click(function() {removePlayerFromLineup('pl0');$("#pl0").removeClass("redShadow");});
    $('#pltd03').click(function() {removePlayerFromLineup('pl0');$("#pl0").removeClass("redShadow");});
    $('#pltd04').click(function() {removePlayerFromLineup('pl0');$("#pl0").removeClass("redShadow");});
    $('#pltd11').click(function() {removePlayerFromLineup('pl1');$("#pl1").removeClass("redShadow");});
    $('#pltd12').click(function() {removePlayerFromLineup('pl1');$("#pl1").removeClass("redShadow");});
    $('#pltd13').click(function() {removePlayerFromLineup('pl1');$("#pl1").removeClass("redShadow");});
    $('#pltd14').click(function() {removePlayerFromLineup('pl1');$("#pl1").removeClass("redShadow");});
    $('#pltd21').click(function() {removePlayerFromLineup('pl2');$("#pl2").removeClass("redShadow");});
    $('#pltd22').click(function() {removePlayerFromLineup('pl2');$("#pl2").removeClass("redShadow");});
    $('#pltd23').click(function() {removePlayerFromLineup('pl2');$("#pl2").removeClass("redShadow");});
    $('#pltd24').click(function() {removePlayerFromLineup('pl2');$("#pl2").removeClass("redShadow");});
    $('#pltd31').click(function() {removePlayerFromLineup('pl3');$("#pl3").removeClass("redShadow");});
    $('#pltd32').click(function() {removePlayerFromLineup('pl3');$("#pl3").removeClass("redShadow");});
    $('#pltd33').click(function() {removePlayerFromLineup('pl3');$("#pl3").removeClass("redShadow");});
    $('#pltd34').click(function() {removePlayerFromLineup('pl3');$("#pl3").removeClass("redShadow");});
    $('#pltd41').click(function() {removePlayerFromLineup('pl4');$("#pl4").removeClass("redShadow");});
    $('#pltd42').click(function() {removePlayerFromLineup('pl4');$("#pl4").removeClass("redShadow");});
    $('#pltd43').click(function() {removePlayerFromLineup('pl4');$("#pl4").removeClass("redShadow");});
    $('#pltd44').click(function() {removePlayerFromLineup('pl4');$("#pl4").removeClass("redShadow");});
    

    $(function() {if (!pAvailable[0]) {$("#p0").addClass("unavailable")} else {$("#p0").removeClass("unavailable");$('#p0').hover(function() {if (!pSelected[0]) {$("#p0").addClass("goldShadow");}}, function() {if (!pSelected[0]) {$("#p0").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[1]) {$("#p1").addClass("unavailable")} else {$("#p1").removeClass("unavailable");$('#p1').hover(function() {if (!pSelected[1]) {$("#p1").addClass("goldShadow");}}, function() {if (!pSelected[1]) {$("#p1").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[2]) {$("#p2").addClass("unavailable")} else {$("#p2").removeClass("unavailable");$('#p2').hover(function() {if (!pSelected[2]) {$("#p2").addClass("goldShadow");}}, function() {if (!pSelected[2]) {$("#p2").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[3]) {$("#p3").addClass("unavailable")} else {$("#p3").removeClass("unavailable");$('#p3').hover(function() {if (!pSelected[3]) {$("#p3").addClass("goldShadow");}}, function() {if (!pSelected[3]) {$("#p3").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[4]) {$("#p4").addClass("unavailable")} else {$("#p4").removeClass("unavailable");$('#p4').hover(function() {if (!pSelected[4]) {$("#p4").addClass("goldShadow");}}, function() {if (!pSelected[4]) {$("#p4").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[5]) {$("#p5").addClass("unavailable")} else {$("#p5").removeClass("unavailable");$('#p5').hover(function() {if (!pSelected[5]) {$("#p5").addClass("goldShadow");}}, function() {if (!pSelected[5]) {$("#p5").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[6]) {$("#p6").addClass("unavailable")} else {$("#p6").removeClass("unavailable");$('#p6').hover(function() {if (!pSelected[6]) {$("#p6").addClass("goldShadow");}}, function() {if (!pSelected[6]) {$("#p6").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[7]) {$("#p7").addClass("unavailable")} else {$("#p7").removeClass("unavailable");$('#p7').hover(function() {if (!pSelected[7]) {$("#p7").addClass("goldShadow");}}, function() {if (!pSelected[7]) {$("#p7").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[8]) {$("#p8").addClass("unavailable")} else {$("#p8").removeClass("unavailable");$('#p8').hover(function() {if (!pSelected[8]) {$("#p8").addClass("goldShadow");}}, function() {if (!pSelected[8]) {$("#p8").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[9]) {$("#p9").addClass("unavailable")} else {$("#p9").removeClass("unavailable");$('#p9').hover(function() {if (!pSelected[9]) {$("#p9").addClass("goldShadow");}}, function() {if (!pSelected[9]) {$("#p9").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[10]) {$("#p10").addClass("unavailable")} else {$("#p10").removeClass("unavailable");$('#p10').hover(function() {if (!pSelected[10]) {$("#p10").addClass("goldShadow");}}, function() {if (!pSelected[10]) {$("#p10").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[11]) {$("#p11").addClass("unavailable")} else {$("#p11").removeClass("unavailable");$('#p11').hover(function() {if (!pSelected[11]) {$("#p11").addClass("goldShadow");}}, function() {if (!pSelected[11]) {$("#p11").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[12]) {$("#p12").addClass("unavailable")} else {$("#p12").removeClass("unavailable");$('#p12').hover(function() {if (!pSelected[12]) {$("#p12").addClass("goldShadow");}}, function() {if (!pSelected[12]) {$("#p12").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[13]) {$("#p13").addClass("unavailable")} else {$("#p13").removeClass("unavailable");$('#p13').hover(function() {if (!pSelected[13]) {$("#p13").addClass("goldShadow");}}, function() {if (!pSelected[13]) {$("#p13").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[14]) {$("#p14").addClass("unavailable")} else {$("#p14").removeClass("unavailable");$('#p14').hover(function() {if (!pSelected[14]) {$("#p14").addClass("goldShadow");}}, function() {if (!pSelected[14]) {$("#p14").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[15]) {$("#p15").addClass("unavailable")} else {$("#p15").removeClass("unavailable");$('#p15').hover(function() {if (!pSelected[15]) {$("#p15").addClass("goldShadow");}}, function() {if (!pSelected[15]) {$("#p15").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[16]) {$("#p16").addClass("unavailable")} else {$("#p16").removeClass("unavailable");$('#p16').hover(function() {if (!pSelected[16]) {$("#p16").addClass("goldShadow");}}, function() {if (!pSelected[16]) {$("#p16").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[17]) {$("#p17").addClass("unavailable")} else {$("#p17").removeClass("unavailable");$('#p17').hover(function() {if (!pSelected[17]) {$("#p17").addClass("goldShadow");}}, function() {if (!pSelected[17]) {$("#p17").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[18]) {$("#p18").addClass("unavailable")} else {$("#p18").removeClass("unavailable");$('#p18').hover(function() {if (!pSelected[18]) {$("#p18").addClass("goldShadow");}}, function() {if (!pSelected[18]) {$("#p18").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[19]) {$("#p19").addClass("unavailable")} else {$("#p19").removeClass("unavailable");$('#p19').hover(function() {if (!pSelected[19]) {$("#p19").addClass("goldShadow");}}, function() {if (!pSelected[19]) {$("#p19").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[20]) {$("#p20").addClass("unavailable")} else {$("#p20").removeClass("unavailable");$('#p20').hover(function() {if (!pSelected[20]) {$("#p20").addClass("goldShadow");}}, function() {if (!pSelected[20]) {$("#p20").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[21]) {$("#p21").addClass("unavailable")} else {$("#p21").removeClass("unavailable");$('#p21').hover(function() {if (!pSelected[21]) {$("#p21").addClass("goldShadow");}}, function() {if (!pSelected[21]) {$("#p21").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[22]) {$("#p22").addClass("unavailable")} else {$("#p22").removeClass("unavailable");$('#p22').hover(function() {if (!pSelected[22]) {$("#p22").addClass("goldShadow");}}, function() {if (!pSelected[22]) {$("#p22").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[23]) {$("#p23").addClass("unavailable")} else {$("#p23").removeClass("unavailable");$('#p23').hover(function() {if (!pSelected[23]) {$("#p23").addClass("goldShadow");}}, function() {if (!pSelected[23]) {$("#p23").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[24]) {$("#p24").addClass("unavailable")} else {$("#p24").removeClass("unavailable");$('#p24').hover(function() {if (!pSelected[24]) {$("#p24").addClass("goldShadow");}}, function() {if (!pSelected[24]) {$("#p24").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[25]) {$("#p25").addClass("unavailable")} else {$("#p25").removeClass("unavailable");$('#p25').hover(function() {if (!pSelected[25]) {$("#p25").addClass("goldShadow");}}, function() {if (!pSelected[25]) {$("#p25").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[26]) {$("#p26").addClass("unavailable")} else {$("#p26").removeClass("unavailable");$('#p26').hover(function() {if (!pSelected[26]) {$("#p26").addClass("goldShadow");}}, function() {if (!pSelected[26]) {$("#p26").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[27]) {$("#p27").addClass("unavailable")} else {$("#p27").removeClass("unavailable");$('#p27').hover(function() {if (!pSelected[27]) {$("#p27").addClass("goldShadow");}}, function() {if (!pSelected[27]) {$("#p27").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[28]) {$("#p28").addClass("unavailable")} else {$("#p28").removeClass("unavailable");$('#p28').hover(function() {if (!pSelected[28]) {$("#p28").addClass("goldShadow");}}, function() {if (!pSelected[28]) {$("#p28").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[29]) {$("#p29").addClass("unavailable")} else {$("#p29").removeClass("unavailable");$('#p29').hover(function() {if (!pSelected[29]) {$("#p29").addClass("goldShadow");}}, function() {if (!pSelected[29]) {$("#p29").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[30]) {$("#p30").addClass("unavailable")} else {$("#p30").removeClass("unavailable");$('#p30').hover(function() {if (!pSelected[30]) {$("#p30").addClass("goldShadow");}}, function() {if (!pSelected[30]) {$("#p30").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[31]) {$("#p31").addClass("unavailable")} else {$("#p31").removeClass("unavailable");$('#p31').hover(function() {if (!pSelected[31]) {$("#p31").addClass("goldShadow");}}, function() {if (!pSelected[31]) {$("#p31").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[32]) {$("#p32").addClass("unavailable")} else {$("#p32").removeClass("unavailable");$('#p32').hover(function() {if (!pSelected[32]) {$("#p32").addClass("goldShadow");}}, function() {if (!pSelected[32]) {$("#p32").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[33]) {$("#p33").addClass("unavailable")} else {$("#p33").removeClass("unavailable");$('#p33').hover(function() {if (!pSelected[33]) {$("#p33").addClass("goldShadow");}}, function() {if (!pSelected[33]) {$("#p33").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[34]) {$("#p34").addClass("unavailable")} else {$("#p34").removeClass("unavailable");$('#p34').hover(function() {if (!pSelected[34]) {$("#p34").addClass("goldShadow");}}, function() {if (!pSelected[34]) {$("#p34").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[35]) {$("#p35").addClass("unavailable")} else {$("#p35").removeClass("unavailable");$('#p35').hover(function() {if (!pSelected[35]) {$("#p35").addClass("goldShadow");}}, function() {if (!pSelected[35]) {$("#p35").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[36]) {$("#p36").addClass("unavailable")} else {$("#p36").removeClass("unavailable");$('#p36').hover(function() {if (!pSelected[36]) {$("#p36").addClass("goldShadow");}}, function() {if (!pSelected[36]) {$("#p36").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[37]) {$("#p37").addClass("unavailable")} else {$("#p37").removeClass("unavailable");$('#p37').hover(function() {if (!pSelected[37]) {$("#p37").addClass("goldShadow");}}, function() {if (!pSelected[37]) {$("#p37").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[38]) {$("#p38").addClass("unavailable")} else {$("#p38").removeClass("unavailable");$('#p38').hover(function() {if (!pSelected[38]) {$("#p38").addClass("goldShadow");}}, function() {if (!pSelected[38]) {$("#p38").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[39]) {$("#p39").addClass("unavailable")} else {$("#p39").removeClass("unavailable");$('#p39').hover(function() {if (!pSelected[39]) {$("#p39").addClass("goldShadow");}}, function() {if (!pSelected[39]) {$("#p39").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[40]) {$("#p40").addClass("unavailable")} else {$("#p40").removeClass("unavailable");$('#p40').hover(function() {if (!pSelected[40]) {$("#p40").addClass("goldShadow");}}, function() {if (!pSelected[40]) {$("#p40").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[41]) {$("#p41").addClass("unavailable")} else {$("#p41").removeClass("unavailable");$('#p41').hover(function() {if (!pSelected[41]) {$("#p41").addClass("goldShadow");}}, function() {if (!pSelected[41]) {$("#p41").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[42]) {$("#p42").addClass("unavailable")} else {$("#p42").removeClass("unavailable");$('#p42').hover(function() {if (!pSelected[42]) {$("#p42").addClass("goldShadow");}}, function() {if (!pSelected[42]) {$("#p42").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[43]) {$("#p43").addClass("unavailable")} else {$("#p43").removeClass("unavailable");$('#p43').hover(function() {if (!pSelected[43]) {$("#p43").addClass("goldShadow");}}, function() {if (!pSelected[43]) {$("#p43").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[44]) {$("#p44").addClass("unavailable")} else {$("#p44").removeClass("unavailable");$('#p44').hover(function() {if (!pSelected[44]) {$("#p44").addClass("goldShadow");}}, function() {if (!pSelected[44]) {$("#p44").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[45]) {$("#p45").addClass("unavailable")} else {$("#p45").removeClass("unavailable");$('#p45').hover(function() {if (!pSelected[45]) {$("#p45").addClass("goldShadow");}}, function() {if (!pSelected[45]) {$("#p45").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[46]) {$("#p46").addClass("unavailable")} else {$("#p46").removeClass("unavailable");$('#p46').hover(function() {if (!pSelected[46]) {$("#p46").addClass("goldShadow");}}, function() {if (!pSelected[46]) {$("#p46").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[47]) {$("#p47").addClass("unavailable")} else {$("#p47").removeClass("unavailable");$('#p47').hover(function() {if (!pSelected[47]) {$("#p47").addClass("goldShadow");}}, function() {if (!pSelected[47]) {$("#p47").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[48]) {$("#p48").addClass("unavailable")} else {$("#p48").removeClass("unavailable");$('#p48').hover(function() {if (!pSelected[48]) {$("#p48").addClass("goldShadow");}}, function() {if (!pSelected[48]) {$("#p48").removeClass("goldShadow");}});}});
    $(function() {if (!pAvailable[49]) {$("#p49").addClass("unavailable")} else {$("#p49").removeClass("unavailable");$('#p49').hover(function() {if (!pSelected[49]) {$("#p49").addClass("goldShadow");}}, function() {if (!pSelected[49]) {$("#p49").removeClass("goldShadow");}});}});

    $(function() {if (pAvailable[0]) {$('#p0').click(function() {resetAllSelectedPlayers();if (pSelected[0]) {pSelected[0] = false;selectedPlayer = null;$("#p0").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[0] = true;parsePlayerFromRow('p0');$("#p0").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[1]) {$('#p1').click(function() {resetAllSelectedPlayers();if (pSelected[1]) {pSelected[1] = false;selectedPlayer = null;$("#p1").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[1] = true;parsePlayerFromRow('p1');$("#p1").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[2]) {$('#p2').click(function() {resetAllSelectedPlayers();if (pSelected[2]) {pSelected[2] = false;selectedPlayer = null;$("#p2").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[2] = true;parsePlayerFromRow('p2');$("#p2").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[3]) {$('#p3').click(function() {resetAllSelectedPlayers();if (pSelected[3]) {pSelected[3] = false;selectedPlayer = null;$("#p3").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[3] = true;parsePlayerFromRow('p3');$("#p3").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[4]) {$('#p4').click(function() {resetAllSelectedPlayers();if (pSelected[4]) {pSelected[4] = false;selectedPlayer = null;$("#p4").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[4] = true;parsePlayerFromRow('p4');$("#p4").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[5]) {$('#p5').click(function() {resetAllSelectedPlayers();if (pSelected[5]) {pSelected[5] = false;selectedPlayer = null;$("#p5").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[5] = true;parsePlayerFromRow('p5');$("#p5").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[6]) {$('#p6').click(function() {resetAllSelectedPlayers();if (pSelected[6]) {pSelected[6] = false;selectedPlayer = null;$("#p6").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[6] = true;parsePlayerFromRow('p6');$("#p6").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[7]) {$('#p7').click(function() {resetAllSelectedPlayers();if (pSelected[7]) {pSelected[7] = false;selectedPlayer = null;$("#p7").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[7] = true;parsePlayerFromRow('p7');$("#p7").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[8]) {$('#p8').click(function() {resetAllSelectedPlayers();if (pSelected[8]) {pSelected[8] = false;selectedPlayer = null;$("#p8").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[8] = true;parsePlayerFromRow('p8');$("#p8").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[9]) {$('#p9').click(function() {resetAllSelectedPlayers();if (pSelected[9]) {pSelected[9] = false;selectedPlayer = null;$("#p9").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[9] = true;parsePlayerFromRow('p9');$("#p9").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[10]) {$('#p10').click(function() {resetAllSelectedPlayers();if (pSelected[10]) {pSelected[10] = false;selectedPlayer = null;$("#p10").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[10] = true;parsePlayerFromRow('p10');$("#p10").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[11]) {$('#p11').click(function() {resetAllSelectedPlayers();if (pSelected[11]) {pSelected[11] = false;selectedPlayer = null;$("#p11").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[11] = true;parsePlayerFromRow('p11');$("#p11").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[12]) {$('#p12').click(function() {resetAllSelectedPlayers();if (pSelected[12]) {pSelected[12] = false;selectedPlayer = null;$("#p12").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[12] = true;parsePlayerFromRow('p12');$("#p12").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[13]) {$('#p13').click(function() {resetAllSelectedPlayers();if (pSelected[13]) {pSelected[13] = false;selectedPlayer = null;$("#p13").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[13] = true;parsePlayerFromRow('p13');$("#p13").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[14]) {$('#p14').click(function() {resetAllSelectedPlayers();if (pSelected[14]) {pSelected[14] = false;selectedPlayer = null;$("#p14").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[14] = true;parsePlayerFromRow('p14');$("#p14").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[15]) {$('#p15').click(function() {resetAllSelectedPlayers();if (pSelected[15]) {pSelected[15] = false;selectedPlayer = null;$("#p15").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[15] = true;parsePlayerFromRow('p15');$("#p15").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[16]) {$('#p16').click(function() {resetAllSelectedPlayers();if (pSelected[16]) {pSelected[16] = false;selectedPlayer = null;$("#p16").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[16] = true;parsePlayerFromRow('p16');$("#p16").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[17]) {$('#p17').click(function() {resetAllSelectedPlayers();if (pSelected[17]) {pSelected[17] = false;selectedPlayer = null;$("#p17").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[17] = true;parsePlayerFromRow('p17');$("#p17").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[18]) {$('#p18').click(function() {resetAllSelectedPlayers();if (pSelected[18]) {pSelected[18] = false;selectedPlayer = null;$("#p18").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[18] = true;parsePlayerFromRow('p18');$("#p18").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[19]) {$('#p19').click(function() {resetAllSelectedPlayers();if (pSelected[19]) {pSelected[19] = false;selectedPlayer = null;$("#p19").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[19] = true;parsePlayerFromRow('p19');$("#p19").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[20]) {$('#p20').click(function() {resetAllSelectedPlayers();if (pSelected[20]) {pSelected[20] = false;selectedPlayer = null;$("#p20").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[20] = true;parsePlayerFromRow('p20');$("#p20").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[21]) {$('#p21').click(function() {resetAllSelectedPlayers();if (pSelected[21]) {pSelected[21] = false;selectedPlayer = null;$("#p21").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[21] = true;parsePlayerFromRow('p21');$("#p21").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[22]) {$('#p22').click(function() {resetAllSelectedPlayers();if (pSelected[22]) {pSelected[22] = false;selectedPlayer = null;$("#p22").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[22] = true;parsePlayerFromRow('p22');$("#p22").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[23]) {$('#p23').click(function() {resetAllSelectedPlayers();if (pSelected[23]) {pSelected[23] = false;selectedPlayer = null;$("#p23").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[23] = true;parsePlayerFromRow('p23');$("#p23").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[24]) {$('#p24').click(function() {resetAllSelectedPlayers();if (pSelected[24]) {pSelected[24] = false;selectedPlayer = null;$("#p24").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[24] = true;parsePlayerFromRow('p24');$("#p24").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[25]) {$('#p25').click(function() {resetAllSelectedPlayers();if (pSelected[25]) {pSelected[25] = false;selectedPlayer = null;$("#p25").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[25] = true;parsePlayerFromRow('p25');$("#p25").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[26]) {$('#p26').click(function() {resetAllSelectedPlayers();if (pSelected[26]) {pSelected[26] = false;selectedPlayer = null;$("#p26").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[26] = true;parsePlayerFromRow('p26');$("#p26").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[27]) {$('#p27').click(function() {resetAllSelectedPlayers();if (pSelected[27]) {pSelected[27] = false;selectedPlayer = null;$("#p27").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[27] = true;parsePlayerFromRow('p27');$("#p27").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[28]) {$('#p28').click(function() {resetAllSelectedPlayers();if (pSelected[28]) {pSelected[28] = false;selectedPlayer = null;$("#p28").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[28] = true;parsePlayerFromRow('p28');$("#p28").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[29]) {$('#p29').click(function() {resetAllSelectedPlayers();if (pSelected[29]) {pSelected[29] = false;selectedPlayer = null;$("#p29").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[29] = true;parsePlayerFromRow('p29');$("#p29").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[30]) {$('#p30').click(function() {resetAllSelectedPlayers();if (pSelected[30]) {pSelected[30] = false;selectedPlayer = null;$("#p30").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[30] = true;parsePlayerFromRow('p30');$("#p30").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[31]) {$('#p31').click(function() {resetAllSelectedPlayers();if (pSelected[31]) {pSelected[31] = false;selectedPlayer = null;$("#p31").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[31] = true;parsePlayerFromRow('p31');$("#p31").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[32]) {$('#p32').click(function() {resetAllSelectedPlayers();if (pSelected[32]) {pSelected[32] = false;selectedPlayer = null;$("#p32").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[32] = true;parsePlayerFromRow('p32');$("#p32").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[33]) {$('#p33').click(function() {resetAllSelectedPlayers();if (pSelected[33]) {pSelected[33] = false;selectedPlayer = null;$("#p33").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[33] = true;parsePlayerFromRow('p33');$("#p33").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[34]) {$('#p34').click(function() {resetAllSelectedPlayers();if (pSelected[34]) {pSelected[34] = false;selectedPlayer = null;$("#p34").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[34] = true;parsePlayerFromRow('p34');$("#p34").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[35]) {$('#p35').click(function() {resetAllSelectedPlayers();if (pSelected[35]) {pSelected[35] = false;selectedPlayer = null;$("#p35").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[35] = true;parsePlayerFromRow('p35');$("#p35").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[36]) {$('#p36').click(function() {resetAllSelectedPlayers();if (pSelected[36]) {pSelected[36] = false;selectedPlayer = null;$("#p36").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[36] = true;parsePlayerFromRow('p36');$("#p36").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[37]) {$('#p37').click(function() {resetAllSelectedPlayers();if (pSelected[37]) {pSelected[37] = false;selectedPlayer = null;$("#p37").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[37] = true;parsePlayerFromRow('p37');$("#p37").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[38]) {$('#p38').click(function() {resetAllSelectedPlayers();if (pSelected[38]) {pSelected[38] = false;selectedPlayer = null;$("#p38").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[38] = true;parsePlayerFromRow('p38');$("#p38").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[39]) {$('#p39').click(function() {resetAllSelectedPlayers();if (pSelected[39]) {pSelected[39] = false;selectedPlayer = null;$("#p39").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[39] = true;parsePlayerFromRow('p39');$("#p39").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[40]) {$('#p40').click(function() {resetAllSelectedPlayers();if (pSelected[40]) {pSelected[40] = false;selectedPlayer = null;$("#p40").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[40] = true;parsePlayerFromRow('p40');$("#p40").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[41]) {$('#p41').click(function() {resetAllSelectedPlayers();if (pSelected[41]) {pSelected[41] = false;selectedPlayer = null;$("#p41").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[41] = true;parsePlayerFromRow('p41');$("#p41").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[42]) {$('#p42').click(function() {resetAllSelectedPlayers();if (pSelected[42]) {pSelected[42] = false;selectedPlayer = null;$("#p42").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[42] = true;parsePlayerFromRow('p42');$("#p42").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[43]) {$('#p43').click(function() {resetAllSelectedPlayers();if (pSelected[43]) {pSelected[43] = false;selectedPlayer = null;$("#p43").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[43] = true;parsePlayerFromRow('p43');$("#p43").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[44]) {$('#p44').click(function() {resetAllSelectedPlayers();if (pSelected[44]) {pSelected[44] = false;selectedPlayer = null;$("#p44").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[44] = true;parsePlayerFromRow('p44');$("#p44").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[45]) {$('#p45').click(function() {resetAllSelectedPlayers();if (pSelected[45]) {pSelected[45] = false;selectedPlayer = null;$("#p45").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[45] = true;parsePlayerFromRow('p45');$("#p45").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[46]) {$('#p46').click(function() {resetAllSelectedPlayers();if (pSelected[46]) {pSelected[46] = false;selectedPlayer = null;$("#p46").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[46] = true;parsePlayerFromRow('p46');$("#p46").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[47]) {$('#p47').click(function() {resetAllSelectedPlayers();if (pSelected[47]) {pSelected[47] = false;selectedPlayer = null;$("#p47").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[47] = true;parsePlayerFromRow('p47');$("#p47").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[48]) {$('#p48').click(function() {resetAllSelectedPlayers();if (pSelected[48]) {pSelected[48] = false;selectedPlayer = null;$("#p48").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[48] = true;parsePlayerFromRow('p48');$("#p48").addClass("selectedGoldShadow");tryInsertPlayer();}});}});
    $(function() {if (pAvailable[49]) {$('#p49').click(function() {resetAllSelectedPlayers();if (pSelected[49]) {pSelected[49] = false;selectedPlayer = null;$("#p49").addClass("goldShadow");} else {resetAllSelectedStatus();pSelected[49] = true;parsePlayerFromRow('p49');$("#p49").addClass("selectedGoldShadow");tryInsertPlayer();}});}});

    $(function() {
      $('#captainButton').hover(function() {
        if (!captainIsSelected) {
          if (!scorerIsSelected) {
            $('#captainButton').addClass("selectedFire");
            $('.goals-td').addClass("selectedFire");
            $('#headGoals').addClass("selectedFire");
            $('#statGoals').addClass("selectedFire");
            $('#statGoals').html('+20 per');
          }
          if (!playmakerIsSelected) {
            $('#captainButton').addClass("selectedFire");
            $('.assists-td').addClass("selectedFire");
            $('#headAssists').addClass("selectedFire");
            $('#statAssists').addClass("selectedFire");
            $('#statAssists').html('+10 per');
          }
        }
      }, function() {
        if (!captainIsSelected) {
          if (!scorerIsSelected) {
            $('#captainButton').removeClass("selectedFire");
            $('.goals-td').removeClass("selectedFire");
            $('#headGoals').removeClass("selectedFire");
            $('#statGoals').removeClass("selectedFire");
            $('#statGoals').html('+10 per');
          }
          if (!playmakerIsSelected) {
            $('#captainButton').removeClass("selectedFire");
            $('.assists-td').removeClass("selectedFire");
            $('#headAssists').removeClass("selectedFire");
            $('#statAssists').removeClass("selectedFire");
            $('#statAssists').html('+5 per');
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
          $('#statGoals').html('+20 per');
          $('.assists-td').removeClass("fire");
          $('#headAssists').removeClass("fire");
          $('#statAssists').removeClass("fire");
          $('.assists-td').addClass("selectedFire");
          $('#headAssists').addClass("selectedFire");
          $('#statAssists').addClass("selectedFire");
          $('#statAssists').html('+10 per');
        } else {
          resetAllSelectedRoles();
          captainIsSelected = true;
          $('#captainButton').addClass("fire");
          $('.goals-td').addClass("fire");
          $('#headGoals').addClass("fire");
          $('#statGoals').addClass("fire");
          $('#statGoals').html('+20 per');
          $('.assists-td').addClass("fire");
          $('#headAssists').addClass("fire");
          $('#statAssists').addClass("fire");
          $('#statAssists').html('+10 per');
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
            $('#statGoals').html('+20 per');
          }
        }
      }, function() {
        if (!scorerIsSelected) {
          $('#scorerButton').removeClass("selectedFire");
          if (!captainIsSelected) {
            $('.goals-td').removeClass("selectedFire");
            $('#headGoals').removeClass("selectedFire");
            $('#statGoals').removeClass("selectedFire");
            $('#statGoals').html('+10 per');
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
          $('#statGoals').html('+20 per');
        } else {
          resetAllSelectedRoles();
          scorerIsSelected = true;
          $('#scorerButton').addClass("fire");
          $('.goals-td').addClass("fire");
          $('#headGoals').addClass("fire");
          $('#statGoals').addClass("fire");
          $('#statGoals').html('+20 per');
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
            $('#statAssists').html('+10 per');
          }
        }
      }, function() {
        if (!playmakerIsSelected) {
          $('#playmakerButton').removeClass("selectedFire");
          if (!captainIsSelected) {
            $('.assists-td').removeClass("selectedFire");
            $('#headAssists').removeClass("selectedFire");
            $('#statAssists').removeClass("selectedFire");
            $('#statAssists').html('+5 per');
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
          $('#statAssists').html('+10 per');
        } else {
          resetAllSelectedRoles();
          playmakerIsSelected = true;
          $('#playmakerButton').addClass("fire");
          $('.assists-td').addClass("fire");
          $('#headAssists').addClass("fire");
          $('#statAssists').addClass("fire");
          $('#statAssists').html('+10 per');
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
          $('#statShots').html('+2 per');
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
          $('#statShots').html('+2 per');
        } else {
          resetAllSelectedRoles();
          shooterIsSelected = true;
          $('#shooterButton').addClass("fire");
          $('.shots-td').addClass("fire");
          $('#headShots').addClass("fire");
          $('#statShots').addClass("fire");
          $('#statShots').html('+2 per');
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
          $('#statBlocked').html('+3 per');
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
          $('#statBlocked').html('+3 per');
        } else {
          resetAllSelectedRoles();
          blockerIsSelected = true;
          $('#blockerButton').addClass("fire");
          $('.blocked-td').addClass("fire");
          $('#headBlocked').addClass("fire");
          $('#statBlocked').addClass("fire");
          $('#statBlocked').html('+3 per');
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
          $('#statHits').html('+2 per');
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
          $('#statHits').html('+2 per');
        } else {
          resetAllSelectedRoles();
          enforcerIsSelected = true;
          $('#enforcerButton').addClass("fire");
          $('.hits-td').addClass("fire");
          $('#headHits').addClass("fire");
          $('#statHits').addClass("fire");
          $('#statHits').html('+2 per');
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
        pSelected.length = 0;
        for (var i = 0; i < 50; i++) {
            pSelected.push(false);
        }
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

  $('#statGoals').html('+10 per');
  $('#statAssists').html('+5 per');
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
  r.style.setProperty('--secondaryLight', '#5ba1d7');
  r.style.setProperty('--secondaryDark', '#286ea4');
}

function Blackhawks() {
  r.style.setProperty('--primaryLight', '#610514');
  r.style.setProperty('--primary', '#49030f');
  r.style.setProperty('--primaryDark', '#31020a');
  r.style.setProperty('--secondaryLight', '#ffda33');
  r.style.setProperty('--secondaryDark', '#cca700');
}

function BlueJackets() {
  r.style.setProperty('--primaryLight', '#002e66');
  r.style.setProperty('--primary', '#00224d');
  r.style.setProperty('--primaryDark', '#001733');
  r.style.setProperty('--secondaryLight', '#f04257');
  r.style.setProperty('--secondaryDark', '#bd0f24');
}

function Blues() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  r.style.setProperty('--secondaryLight', '#fcc136');
  r.style.setProperty('--secondaryDark', '#c98e03');
}

function Bruins() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Canadiens() {
  r.style.setProperty('--primaryLight', '#570f16');
  r.style.setProperty('--primary', '#410b11');
  r.style.setProperty('--primaryDark', '#2c070b');
  r.style.setProperty('--secondaryLight', '#5b67d7');
  r.style.setProperty('--secondaryDark', '#2834a4');
}

function Canucks() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  r.style.setProperty('--secondaryLight', '#33ff92');
  r.style.setProperty('--secondaryDark', '#00cc5f');
}

function Capitals() {
  r.style.setProperty('--primaryLight', '#5e0816');
  r.style.setProperty('--primary', '#470611');
  r.style.setProperty('--primaryDark', '#2f040b');
  r.style.setProperty('--secondaryLight', '#3e8af4');
  r.style.setProperty('--secondaryDark', '#267bf2');
}

function Coyotes() {
  r.style.setProperty('--primaryLight', '#50161e');
  r.style.setProperty('--primary', '#3c1016');
  r.style.setProperty('--primaryDark', '#280b0f');
  r.style.setProperty('--secondaryLight', '#c6ae6c');
  r.style.setProperty('--secondaryDark', '#937b39');
}

function Devils() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  r.style.setProperty('--secondaryLight', '#f04257');
  r.style.setProperty('--secondaryDark', '#bd0f24');
}

function Ducks() {
  r.style.setProperty('--primaryLight', '#612505');
  r.style.setProperty('--primary', '#491c04');
  r.style.setProperty('--primaryDark', '#301303');
  r.style.setProperty('--secondaryLight', '#c2a470');
  r.style.setProperty('--secondaryDark', '#8f713d');
}

function Flames() {
  r.style.setProperty('--primaryLight', '#66000e');
  r.style.setProperty('--primary', '#4d000a');
  r.style.setProperty('--primaryDark', '#330007');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Flyers() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  r.style.setProperty('--secondaryLight', '#fd6e35');
  r.style.setProperty('--secondaryDark', '#ca3b02');
}

function GoldenKnights() {
  r.style.setProperty('--primaryLight', '#2c373a');
  r.style.setProperty('--primary', '#21292b');
  r.style.setProperty('--primaryDark', '#161b1d');
  r.style.setProperty('--secondaryLight', '#c0a772');
  r.style.setProperty('--secondaryDark', '#8d743f');
}

function Hurricanes() {
  r.style.setProperty('--primaryLight', '#5e0812');
  r.style.setProperty('--primary', '#47060d');
  r.style.setProperty('--primaryDark', '#2f0409');
  r.style.setProperty('--secondaryLight', '#949a9e');
  r.style.setProperty('--secondaryDark', '#61676b');
}

function Islanders() {
  r.style.setProperty('--primaryLight', '#003666');
  r.style.setProperty('--primary', '#00294d');
  r.style.setProperty('--primaryDark', '#001b33');
  r.style.setProperty('--secondaryLight', '#f5873d');
  r.style.setProperty('--secondaryDark', '#c2540a');
}

function Jets() {
  r.style.setProperty('--primaryLight', '#062b60');
  r.style.setProperty('--primary', '#042148');
  r.style.setProperty('--primaryDark', '#031630');
  r.style.setProperty('--secondaryLight', '#c66c7d');
  r.style.setProperty('--secondaryDark', '#93394a');
}

function Kings() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  r.style.setProperty('--secondaryLight', '#ffffff');
  r.style.setProperty('--secondaryDark', '#aeb5b7');
}

function Kraken() {
  r.style.setProperty('--primaryLight', '#003866');
  r.style.setProperty('--primary', '#002a4d');
  r.style.setProperty('--primaryDark', '#001c33');
  r.style.setProperty('--secondaryLight', '#e4e6e7');
  r.style.setProperty('--secondaryDark', '#379595');
}

function Lightning() {
  r.style.setProperty('--primaryLight', '#002868');
  r.style.setProperty('--primary', '#001d4d');
  r.style.setProperty('--primaryDark', '#001433');
  r.style.setProperty('--secondaryLight', '#cccccc');
  r.style.setProperty('--secondaryDark', '#999999');
}

function MapleLeafs() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  r.style.setProperty('--secondaryLight', '#cccccc');
  r.style.setProperty('--secondaryDark', '#999999');
}

function Oilers() {
  r.style.setProperty('--primaryLight', '#062b60');
  r.style.setProperty('--primary', '#042148');
  r.style.setProperty('--primaryDark', '#031630');
  r.style.setProperty('--secondaryLight', '#ff7033');
  r.style.setProperty('--secondaryDark', '#cc3d00');
}

function Panthers() {
  r.style.setProperty('--primaryLight', '#5e0816');
  r.style.setProperty('--primary', '#470611');
  r.style.setProperty('--primaryDark', '#2f040b');
  r.style.setProperty('--secondaryLight', '#c2a470');
  r.style.setProperty('--secondaryDark', '#8f713d');
}

function Penguins() {
  r.style.setProperty('--primaryLight', '#333333');
  r.style.setProperty('--primary', '#262626');
  r.style.setProperty('--primaryDark', '#1a1a1a');
  r.style.setProperty('--secondaryLight', '#fcc136');
  r.style.setProperty('--secondaryDark', '#c98e03');
}

function Predators() {
  r.style.setProperty('--primaryLight', '#062b60');
  r.style.setProperty('--primary', '#042148');
  r.style.setProperty('--primaryDark', '#031630');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Rangers() {
  r.style.setProperty('--primaryLight', '#002266');
  r.style.setProperty('--primary', '#001a4d');
  r.style.setProperty('--primaryDark', '#001133');
  r.style.setProperty('--secondaryLight', '#f04257');
  r.style.setProperty('--secondaryDark', '#bd0f24');
}

function RedWings() {
  r.style.setProperty('--primaryLight', '#5e0812');
  r.style.setProperty('--primary', '#47060d');
  r.style.setProperty('--primaryDark', '#2f0409');
  r.style.setProperty('--secondaryLight', '#cccccc');
  r.style.setProperty('--secondaryDark', '#999999');
}

function Sabres() {
  r.style.setProperty('--primaryLight', '#002466');
  r.style.setProperty('--primary', '#001b4d');
  r.style.setProperty('--primaryDark', '#001233');
  r.style.setProperty('--secondaryLight', '#ffbe33');
  r.style.setProperty('--secondaryDark', '#cc8b00');
}

function Senators() {
  r.style.setProperty('--primaryLight', '#5b0b14');
  r.style.setProperty('--primary', '#44080f');
  r.style.setProperty('--primaryDark', '#2e050a');
  r.style.setProperty('--secondaryLight', '#c2a370');
  r.style.setProperty('--secondaryDark', '#8f703d');
}

function Sharks() {
  r.style.setProperty('--primaryLight', '#005f66');
  r.style.setProperty('--primary', '#00474d');
  r.style.setProperty('--primaryDark', '#003033');
  r.style.setProperty('--secondaryLight', '#ff9633');
  r.style.setProperty('--secondaryDark', '#cc6300');
}

function Stars() {
  r.style.setProperty('--primaryLight', '#006847');
  r.style.setProperty('--primary', '#004d34');
  r.style.setProperty('--primaryDark', '#003323');
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
