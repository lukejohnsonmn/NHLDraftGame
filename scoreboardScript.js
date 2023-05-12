class LineupManager {
  constructor(fullLineupCsv) {
    const lineupCsvs = fullLineupCsv.split('\n');
    this.lineups = [];
    for (var i = 0; i < lineupCsvs.length; i++) {
      this.lineups.push(new Lineup(lineupCsvs[i]));
    }
  }
}

class Lineup {
  constructor(lineupCsv) {
    const lineupInfo = lineupCsv.split('|');
    this.id = lineupInfo[0];
    this.team = lineupInfo[1];
    this.name = lineupInfo[2];
    this.players = [];
    for (var i = 3; i < lineupInfo.length; i++) {
      this.players.push(this.getPlayerByTeamAndId(this.team, lineupInfo[i].split(',')[0]))
    }
  }

  getPlayerByTeamAndId(teamName, playerId) {
    return teamManager.getTeamByName(teamName).getPlayerById(playerId);
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
        + player.faceOffWins - player.faceOffLoses - 5*player.penaltyMinutes + 5*player.plusMinus;
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
  constructor(eitherTeam) {
    this.players = getAllPlayersForGameToday(eitherTeam);
    
  }
}

class Team {
  constructor(name) {
    this.name = name;
    this.generatePlayers();
    this.calcColdScore();
    this.calcHotScore();
  }

  calcColdScore() {
    this.players.sort((a, b) => a.base - b.base);
    this.coldest = this.players[0].base;
    var total = 0;
    for (var i = 0; i < 2*this.players.length/3; i++) {
      total += this.players[i].points.base;
    }
    this.coldScore = total / (2*this.players.length/3)
  }

  calcHotScore() {
    this.players.sort((a, b) => b.max - a.max);
    this.hottest = this.players[0].max;
    var total = 0;
    for (var i = 0; i < 2*this.players.length/3; i++) {
      total += this.players[i].points.max;
    }
    this.hotScore = total / (2*this.players.length/3)
  }

  getPlayerById(playerId) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == playerId) {
        return this.players[i];
      }
    }
    return this.players[0];
  }

  generatePlayers() {
    this.players = [];
    this.players.push(new Player(this.name));
  }
}

class TeamManager {
  constructor(teamNames) {
    this.teams = [];
    for (var i = 0; i < teamNames.length; i++) {
      this.teams.push(new Team(teamNames[i]));
    }
  }

  getTeamByName(teamName) {
    for (var i = 0; i < this.teams.length; i++) {
      if (this.teams[i].name == teamName) {
        return this.teams[i];
      }
    }
    return this.teams[0];
  }
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function updateStats() {
  console.log('loading player stats');
  const game = new Game('Stars');

  console.log(game.players);
  game.players.sort(function(a, b) {
    if (a.points.bestRole < b.points.bestRole) {
      return -1
    }
    if (a.points.bestRole > b.points.bestRole) {
      return 1
    }
    return 0
  })
  for (var i = 0; i < game.players.length; i++) {
    if (['Playmaker','Enforcer'].includes(game.players[i].points.bestRole)) {
      console.log(game.players[i].points.bestRole + '\t' + game.players[i].positionCode + ' ' + game.players[i].fullName);
    } else {
      console.log(game.players[i].points.bestRole + '\t\t' + game.players[i].positionCode + ' ' + game.players[i].fullName);
    }
  }
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