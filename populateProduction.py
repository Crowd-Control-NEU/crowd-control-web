from datetime import datetime, date, timedelta, time
from urllib import request, parse
import json
import time as t
import random

API_ENDPOINT_LOCAL = 'http://localhost:5000/data-add'
API_ENDPOINT_PRODUCTION = 'https://infinite-peak-11670.herokuapp.com/data-add'

API_TO_USE = API_ENDPOINT_LOCAL
location = 'Subway'

days = 60
date_to_send = ''
for x in range(0,days):
    date = date.today() - timedelta(days=x)
    min_pub_date_time = datetime.combine(date, time.min) 
    
    count_for_day = 0
    for z in range(0,96):
        time = datetime.time(min_pub_date_time + timedelta(minutes=15*z))
        date_to_send = datetime.combine(min_pub_date_time, time)

        randomCount = 0
        hour = date_to_send.hour
        if hour >= 0 and hour < 7:
            randomCount = 0
        elif hour >= 7 and hour < 8: 
            randomCount = random.randint(0 , 5)
            count_for_day += randomCount
        elif hour >= 8 and hour < 11:
            if count_for_day < 30:
                randomCount = random.randint(0 , 7)
            else:
                randomCount = random.randint(-7 , 7)
            count_for_day += randomCount 
        elif hour >= 11 and hour < 14:
            if count_for_day < 75:
                randomCount = random.randint(0 , 7)
            else:
                randomCount = random.randint(-7 , 7)
            count_for_day += randomCount
        elif hour >= 14 and hour < 15:
            if count_for_day == 1:
                randomCount = -1
            else:
                randomCount = int(-1 * count_for_day/10)
            count_for_day += randomCount 
        elif hour >= 15 and hour < 16:
            if count_for_day == 1:
                randomCount = -1
            else:
                randomCount = int(-1 * count_for_day/2)
            count_for_day += randomCount 
        elif hour >= 16 and hour < 24:
            if count_for_day == 1:
                randomCount = -1
            else:
                randomCount = int(-1 * count_for_day/2)
            count_for_day += randomCount 

 #       print('Hour: %s    randomCount: %s,   count_for_day: %s' % (hour, randomCount, count_for_day))
        data = parse.urlencode({'count': randomCount, 'location_name': location, 'date': date_to_send}).encode()
        req =  request.Request(API_TO_USE, data=data) # this will make the method "POST"
        resp = request.urlopen(req)
        # Convert bytes to string type and string type to dict
        string = resp.read().decode('utf-8')
        print(string)
        t.sleep(.0001)
    print('DAY:', x)    


