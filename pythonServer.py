# Python 3 server example cd OneDrive/Desktop/"HTML NHL GAME"/pythonServer
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import json
import math
import urllib.request
import os.path

hostName = "localhost"
serverPort = 8080

class MyServer(BaseHTTPRequestHandler):
    def myTest(self):
        print("do_TEST")

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        #self.wfile.write(bytes("<html><head><title>https://pythonbasics.org</title></head>", "utf-8"))
        #self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        #self.wfile.write(bytes("<body>", "utf-8"))
        #self.wfile.write(bytes("<p>This is an example web server.</p>", "utf-8"))
        #self.wfile.write(bytes("</body></html>", "utf-8"))

        if self.path == "/get-season-stats":
            paramName = 'boston'
            paramSeason = '20222023'
            paramTodaysDate = '2023-04-25'
            print('ENDPOINT: /get-season-stats: ' + paramName + ', ' + paramSeason + ', ' + paramTodaysDate)
            myResponse = writeToFile(paramName, paramSeason, paramTodaysDate)
            self.wfile.write(bytes(myResponse, encoding='utf8'))

class SalaryStats:
    def __init__(self, player):
        stats = player.perGameStats
        self.goals = 15000 * stats.goals
        self.assists = 10000 * stats.assists
        self.faceOffs = 0
        self.faceOffsCenter = 0
        if (player.positionCode == 'C'):
            self.faceOffs = 1000 * estimateBaseFaceOffPoints(player)
            self.faceOffsCenter = 1000 * estimateFaceOffPoints(player)
        self.hits = 1000 * stats.hits
        self.shots = 1000 * stats.shots
        self.blocked = 1000 * stats.blocked
        self.penalties = -5000 * stats.penaltyMinutes
        self.plusMinus = 5000 * stats.plusMinus
        self.baseSalary = self.goals + self.assists + self.faceOffs + self.hits + self.shots + self.blocked + self.penalties + self.plusMinus

class Team:
    # season: '20222023'
    def __init__(self, name, season):
        self.id = mapTeamNameToId(name)
        self.name = mapIdToTeamName(self.id)
        self.season = season
        self.stats = getSeasonStatsForTeam(self)
        self.estFaceOffsPerSecond = estimateFaceOffsPerSecond(self.stats)

class SeasonStats:
    def __init__(self, jsonStats):
        self.games = jsonStats['games']
        self.goals = jsonStats['goals']
        self.assists = jsonStats['assists']
        self.shots = jsonStats['shots']
        self.blocked = jsonStats['blocked']
        self.hits = jsonStats['hits']
        self.faceOffPct = jsonStats['faceOffPct']
        self.penaltyMinutes = jsonStats['pim']
        self.plusMinus = jsonStats['plusMinus']
        self.timeOnIce = timeStrToSeconds(jsonStats['timeOnIce'])
    
    def addPostSeasonStats(self, gameStats):
        self.games += 1
        self.goals += gameStats.goals
        self.assists += gameStats.assists
        self.shots += gameStats.shots
        self.blocked += gameStats.blocked
        self.hits += gameStats.hits
        self.faceOffPct = ((self.games-1)*self.faceOffPct + gameStats.faceOffPct) / self.games
        self.penaltyMinutes += gameStats.penaltyMinutes
        self.plusMinus += gameStats.plusMinus
        self.timeOnIce += timeStrToSeconds(gameStats.timeOnIce)

class PerGameStats:
    def __init__(self, seasonStats):
        self.games = seasonStats.games
        self.goals = round(seasonStats.goals / self.games, 2)
        self.assists = round(seasonStats.assists / self.games, 2)
        self.shots = round(seasonStats.shots / self.games, 2)
        self.blocked = round(seasonStats.blocked / self.games, 2)
        self.hits = round(seasonStats.hits / self.games, 2)
        self.faceOffPct = round(seasonStats.faceOffPct, 2)
        self.penaltyMinutes = round(seasonStats.penaltyMinutes / self.games, 2)
        self.plusMinus = round(seasonStats.plusMinus / self.games, 2)
        self.timeOnIce = secondsToTimeStr(seasonStats.timeOnIce / self.games)

