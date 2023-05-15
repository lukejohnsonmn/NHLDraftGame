var globalGame;
var globalHomeTeamName;
var globalAwayTeamName;
var isShowingLineups = true;

class LineupManager {
  constructor(game, fullLineupCsv) {
    const lineupCsvs = fullLineupCsv.split('\n');
    this.lineups = [];
    for (var i = 0; i < lineupCsvs.length; i++) {
      this.lineups.push(new Lineup(game, lineupCsvs[i]));
    }
    this.lineups.sort((a, b) => b.score - a.score);
  }

  toHTML() {
    var leftDiv = '<div id="scoreboardLeftDiv">';
    var rightDiv = '<div id="scoreboardRightDiv">';
    for (var i = 0; i < this.lineups.length; i++) {
      if (i % 2 == 0) {
        leftDiv += this.lineups[i].toHTML();
      } else {
        rightDiv += this.lineups[i].toHTML();
      }
    }
    leftDiv += '</div>';
    rightDiv += '</div>';
    return leftDiv + rightDiv;
  }
}

class Lineup {
  constructor(game, lineupCsv) {
    const lineupInfo = lineupCsv.split('|');
    this.id = lineupInfo[0];
    this.team = lineupInfo[1];
    this.name = lineupInfo[2];
    this.players = [];
    for (var i = 3; i < lineupInfo.length; i++) {
      const playerInfo = lineupInfo[i].split(',')
      const role = playerInfo[5];
      var player = game.getPlayerById(lineupInfo[i].split(',')[0]);
      if (player == null) {
        player = new NonStartingPlayer(role, playerInfo[1], playerInfo[2], playerInfo[3]);
      }
      this.players.push(new LineupPlayer(game, player, role));

    }
    this.players.sort((a, b) => b.points - a.points);
    this.score = 0;
    for (var i = 0; i < this.players.length; i++) {
      this.score += this.players[i].points;
    }
  }

  toHTML() {
    var tableStr = '';
    tableStr += '<table class="gameLineupsTable '+this.team+'LightBorder">';
    tableStr += '<caption class="allLineupsCaption '+this.team+'Primary '+this.team+'LightBorder"><table class="gameLineupsCaptionTable"><thead><tr><th>'+this.score+'</th><th class="gameLineupsCaptionName">'+this.name.replaceAll('%20',' ')+'</th><th class="gameLineupsCaptionTeam">'+this.team.replace(/([A-Z])/g, ' $1').trim()+'</th></thead></table></caption>';
    
    tableStr += '<thead class="'+this.team+'Light">';
    tableStr += '<tr>';
    tableStr += '<th>Points</th>';
    tableStr += '<th>Role</th>';
    tableStr += '<th>Pos.</th>';
    tableStr += '<th>#</th>';
    tableStr += '<th class="lineupPlayerNameCol">Name</th>';
    tableStr += '<th>Goals</th>';
    tableStr += '<th>Assists</th>';
    tableStr += '<th>Shots</th>';
    tableStr += '<th>Blocked Shots</th>';
    tableStr += '<th>Hits</th>';
    tableStr += '<th>Faceoff Wins</th>';
    tableStr += '<th>Faceoff Losses</th>';
    tableStr += '<th>Penalty Minutes</th>';
    tableStr += '<th>Plus Minus</th>';
    tableStr += '</tr>';
    tableStr += '</thead>';

    tableStr += '<tbody class="'+this.team+'Primary">';
    for (var i = 0; i < this.players.length; i++) {
      if (i % 2 == 0) {
        tableStr += '<tr class="'+this.team+'Dark '+this.players[i].temp+'">'
      } else {
        tableStr += '<tr class="'+this.players[i].temp+'">'
      }
      tableStr += this.players[i].toHTML();
      tableStr += '</tr>'
    }
    tableStr += '<tr class="'+this.team+'Light"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
    tableStr += '</tbody>';

    tableStr += '</table>';
    return tableStr;
  }
}

