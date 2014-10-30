import getpass
import requests
from bs4 import BeautifulSoup
import csv
import sys
import time

username = raw_input('Account Name: ')
password = getpass.getpass('Passwort: ')

domain = 'http://schlacht-um-kyoto.de/'
url = domain + 'index.php'
credentials = {'accountName': username,
               'password': password,
               'browserWidth': '1000',
               'login': 'Login'}
headers = {'Accept': 'text/html,application/xhtml+xml,application/xml',
           'Accept-Language': 'de,en-US',
           'Accept-Encoding': 'gzip, deflate',
           'DNT': '1',
           'User-Agent': 'Mozilla/5.0'}

with requests.Session() as s:
    s.post(url, data=credentials, headers=headers)
    detailId = 1
    treshold = 2300
    csvFile = csv.writer(open('map.csv', 'w'))
    csvFile.writerow(['ID', 'Stadtname', 'Einwohner',
                      'PositionSued', 'PositionOst', 'Spieler', 'SpielerURL',
                      'Klan', 'KlanURL'])
    while(detailId):
        sys.stdout.write('\r%d from %d processed' % (detailId, treshold))
        sys.stdout.flush()
        infos = {}
        mapPage = s.get('http://schlacht-um-kyoto.de/index.php?page=Karte'
                        + '&detail=' + str(detailId))
        parsedHtml = BeautifulSoup(mapPage.text)
        tables = parsedHtml.find_all('table', class_="fullWidth")
        try:
            if len(tables) < 3:
                detailId += 1
                continue
            resources = tables[1]  # TODO: include into infos
            town = tables[2] if tables[2] else ''

            townName = town.parent.parent.previous_sibling.find('td').string
            townName = townName.replace(u'\xfc', 'ue')

            trs = town.find_all('tr')
            residents = trs[1].find_all('td')[1].string

            user = trs[2].find('a')
            if user:
                rawName = list(user.children)[1]
                userName = rawName.encode('utf-8').strip()
                userURL = domain + user.get('href')
            else:
                userName = ''
                userURL = ''

            clan = trs[3].find('a')
            if clan:
                clanName = clan.string.replace(u'\xf4', 'o')
                clanURL = domain + clan.get('href')
            else:
                clanName = ''
                clanURL = ''

            position = trs[4].find_all('td')[1].string
            koords = position.split(',')
            ost = int(koords[0].split(':')[1])
            sued = int(koords[1].split(':')[1])

            infos[detailId] = {'town': {'einwohner': residents,
                                        'position': [ost, sued],
                                        'name': townName},
                               'user': {'name':  userName,
                                        'url': userURL},
                               'clan': {'name': clanName,
                                        'url': clanURL}}

            csvFile.writerow([detailId, townName, residents, ost, sued,
                              userName, infos[detailId]['user']['url'],
                              infos[detailId]['clan']['name'],
                              infos[detailId]['clan']['url']])
        except UnicodeEncodeError as e:
            print('Skipping %d' % detailId)
            print(e)

        detailId += 1
        if(detailId > treshold):
            break
        time.sleep(1)  # seconds