class GameStats:
    def __init__(self, jsonStats):
        self.goals = jsonStats['goals']
        self.assists = jsonStats['assists']
        self.shots = jsonStats['shots']
        self.blocked = jsonStats['blocked']
        self.hits = jsonStats['hits']
        try:
            self.faceOffWins = jsonStats['faceOffWins']
        except:
            self.faceOffWins = 0
        try:
            self.faceOffTaken = jsonStats['faceoffTaken']
        except:
            self.faceOffTaken = 0
        if self.faceOffTaken == 0:
            self.faceOffPct = 0
        else:
            self.faceOffPct = jsonStats['faceOffPct']
        
        self.penaltyMinutes = jsonStats['penaltyMinutes']
        self.plusMinus = jsonStats['plusMinus']
        self.timeOnIce = jsonStats['timeOnIce']

class Player:
    def __init__(self, id, fullName, jerseyNumber, position, teamName, season):
        self.id = id
        self.fullName = fullName
        self.jerseyNumber = jerseyNumber
        self.positionCode = position['code']
        self.positionName = position['name']
        self.positionType = position['type']
        self.teamName = teamName
        self.season = season
        self.team = Team(teamName, season)
        self.startedLastGame = False

        jsonStats = getSeasonStatsForPlayer(self)
        if jsonStats != None:
            if (self.positionCode != 'G'):
                self.seasonStats = SeasonStats(jsonStats)
                self.gameStats = GameStats(jsonStats)
            else:
                self.salary = 0
        else:
            self.salary = 0
        
    def calcRemainingStats(self):
        if (self.positionCode != 'G'):
            self.perGameStats = PerGameStats(self.seasonStats)
            self.salaryStats = SalaryStats(self)
            self.salary = calcAvgSalary(self.salaryStats)
    
    def setStartedLastGame(self):
        self.startedLastGame = True
    
class Roster:
    # season '20222023', todaysDate'2023-04-13'
    def __init__(self, name, season, todaysDate):
        self.id = mapTeamNameToId(name)
        self.name = mapIdToTeamName(self.id)
        self.season = season
        self.todaysDate = todaysDate
        self.team = Team(self.name, self.season)
        self.roster = getRosterForTeam(self.id, self.name, self.season)
        addPostSeasonStatsToPlayers(self)
        getStartingLineupForLastGame(self, todaysDate)

        for player in self.roster:
            player.calcRemainingStats()

        self.roster.sort(key=lambda x: x.salary, reverse=True)
    
def getRosterForTeam(teamId, teamName, season):
    teamRosterUrl = 'https://statsapi.web.nhl.com/api/v1/teams/' + str(teamId) + '?expand=team.roster&season=' + season
    response = httpGet(teamRosterUrl)
    jsonData = json.loads(response)
    jsonRoster = jsonData['teams'][0]['roster']['roster']
    playerList = []
    for p in jsonRoster:
        pId = p['person']['id']
        pFullName = p['person']['fullName']
        pJerseyNumber = p['jerseyNumber']
        pPosition = p['position']
        playerList.append(Player(pId, pFullName, pJerseyNumber, pPosition, teamName, season))
    return playerList