class LineupPlayer {
  constructor(game, player, role) {
    this.info = player;
    this.role = role;
    this.captain = 'inactiveRole';
    this.scorer = 'inactiveRole';
    this.playmaker = 'inactiveRole';
    this.shooter = 'inactiveRole';
    this.blocker = 'inactiveRole';
    this.enforcer = 'inactiveRole';
    this.center = 'inactiveRole';

    if (role == 'Captain') {
      this.points = player.points.captain;
      this.captain = 'activeRole';
    } else if (role == 'Scorer') {
      this.points = player.points.scorer;
      this.scorer = 'activeRole';
    } else if (role == 'Playmaker') {
      this.points = player.points.playmaker;
      this.playmaker = 'activeRole';
    } else if (role == 'Shooter') {
      this.points = player.points.shooter;
      this.shooter = 'activeRole';
    } else if (role == 'Blocker') {
      this.points = player.points.blocker;
      this.blocker = 'activeRole';
    } else if (role == 'Enforcer') {
      this.points = player.points.enforcer;
      this.enforcer = 'activeRole';
    } else if (role == 'Center') {
      this.points = player.points.center;
      this.center = 'activeRole';
    } else {
      this.points = player.points.base;
    }

    if (this.points == game.hottest) {
      this.temp = 'hottest';
    } else if (this.points == game.coldest) {
      this.temp = 'coldest';
    } else if (this.points >= game.hotScore) {
      this.temp = 'hot';
    } else if (this.points <= game.coldScore) {
      this.temp = 'cold';
    } else {
      this.temp = 'normal';
    }
  }

  toHTML() {
    var tableStr = '<td>'+this.points+'</td>';
    tableStr += '<td class="alignToLeft">'+this.role+'</td>';
    tableStr += '<td>'+this.info.positionCode+'</td>';
    tableStr += '<td>'+this.info.jerseyNumber+'</td>';
    tableStr += '<td class="noWrap">'+this.info.fullName+'</td>';
    tableStr += '<td class="'+this.scorer+' '+this.captain+'">'+this.info.goals+'</td>';
    tableStr += '<td class="'+this.playmaker+' '+this.captain+'">'+this.info.assists+'</td>';
    tableStr += '<td class="'+this.shooter+'">'+this.info.shots+'</td>';
    tableStr += '<td class="'+this.blocker+'">'+this.info.blocked+'</td>';
    tableStr += '<td class="'+this.enforcer+'">'+this.info.hits+'</td>';
    tableStr += '<td class="'+this.center+'">'+this.info.faceOffWins+'</td>';
    tableStr += '<td>'+this.info.faceOffLoses+'</td>';
    tableStr += '<td>'+this.info.penaltyMinutes+'</td>';
    tableStr += '<td>'+this.info.plusMinus+'</td>';
    return tableStr;
  }
}

class NonStartingPlayer {
  constructor(role, positionCode, jerseyNumber, fullName) {
    this.role = role;
    this.positionCode = positionCode;
    this.jerseyNumber = jerseyNumber;
    this.fullName = fullName.replaceAll('%20', ' ');
    this.goals = 0;
    this.assists = 0;
    this.shots = 0;
    this.blocked = 0;
    this.hits = 0;
    this.faceOffWins = 0;
    this.faceOffLoses = 0;
    this.penaltyMinutes = 0;
    this.plusMinus = 0;
    this.points = new Points(this);
    this.penaltyMinutes = this.penaltyMinutes + ':00';
  }
}

class Player {
  constructor(playerJson) {
    this.id = playerJson.person.id;
    this.positionCode = playerJson.position.code;
    this.jerseyNumber = playerJson.jerseyNumber;
    this.fullName = playerJson.person.fullName;

    const gameStats = playerJson.stats.skaterStats;
    this.goals = gameStats.goals;
    this.assists = gameStats.assists;
    this.shots = gameStats.shots;
    this.blocked = gameStats.blocked;
    this.hits = gameStats.hits;
    this.faceOffWins = gameStats.faceOffWins;
    this.faceOffLoses = gameStats.faceoffTaken - gameStats.faceOffWins;
    this.penaltyMinutes = gameStats.penaltyMinutes;
    this.plusMinus = gameStats.plusMinus;
    this.points = new Points(this);
    this.penaltyMinutes = this.penaltyMinutes + ':00';
  }

  generateTemp() {
    if (this.points.max == globalGame.hottest) {
      return 'hottest';
    } else if (this.points.max == globalGame.maxColdest) {
      return 'coldest';
    } else if (this.points.max >= globalGame.hotScore) {
      return 'hot';
    } else if (this.points.max <= globalGame.coldScore) {
      return 'cold';
    } else {
      return 'normal';
    }
  }

