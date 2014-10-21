import requests
from bs4 import BeautifulSoup
import csv

domain = 'http://schlacht-um-kyoto.de/'
url = domain + 'index.php'
credentials = {'accountName': '*',
               'password': '*',
               'browserWidth': '1000',
               'login': 'Login'}

with requests.Session() as s:
    s.post(url, data=credentials)
    detailId = 1
    treshold = 2500
    csvFile = csv.writer(open('map.csv', 'w'))
    csvFile.writerow(['ID', 'Stadtname', 'Einwohner', 'Position',
                      'Spieler', 'SpielerURL', 'Klan', 'KlanURL'])
    while(detailId):
        infos = {}
        mapPage = s.get('http://schlacht-um-kyoto.de/index.php?page=Karte'
                        + '&detail=' + str(detailId))
        parsedHtml = BeautifulSoup(mapPage.text)
        tables = parsedHtml.find_all('table', class_="fullWidth")
        try:
            resources = tables[1]  # TODO: include into infos
            town = tables[2]

            townName = town.parent.parent.previous_sibling.find('td').string
            trs = town.find_all('tr')
            residents = trs[1].find_all('td')[1].string
            user = trs[2].find('a')
            userName = list(user.children)[1].replace('\xa0', '') if user else ''
            userURL = domain + user.get('href') if user else ''
            clan = trs[3].find('a')
            clanName = clan.string if clan else ''
            clanURL = domain + clan.get('href') if clan else ''
            position = trs[4].find_all('td')[1].string

            infos[detailId] = {'town': {'einwohner': residents,
                                        'position': position,
                                        'name': townName},
                               'user': {'name':  userName,
                                        'url': userURL},
                               'clan': {'name': clanName,
                                        'url': clanURL}}

            csvFile.writerow([detailId, townName, residents, position,
                              userName, infos[detailId]['user']['url'],
                              infos[detailId]['clan']['name'],
                              infos[detailId]['clan']['url']])
        except:
            print('Skipping ' + str(detailId))

        detailId += 1
        if(detailId > treshold):
            break