def getStartingLineupForLastGame(roster, todaysDate):
    count = 100 #Stop unexpected infinite loops
    date = todaysDate
    year = date.split('-')[0]
    gamePk = 0
    teamObj = roster.team
    while gamePk == 0 and count > 0:
        count -= 1
        monthOfYear = int(date.split('-')[1])
        dayOfMonth = int(date.split('-')[2])
        dayOfMonth -= 1
        if dayOfMonth == 0:
            dayOfMonth = '31'
            monthOfYear -= 1
            if monthOfYear == 0:
                year = str(int(year) - 1)
                monthOfYear = 12
            monthOfYear = str(monthOfYear)
        else:
            if dayOfMonth < 10:
                dayOfMonth = '0' + str(dayOfMonth)
            else:
                dayOfMonth = str(dayOfMonth)
            if monthOfYear < 10:
                monthOfYear = '0' + str(monthOfYear)
            else:
                monthOfYear = str(monthOfYear)
        date = year + '-' + monthOfYear + '-' + dayOfMonth
        gamePk = getGamePkGivenTeamAndDate(teamObj, date)

    playersJson = getAllPlayerJsonsForGamePk(teamObj, gamePk)
    playerKeys = playersJson.keys()
    startersIdList = []
    for playerKey in playerKeys:
        if str(playersJson[playerKey]['stats']) != '{}':
            startersIdList.append(playersJson[playerKey]['person']['id'])
    for p in roster.roster:
        if p.id in startersIdList:
            p.setStartedLastGame()

# Get post season stats by iterating through all playoff games (after 2023-04-13)

def addPostSeasonStatsToPlayers(roster):
    gamePkList = getAllPostSeasonGamePks(roster.team, roster.todaysDate)
    for gamePk in gamePkList:
        statsToMerge = getDictOfStatsToMerge(roster, gamePk)
        for key in statsToMerge:
            for player in roster.roster:
                if key == player.id:
                    player.seasonStats.addPostSeasonStats(statsToMerge[key])
                    break

def getDictOfStatsToMerge(roster, gamePk):
    playersJson = getAllPlayerJsonsForGamePk(roster.team, gamePk)
    playerKeys = playersJson.keys()
    statsToMerge = {}
    for playerKey in playerKeys:
        if str(playersJson[playerKey]['stats']) != '{}' and playersJson[playerKey]['position']['code'] != 'G':
            playerId = playersJson[playerKey]['person']['id']
            gameStats = GameStats(playersJson[playerKey]['stats']['skaterStats'])
            statsToMerge[playerId] = gameStats
    return statsToMerge

def getAllPostSeasonGamePks(teamObj, todaysDate):
    count = 100 #Stop unexpected infinite loops
    date = todaysDate
    year = date.split('-')[0]
    endOfRegSeason = '-04-14'
    gamePkList = []
    while date != year + endOfRegSeason and count > 0:
        count -= 1
        monthOfYear = int(date.split('-')[1])
        dayOfMonth = int(date.split('-')[2])
        dayOfMonth -= 1
        if dayOfMonth == 0:
            dayOfMonth = '31'
            monthOfYear -= 1
            monthOfYear = str(monthOfYear)
        else:
            if dayOfMonth < 10:
                dayOfMonth = '0' + str(dayOfMonth)
            else:
                dayOfMonth = str(dayOfMonth)
            if monthOfYear < 10:
                monthOfYear = '0' + str(monthOfYear)
            else:
                monthOfYear = str(monthOfYear)
        date = year + '-' + monthOfYear + '-' + dayOfMonth
        gamePk = getGamePkGivenTeamAndDate(teamObj, date)
        if gamePk > 0:
            gamePkList.append(gamePk)
    return gamePkList
        

        
        


# Original calculations below here

def calcAvgSalary(salaryStats):
        captain = max(1000, math.floor(salaryStats.baseSalary + salaryStats.goals + salaryStats.assists))             # goals x2, assists x2
        scorer = max(1000, math.floor(salaryStats.baseSalary + salaryStats.goals))                                    # goals x2
        playmaker = max(1000, math.floor(salaryStats.baseSalary + salaryStats.assists))                               # assists x2
        center = max(1000, math.floor(salaryStats.baseSalary - salaryStats.faceOffs + salaryStats.faceOffsCenter))    # face off wins x2
        enforcer = max(1000, math.floor(salaryStats.baseSalary + 2 * salaryStats.hits))                               # hits x3
        shooter = max(1000, math.floor(salaryStats.baseSalary + 2 * salaryStats.shots))                               # shots x3
        blocker = max(1000, math.floor(salaryStats.baseSalary + 3 * salaryStats.blocked))                             # blocked shots x4
        if salaryStats.faceOffs == 0:
            avgSalary = captain + scorer + playmaker + enforcer + shooter + blocker
            avgSalary = math.floor(max(1000, avgSalary) / 6)
        else:
            avgSalary = captain + scorer + playmaker + center + enforcer + shooter + blocker
            avgSalary = math.floor(max(1000, avgSalary) / 7)
        return avgSalary

