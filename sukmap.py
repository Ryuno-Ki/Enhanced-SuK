import getpass
import requests
from bs4 import BeautifulSoup
import random
import csv
import time

# Polyfill for Python 2.7
try:
    input = raw_input
except NameError:
    pass

username = input('Account Name: ')
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
    details = range(1, 2301)
    details = random.sample(details, len(details))
    csvFile = csv.writer(open('map.csv', 'w'))
    csvFile.writerow(['ID', 'Stadtname', 'Stadttyp', 'Stadtstufe', 'Einwohner',
                      'PositionSued', 'PositionOst', 'Spieler', 'SpielerURL',
                      'Klan', 'KlanURL',
                      'Holz', 'Eisen', 'Sake', 'Nahrung', 'Performance'])
    for detailId in details:
        print(detailId)
        infos = {}
        mapPage = s.get(url + '?page=Karte' + '&detail=' + str(detailId))
        parsedHtml = BeautifulSoup(mapPage.text)
        tables = parsedHtml.find_all('table', class_="fullWidth")
        try:
            if len(tables) < 3:  # Quest village
                continue
            resources = tables[1]
            icons = resources.find_all('span')
            for icon in icons:
                ress = icon.parent.get_text().strip()
                ress = ress.replace('\t', '')
                ressPair = ress.split('\r\n')
                type = ressPair[0]
                if type == 'Holz':
                    wood = ressPair[1]
                elif type == 'Eisen':
                    iron = ressPair[1]
                elif type == 'Sake':
                    sake = ressPair[1]
                elif type == 'Nahrung':
                    food = ressPair[1]
                elif type == 'Gesamt:':
                    perf = ressPair[1]
                else:
                    print(ressPair[0])
                    print(ressPair[1])

            town = tables[2] if tables[2] else ''

            townName = town.parent.parent.previous_sibling.find('td').string
            townName = townName.replace(u'\xfc', 'ue')

            trs = town.find_all('tr')

            townTypeLevel = trs[0].find_all('td')[1].string.split()
            townType = townTypeLevel[0]
            townLevel = townTypeLevel[3]
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
                                        'name': townName,
                                        'type': townType,
                                        'level': townLevel},
                               'user': {'name':  userName,
                                        'url': userURL},
                               'clan': {'name': clanName,
                                        'url': clanURL},
                               'ressources': {'holz': wood,
                                              'eisen': iron,
                                              'sake': sake,
                                              'nahrung': food,
                                              'performance': perf}}

            csvFile.writerow([detailId, townName, townType, townLevel,
                              residents, ost, sued,
                              userName, infos[detailId]['user']['url'],
                              infos[detailId]['clan']['name'],
                              infos[detailId]['clan']['url'],
                              wood, iron, sake, food, perf])
        except UnicodeEncodeError as e:
            print('Skipping %d' % detailId)
            print(e)

        time.sleep(1)  # seconds
