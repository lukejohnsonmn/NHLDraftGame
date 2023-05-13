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
      const player = game.getPlayerById(lineupInfo[i].split(',')[0]);
      const role = lineupInfo[i].split(',')[5];
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
    tableStr += '<table class="allLineupsTable '+this.team+'LightBorder">';
    tableStr += '<caption class="allLineupsCaption '+this.team+'Primary '+this.team+'LightBorder"><table class="allLineupsCaptionTable"><thead><tr><th></th><th>'+this.name.replaceAll('%20',' ')+'</th><th>'+this.team.replace(/([A-Z])/g, ' $1').trim()+'</th></thead></table></caption>';
    
    tableStr += '<thead class="'+this.team+'Light">';
    tableStr += '<tr>';
    tableStr += '<th>Points</th>';
    tableStr += '<th>Role</th>';
    tableStr += '<th>Pos.</th>';
    tableStr += '<th>#</th>';
    tableStr += '<th>Name</th>';
    tableStr += '<th>Goals</th>';
    tableStr += '<th>Assists</th>';
    tableStr += '<th>Shots</th>';
    tableStr += '<th>Blocked Shots</th>';
    tableStr += '<th>Hits</th>';
    tableStr += '<th>Face Off Wins</th>';
    tableStr += '<th>Face Off Loses</th>';
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

    if (role == 'Captain') {
      this.points = player.points.captain;
    } else if (role == 'Scorer') {
      this.points = player.points.scorer;
    } else if (role == 'Playmaker') {
      this.points = player.points.playmaker;
    } else if (role == 'Shooter') {
      this.points = player.points.shooter;
    } else if (role == 'Blocker') {
      this.points = player.points.blocker;
    } else if (role == 'Enforcer') {
      this.points = player.points.enforcer;
    } else if (role == 'Center') {
      this.points = player.points.center;
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
    tableStr += '<td>'+this.role+'</td>';
    tableStr += '<td>'+this.info.positionCode+'</td>';
    tableStr += '<td>'+this.info.jerseyNumber+'</td>';
    tableStr += '<td class="noWrap">'+this.info.fullName+'</td>';
    tableStr += '<td>'+this.info.goals+'</td>';
    tableStr += '<td>'+this.info.assists+'</td>';
    tableStr += '<td>'+this.info.shots+'</td>';
    tableStr += '<td>'+this.info.blocked+'</td>';
    tableStr += '<td>'+this.info.hits+'</td>';
    tableStr += '<td>'+this.info.faceOffWins+'</td>';
    tableStr += '<td>'+this.info.faceOffLoses+'</td>';
    tableStr += '<td>'+this.info.penaltyMinutes+'</td>';
    tableStr += '<td>'+this.info.plusMinus+'</td>';
    return tableStr;
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
  }
}


class Points {
  constructor(player) {
    this.base = 15*player.goals + 10*player.assists + player.shots + player.blocked + player.hits
        + player.faceOffWins - player.faceOffLoses - 5*player.penaltyMinutes + 3*player.plusMinus;
    this.captain = this.base + 15*player.goals + 10*player.assists;
    this.scorer = this.base + 15*player.goals;
    this.playmaker = this.base + 10*player.assists;
    this.shooter = this.base + 2*player.shots;
    this.blocker = this.base + 3*player.blocked;
    this.enforcer = this.base + 2*player.hits;
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
    this.players = getAllPlayersForGameToday(eitherTeam);
    this.calcColdScore();
    this.calcHotScore();
    this.lineupManager = new LineupManager(this, fullLineupCsv);
    document.getElementById('scoreboardBody').innerHTML = this.lineupManager.toHTML();
  }

  calcColdScore() {
    this.players.sort((a, b) => a.points.base - b.points.base);
    this.coldest = this.players[0].points.base;
    var total = 0;
    for (var i = 0; i < this.players.length/2; i++) {
      total += this.players[i].points.base;
    }
    this.coldScore = Math.max(-1.0, 2 * total / this.players.length)
    if (this.coldScore == 0.0) {
      this.coldScore = -1.0
    }
  }

  calcHotScore() {
    this.players.sort((a, b) => b.points.max - a.points.max);
    this.hottest = this.players[0].points.max;
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
  console.log('loading player stats');
  const lineupsUrl = "http://localhost:8080/get-lineups";
  const response = httpGetCsv(lineupsUrl);
  console.log('response: ' + response);
  const game = new Game(response);
  console.log('hottest: ' + game.hottest);
  console.log('hotScore: ' + game.hotScore);
  console.log('coldScore: ' + game.coldScore);
  console.log('coldest: ' + game.coldest);
  console.log('done');
}

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
  //return year + '-' + month + '-' + day;
  return '2023-05-11'
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
  const awayPlayersJson = response.teams.away.players;
  const homePlayersJson = response.teams.home.players;

  const allPlayersList = [];

  for (const playerId in awayPlayersJson) {
    const playerJson = awayPlayersJson[playerId];
    if (['D','L','C','R'].includes(playerJson.position.code)) {
      allPlayersList.push(new Player(playerJson));
    }
  }

  for (const playerId in homePlayersJson) {
    const playerJson = homePlayersJson[playerId];
    if (['D','L','C','R'].includes(playerJson.position.code)) {
      allPlayersList.push(new Player(playerJson));
    }
  }
  return allPlayersList;
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