def estimateFaceOffPoints(player):
    stats = player.seasonStats
    team = player.team
    estFaceOffsPerGame = (stats.timeOnIce/60) / stats.games * team.estFaceOffsPerSecond
    estFaceOffWinsPerGame = 2 * (stats.faceOffPct / 100) * estFaceOffsPerGame
    estFaceOffLosesPerGame = (1 - stats.faceOffPct / 100) * estFaceOffsPerGame
    return estFaceOffWinsPerGame - estFaceOffLosesPerGame

def estimateBaseFaceOffPoints(player):
    stats = player.seasonStats
    team = player.team
    estFaceOffsPerGame = stats.timeOnIce / stats.games * team.estFaceOffsPerSecond
    estFaceOffWinsPerGame = (stats.faceOffPct / 100) * estFaceOffsPerGame
    estFaceOffLosesPerGame = (1 - stats.faceOffPct / 100) * estFaceOffsPerGame
    return estFaceOffWinsPerGame - estFaceOffLosesPerGame

# format: '12:15'
def timeStrToSeconds(timeStr):
    timeArr = timeStr.split(':')
    minutes = int(timeArr[0])
    seconds = int(timeArr[1])
    return (minutes * 60 + seconds)

def secondsToTimeStr(timeSeconds):
    timeSeconds = math.floor(timeSeconds)
    minutes = math.floor(timeSeconds / 60)
    seconds = timeSeconds % 60
    if seconds < 10:
        return str(minutes) + ':' + str(seconds) + '0'
    else:
        return str(minutes) + ':' + str(seconds)
    

def estimateFaceOffsPerSecond(teamStats):
    estGameMinutes = 64 * teamStats['ot'] + 60 * (teamStats['gamesPlayed'] - teamStats['ot'])
    return teamStats['faceOffsTaken'] / (estGameMinutes * 60)

def getSeasonStatsForTeam(team):
    teamStatsUrl = 'https://statsapi.web.nhl.com/api/v1/teams/' + str(team.id) + '?expand=team.stats&season=' + team.season
    response = httpGet(teamStatsUrl)
    jsonData = json.loads(response)
    return jsonData['teams'][0]['teamStats'][0]['splits'][0]['stat']

def getSeasonStatsForPlayer(player):
    teamStatsUrl = 'https://statsapi.web.nhl.com/api/v1/people/' + str(player.id) + '/stats?stats=statsSingleSeason&season=' + player.season
    response = httpGet(teamStatsUrl)
    jsonData = json.loads(response)
    if len(jsonData['stats'][0]['splits']) > 0:
        return jsonData['stats'][0]['splits'][0]['stat']
    else:
        return None
    
def getAllPlayerJsonsForGamePk(teamObj, gamePk):
    #get boxscores --> get player ids for team
    boxScoreUrl = 'https://statsapi.web.nhl.com/api/v1/game/' + str(gamePk) + '/boxscore'
    response = httpGet(boxScoreUrl)
    jsonData = json.loads(response)

    playersJson = jsonData['teams']['away']['players']
    if (jsonData['teams']['home']['team']['id'] == teamObj.id):
        playersJson = jsonData['teams']['home']['players']
    return playersJson

# outdated
def getAllStartingPlayerIdsForGamePk(teamObj, gamePk):
    playersJson = getAllPlayerJsonsForGamePk(teamObj, gamePk)
    playerKeys = playersJson.keys()

    #get season stats for each player id
    playerIds = []
    for playerKey in playerKeys:
        playerIds.append(playersJson[playerKey]['person']['id'])
    return playerIds