  generateRoleActive(role) {
    if (this.points.bestRole == role) {
      return 'activeRole';
    } else {
      return 'inactiveRole';
    }
  }
}


class Points {
  constructor(player) {
    this.base = 10*player.goals + 5*player.assists + player.shots + player.blocked + player.hits
        + player.faceOffWins - player.faceOffLoses - 2*player.penaltyMinutes + 2*player.plusMinus;
    this.captain = this.base + 10*player.goals + 5*player.assists;
    this.scorer = this.base + 10*player.goals;
    this.playmaker = this.base + 5*player.assists;
    this.shooter = this.base + player.shots;
    this.blocker = this.base + 2*player.blocked;
    this.enforcer = this.base + player.hits;
    this.center = this.base + player.faceOffWins;
    this.max = Math.max(this.captain, this.scorer, this.playmaker, this.shooter, this.blocker, this.enforcer, this.center);
    this.bestRole = 'Captain';
    if (this.scorer == this.max) {
      this.bestRole = 'Scorer';
    } else if (this.playmaker == this.max) {
      this.bestRole = 'Playmaker';
    } else if (this.shooter == this.max) {
      this.bestRole = 'Shooter';
    } else if (this.blocker == this.max) {
      this.bestRole = 'Blocker';
    } else if (this.enforcer == this.max) {
      this.bestRole = 'Enforcer';
    } else if (this.center == this.max) {
      this.bestRole = 'Center';
    }
  }
}

class Game {
  constructor(fullLineupCsv) {
    const eitherTeam = fullLineupCsv.split('\n')[0].split('|')[1];
    const allPlayers = getAllPlayersForGameToday(eitherTeam);
    this.players = allPlayers[0];
    this.homePlayers = allPlayers[1];
    this.awayPlayers = allPlayers[2];
    this.calcColdScore();
    this.calcHotScore();
    this.lineupManager = new LineupManager(this, fullLineupCsv);
  }

  calcColdScore() {
    this.players.sort((a, b) => a.points.base - b.points.base);
    if (this.players.length == 0 || this.players[0].points.base == 0) {
      this.coldest = -1;
    } else {
      this.coldest = this.players[0].points.base;
    }
    var total = 0;
    for (var i = 0; i < this.players.length/2; i++) {
      total += this.players[i].points.base;
    }
    this.coldScore = Math.max(-1.0, 2 * total / this.players.length)
    if (this.coldScore <= 0.0) {
      this.coldScore = -1.0
    }
  }

  calcHotScore() {
    this.players.sort((a, b) => b.points.max - a.points.max);
    

    if (this.players.length == 0 || this.players[0].points.max == 0) {
      this.hottest = 1;
      this.maxColdest = -1;
    } else {
      this.hottest = this.players[0].points.max;
      this.maxColdest = this.players[this.players.length-1].points.max;
    }
    var total = 0;
    for (var i = 0; i < this.players.length/2; i++) {
      total += this.players[i].points.max;
    }
    this.hotScore = Math.max(1.0, 2 * total / this.players.length)
  }

  getPlayerById(playerId) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == playerId) {
        return this.players[i];
      }
    }
    return null;
  }
}