def printStuff(roster):
    teamStats = 'Name\t\t\tSalary\tgames\tgoals\tassists\tshots\tblocked\thits\tfoPct\tpim\tp/m\ticeTime\tinLineUp\tpos\n'
    for player in roster.roster:
        if player.positionCode != 'G':
            salaryStr = player.fullName + '\t'
            if len(player.fullName) < 16:
                salaryStr += '\t'
            salaryStr += str(player.salary) + '\t'
            salaryStr += str(player.perGameStats.games) + '\t'
            salaryStr += str(player.perGameStats.goals) + '\t'
            salaryStr += str(player.perGameStats.assists) + '\t'
            salaryStr += str(player.perGameStats.shots) + '\t'
            salaryStr += str(player.perGameStats.blocked) + '\t'
            salaryStr += str(player.perGameStats.hits) + '\t'
            salaryStr += str(round(player.perGameStats.faceOffPct, 2)) + '\t'
            salaryStr += str(player.perGameStats.penaltyMinutes) + '\t'
            salaryStr += str(player.perGameStats.plusMinus) + '\t'
            salaryStr += str(player.perGameStats.timeOnIce) + '\t'
            salaryStr += str(player.startedLastGame) + '\t'
            salaryStr += str(player.positionCode) + '\n'

            teamStats += salaryStr
    print(teamStats)


# date example: 2023-02-09
def getSeasonStatsForStartingLineupOnDateForTeam(teamName, date):
    # get gamePk
    season = '20222023'
    teamObj = Team(teamName, season)
    gamePk = getGamePkGivenTeamAndDate(teamObj, date)

    myText = 'My team: ' + str(teamObj.id) + ', ' + teamObj.name + ' --> My gamePk: ' + str(gamePk)
    print(myText)

    #get boxscores --> get player ids for team
    playerIds = getAllStartingPlayerIdsForGamePk(teamObj, gamePk)

    playerArr = []
    for playerId in playerIds:
        newPlayer = createNewPlayerFromId(playerId, season)
        if newPlayer.positionCode != 'G':
            playerArr.append(newPlayer)

    playerArr.sort(key=lambda x: x.salary.avgSalary)

    teamStats = 'Name\t\t\tAvg\tCaptain\tScorer\tPlaymkr\tCenter\tEnforce\tShooter\tBlocker\n'
    for player in playerArr:
        salaryStr = player.fullName + '\t'
        if len(player.fullName) < 16:
            salaryStr += '\t'
        salaryStr += str(player.salary.avgSalary) + '\t'
        salaryStr += str(player.salary.captain) + '\t'
        salaryStr += str(player.salary.scorer) + '\t'
        salaryStr += str(player.salary.playmaker) + '\t'
        salaryStr += str(player.salary.center) + '\t'
        salaryStr += str(player.salary.enforcer) + '\t'
        salaryStr += str(player.salary.shooter) + '\t'
        salaryStr += str(player.salary.blocker) + '\n'
        teamStats += salaryStr
    return teamStats

def createNewPlayerFromId(id, season):
    playerUrl = 'https://statsapi.web.nhl.com/api/v1/people/' + str(id) + '?season=' + season
    response = httpGet(playerUrl)
    jsonData = json.loads(response)
    info = jsonData['people'][0]
    fullName = info['fullName']
    jerseyNumber = info['primaryNumber']
    position = info['primaryPosition']
    teamName = info['currentTeam']['name']
    return Player(id, fullName, jerseyNumber, position, teamName, season)

def parsePlayerStats(jsonText):
    jsonData = json.loads(jsonText)
    return jsonData['stats'][0]['splits'][0]['stat']

def getGamePkGivenTeamAndDate(teamObj, date):
    scheduleUrl = 'https://statsapi.web.nhl.com/api/v1/schedule?date=' + date
    response = httpGet(scheduleUrl)
    return extractGamePk(response, teamObj)

def extractGamePk(jsonText, teamObj):
    jsonData = json.loads(jsonText)
    if len(jsonData['dates']) == 0:
        return 0
    games = jsonData['dates'][0]['games']
    for game in games:
        if (game['teams']['away']['team']['id'] == teamObj.id or game['teams']['home']['team']['id'] == teamObj.id):
            return game['gamePk']
    return 0

def httpGet(url):
    #print("Calling url: " + url)
    response = urllib.request.urlopen(url)
    return response.read()









def mapTeamNameToId(teamName):
    name = teamName.lower()
    if ('jersey' in name) or ('devils' in name):
        return 1
    elif ('york' in name) or ('islanders' in name):
        return 2
    elif ('york' in name) or ('rangers' in name):
        return 3
    elif ('philadelphia' in name) or ('flyers' in name):
        return 4
    elif ('pittsburgh' in name) or ('penguins' in name):
        return 5
    elif ('boston' in name) or ('bruins' in name):
        return 6
    elif ('buffalo' in name) or ('sabres' in name):
        return 7
    elif ('montreal' in name) or ('montréal' in name) or ('canadiens' in name):
        return 8
    elif ('ottawa' in name) or ('senators' in name):
        return 9
    elif ('toronto' in name) or ('maple leafs' in name):
        return 10
    elif ('carolina' in name) or ('hurricanes' in name):
        return 12
    elif ('florida' in name) or ('panthers' in name):
        return 13
    elif ('tampa bay' in name) or ('lightning' in name):
        return 14
    elif ('washington' in name) or ('capitals' in name):
        return 15
    elif ('chicago' in name) or ('blackhawks' in name):
        return 16
    elif ('detroit' in name) or ('red wings' in name):
        return 17
    elif ('nashville' in name) or ('predators' in name):
        return 18
    elif ('st. louis' in name) or ('blues' in name):
        return 19
    elif ('calgary' in name) or ('flames' in name):
        return 20
    elif ('colorado' in name) or ('avalanche' in name):
        return 21
    elif ('edmonton' in name) or ('oilers' in name):
        return 22
    elif ('vancouver' in name) or ('canucks' in name):
        return 23
    elif ('anaheim' in name) or ('ducks' in name):
        return 24
    elif ('dallas' in name) or ('stars' in name):
        return 25
    elif ('los angeles' in name) or ('kings' in name):
        return 26
    elif ('san jose' in name) or ('sharks' in name):
        return 28
    elif ('columbus' in name) or ('blue jackets' in name):
        return 29
    elif ('minnesota' in name) or ('wild' in name):
        return 30
    elif ('winnipeg' in name) or ('jets' in name):
        return 52
    elif ('arizona' in name) or ('coyotes' in name):
        return 53
    elif ('vegas' in name) or ('golden knights' in name):
        return 54
    elif ('seattle' in name) or ('kraken' in name):
        return 55
    return 0