function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function httpGetCsv(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function loadPage() {
  console.log('loading page!');
  const lineupsUrl = "http://localhost:8080/get-lineups";
  const response = httpGetCsv(lineupsUrl);
  globalGame = new Game(response);
  if (isShowingLineups) {
    document.getElementById('scoreboardBody').innerHTML = globalGame.lineupManager.toHTML();
  } else {
    document.getElementById('scoreboardBody').innerHTML = generateHomeAndAwayHTML();
  }
}

// Update stats every 30 seconds
setInterval(function(){
  loadPage()
}, 30000)

function getAllPlayersForGameToday(eitherTeam) {
  const teamId = mapTeamNameToId(eitherTeam);
  const gamePk = getGamePkGivenTeamAndDate(teamId, getTodaysDate());
  return getAllPlayerForGamePk(gamePk);
}

function getTodaysDate() {
  const today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  var day = String(today.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function getGamePkGivenTeamAndDate(teamId, date) {
  var scheduleUrl = 'https://statsapi.web.nhl.com/api/v1/schedule?date=' + date;
  var response = httpGet(scheduleUrl);
  return extractGamePk(response, teamId);
}

function extractGamePk(jsonData, teamId) {
  if (jsonData.dates.length === 0) {
    return 0;
  }
  var games = jsonData.dates[0].games;
  for (var i = 0; i < games.length; i++) {
    if (games[i].teams.away.team.id == teamId || games[i].teams.home.team.id == teamId) {
      return games[i].gamePk;
    }
  }
  return 0;
}

function getAllPlayerForGamePk(gamePk) {
  const boxScoreUrl = 'https://statsapi.web.nhl.com/api/v1/game/' + gamePk + '/boxscore';
  const response = httpGet(boxScoreUrl);
  const homePlayersJson = response.teams.home.players;
  const awayPlayersJson = response.teams.away.players;
  globalHomeTeamName = response.teams.home.team.name;
  globalAwayTeamName = response.teams.away.team.name;

  const allPlayersList = [];
  const homeTeamPlayers = [];
  const awayTeamPlayers = [];

  for (const playerId in homePlayersJson) {
    const playerJson = homePlayersJson[playerId];
    if (['D','L','C','R'].includes(playerJson.position.code)) {
      allPlayersList.push(new Player(playerJson));
      homeTeamPlayers.push(new Player(playerJson));
    }
  }

  for (const playerId in awayPlayersJson) {
    const playerJson = awayPlayersJson[playerId];
    if (['D','L','C','R'].includes(playerJson.position.code)) {
      allPlayersList.push(new Player(playerJson));
      awayTeamPlayers.push(new Player(playerJson));
    }
  }

  homeTeamPlayers.sort((a, b) => b.points.max - a.points.max);
  awayTeamPlayers.sort((a, b) => b.points.max - a.points.max);
  return [allPlayersList, homeTeamPlayers, awayTeamPlayers];
}

function toggleTeamStats() {
  if (isShowingLineups) {
    document.getElementById('scoreboardBody').innerHTML = generateHomeAndAwayHTML();;
  } else {
    document.getElementById('scoreboardBody').innerHTML = globalGame.lineupManager.toHTML();
  }
  isShowingLineups = !isShowingLineups;
}

function mapTeamNameToId(teamName) {
    const name = teamName.toLowerCase();
    if (name == 'devils') {
        return 1;
    } else if (name == 'islanders') {
        return 2;
    } else if (name == 'rangers') {
        return 3;
    } else if (name == 'flyers') {
        return 4;
    } else if (name == 'penguins') {
        return 5;
    } else if (name == 'bruins') {
        return 6;
    } else if (name == 'sabres') {
        return 7;
    } else if (name == 'canadiens') {
        return 8;
    } else if (name == 'senators') {
        return 9;
    } else if (name == 'mapleleafs') {
        return 10;
    } else if (name == 'hurricanes') {
        return 12;
    } else if (name == 'panthers') {
        return 13;
    } else if (name == 'lightning') {
        return 14;
    } else if (name == 'capitals') {
        return 15;
    } else if (name == 'blackhawks') {
        return 16;
    } else if (name == 'redwings') {
        return 17;
    } else if (name == 'predators') {
        return 18;
    } else if (name == 'blues') {
        return 19;
    } else if (name == 'flames') {
        return 20;
    } else if (name == 'avalanche') {
        return 21;
    } else if (name == 'oilers') {
        return 22;
    } else if (name == 'canucks') {
        return 23;
    } else if (name == 'ducks') {
        return 24;
    } else if (name == 'stars') {
        return 25;
    } else if (name == 'kings') {
        return 26;
    } else if (name == 'sharks') {
        return 28;
    } else if (name == 'bluejackets') {
        return 29;
    } else if (name == 'wild') {
        return 30;
    } else if (name == 'jets') {
        return 52;
    } else if (name == 'coyotes') {
        return 53;
    } else if (name == 'goldenknights') {
        return 54;
    } else if (name == 'kraken') {
        return 55;
    }
    return 0;
}







function generateHomeAndAwayHTML() {
  var leftDiv = '<div id="scoreboardLeftDiv">';
  var rightDiv = '<div id="scoreboardRightDiv">';
  leftDiv += generateTeamHTML(globalGame.homePlayers, globalHomeTeamName);
  rightDiv += generateTeamHTML(globalGame.awayPlayers, globalAwayTeamName);
  leftDiv += '</div>';
  rightDiv += '</div>';
  return leftDiv + rightDiv;
}

function generateTeamHTML(team, teamName) {
  var tableStr = '';
  tableStr += '<table class="gameLineupsTable '+shortenTeamName(teamName)+'LightBorder">';
  tableStr += '<caption class="allLineupsCaption '+shortenTeamName(teamName)+'Primary '+shortenTeamName(teamName)+'LightBorder">'+teamName+'</caption>';
  
  tableStr += '<thead class="'+shortenTeamName(teamName)+'Light">';
  tableStr += '<tr>';
  tableStr += '<th>Points</th>';
  tableStr += '<th>Best Role</th>';
  tableStr += '<th>Pos.</th>';
  tableStr += '<th>#</th>';
  tableStr += '<th class="lineupPlayerNameCol">Name</th>';
  tableStr += '<th>Goals</th>';
  tableStr += '<th>Assists</th>';
  tableStr += '<th>Shots</th>';
  tableStr += '<th>Blocked Shots</th>';
  tableStr += '<th>Hits</th>';
  tableStr += '<th>Faceoff Wins</th>';
  tableStr += '<th>Faceoff Losses</th>';
  tableStr += '<th>Penalty Minutes</th>';
  tableStr += '<th>Plus Minus</th>';
  tableStr += '</tr>';
  tableStr += '</thead>';

  tableStr += '<tbody class="'+shortenTeamName(teamName)+'Primary">';
  for (var i = 0; i < team.length; i++) {
    if (i % 2 == 0) {
      tableStr += '<tr class="'+shortenTeamName(teamName)+'Dark '+team[i].generateTemp()+'">'
    } else {
      tableStr += '<tr class="'+team[i].generateTemp()+'">'
    }
    tableStr += generatePlayerHTML(team[i]);
    tableStr += '</tr>'
  }
  tableStr += '<tr class="'+shortenTeamName(teamName)+'Light"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
  tableStr += '</tbody>';

  tableStr += '</table>';
  return tableStr;
}

function generatePlayerHTML(player) {
  var tableStr = '<td>'+player.points.max+'</td>';
  tableStr += '<td class="alignToLeft">'+player.points.bestRole+'</td>';
  tableStr += '<td>'+player.positionCode+'</td>';
  tableStr += '<td>'+player.jerseyNumber+'</td>';
  tableStr += '<td class="noWrap">'+player.fullName+'</td>';
  tableStr += '<td class="'+player.generateRoleActive('Scorer')+' '+player.generateRoleActive('Captain')+'">'+player.goals+'</td>';
  tableStr += '<td class="'+player.generateRoleActive('Playmaker')+' '+player.generateRoleActive('Captain')+'">'+player.assists+'</td>';
  tableStr += '<td class="'+player.generateRoleActive('Shooter')+'">'+player.shots+'</td>';
  tableStr += '<td class="'+player.generateRoleActive('Blocker')+'">'+player.blocked+'</td>';
  tableStr += '<td class="'+player.generateRoleActive('Enforcer')+'">'+player.hits+'</td>';
  tableStr += '<td class="'+player.generateRoleActive('Center')+'">'+player.faceOffWins+'</td>';
  tableStr += '<td>'+player.faceOffLoses+'</td>';
  tableStr += '<td>'+player.penaltyMinutes+'</td>';
  tableStr += '<td>'+player.plusMinus+'</td>';
  return tableStr;
}

function shortenTeamName(teamName) {
  if (teamName == 'Vegas Golden Knights' || teamName == 'Toronto Maple Leafs' || teamName == 'Detroit Red Wings' || teamName == 'Columbus Blue Jackets') {
    return teamName.split(' ')[1] + teamName.split(' ')[2];
  } else if (teamName == 'Tampa Bay Lighting' || teamName == 'St. Louis Blues' || teamName == 'San Jose Sharks' || teamName == 'New York Rangers'
          || teamName == 'New York Islanders' || teamName == 'Los Angeles Kings' || teamName == 'New Jersey Devils') {
    return teamName.split(' ')[2];
  } else {
    return teamName.split(' ')[1];
  }
}