def mapIdToTeamName(id):
    if (id == 1):
        return 'Jersey Devils'
    elif (id == 2):
        return 'York Islanders'
    elif (id == 3):
        return 'York Rangers'
    elif (id == 4):
        return 'Philadelphia Flyers'
    elif (id == 5):
        return 'Pittsburgh Penguins'
    elif (id == 6):
        return 'Boston Bruins'
    elif (id == 7):
        return 'Buffalo Sabres'
    elif (id == 8):
        return 'Montréal Canadiens'
    elif (id == 9):
        return 'Ottawa Senators'
    elif (id == 10):
        return 'Toronto Maple Leafs'
    elif (id == 12):
        return 'Carolina Hurricanes'
    elif (id == 13):
        return 'Florida Panthers'
    elif (id == 14):
        return 'Tampa Bay Lightning'
    elif (id == 15):
        return 'Washington Capitals'
    elif (id == 16):
        return 'Chicago Blackhawks'
    elif (id == 17):
        return 'Detroit Red Wings'
    elif (id == 18):
        return 'Nashville Predators'
    elif (id == 19):
        return 'St. Louis Blues'
    elif (id == 20):
        return 'Calgary Flames'
    elif (id == 21):
        return 'Colorado Avalanche'
    elif (id == 22):
        return 'Edmonton Oilers'
    elif (id == 23):
        return 'Vancouver Canucks'
    elif (id == 24):
        return 'Anaheim Ducks'
    elif (id == 25):
        return 'Dallas Stars'
    elif (id == 26):
        return 'Los Angeles Kings'
    elif (id == 28):
        return 'San Jose Sharks'
    elif (id == 29):
        return 'Columbus Blue Jackets'
    elif (id == 30):
        return 'Minnesota Wild'
    elif (id == 52):
        return 'Winnipeg Jets'
    elif (id == 53):
        return 'Arizona Coyotes'
    elif (id == 54):
        return 'Vegas Golden Knights'
    elif (id == 55):
        return 'Seattle Kraken'
    return 'Team not found'

def formatRosterInfo(roster):
    outputStr = ''
    for player in roster.roster:
        if player.positionCode != 'G':
            line = str(player.id) + ','
            line += str(player.fullName) + ','
            line += str(player.jerseyNumber) + ','
            line += str(player.positionCode) + ','
            line += str(player.startedLastGame) + ','
            line += str(player.salary) + ','
            line += str(player.perGameStats.games) + ','
            line += str(player.perGameStats.timeOnIce) + ','
            line += str(player.seasonStats.goals) + ','
            line += str(player.seasonStats.assists) + ','
            line += str(player.seasonStats.shots) + ','
            line += str(player.seasonStats.blocked) + ','
            line += str(player.seasonStats.hits) + ','
            line += str('{:.1f}'.format(round(player.perGameStats.faceOffPct, 1))) + ','
            line += str(secondsToTimeStr(player.seasonStats.penaltyMinutes * 60)) + ','
            line += str(player.seasonStats.plusMinus) + '|'
            outputStr += line
    return outputStr[:-1]


def writeToFile(paramName, paramSeason, paramTodaysDate):
    teamId = mapTeamNameToId(paramName)
    fileName = 'gameFiles/' + paramTodaysDate + '_' + str(teamId) + '.csv'
    if not os.path.isfile(fileName):
        myRoster = Roster(paramName, paramSeason, paramTodaysDate)
        outputStr = formatRosterInfo(myRoster)
        f = open(fileName, "a")
        f.write(outputStr)
        f.close()
        print(fileName + ' created')
        return outputStr
    else:
        print(fileName + ' already exists')
        f = open(fileName, "r")
        return f.read()



def formatRosterInfoOld(roster):
    outputStr = ''
    for player in roster.roster:
        if player.positionCode != 'G':
            line = str(player.fullName) + ','
            line += str(player.jerseyNumber) + ','
            line += str(player.positionCode) + ','
            line += str(player.startedLastGame) + ','
            line += str(player.salary) + ','
            line += str(player.perGameStats.games) + ','
            line += str(player.perGameStats.timeOnIce) + ','
            line += str('{:.2f}'.format(player.perGameStats.goals)) + ','
            line += str('{:.2f}'.format(player.perGameStats.assists)) + ','
            line += str('{:.2f}'.format(player.perGameStats.shots)) + ','
            line += str('{:.2f}'.format(player.perGameStats.blocked)) + ','
            line += str('{:.2f}'.format(player.perGameStats.hits)) + ','
            line += str('{:.2f}'.format(round(player.perGameStats.faceOffPct, 2))) + ','
            line += str('{:.2f}'.format(player.perGameStats.penaltyMinutes)) + ','
            line += str('{:.2f}'.format(player.perGameStats.plusMinus)) + '|'
            outputStr += line
    return outputStr[:-1]

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")