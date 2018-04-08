from datetime import datetime, date, timedelta, time
from urllib import request, parse
import json
import time as t
import random

API_ENDPOINT_LOCAL = 'http://localhost:5000/data-add'
API_ENDPOINT_PRODUCTION = 'https://infinite-peak-11670.herokuapp.com/data-add'

API_TO_USE = API_ENDPOINT_LOCAL
location = 'Subway'

days = 1000
date_to_send = ''
for x in range(60,days):
    date = date.today() - timedelta(days=x)
    min_pub_date_time = datetime.combine(date, time.min) 
    time = datetime.time(min_pub_date_time + timedelta(minutes=15))
    date_to_send = datetime.combine(min_pub_date_time, time)

    randomCount = random.randint(5 , 20)

    data = parse.urlencode({'count': randomCount, 'location_name': location, 'date': date_to_send}).encode()
    req =  request.Request(API_TO_USE, data=data) # this will make the method "POST"
    resp = request.urlopen(req)
    # Convert bytes to string type and string type to dict
    string = resp.read().decode('utf-8')
    print(string)
    t.sleep(.0001)

 #   data = parse.urlencode({'count': randomCount*-1, 'location_name': location, 'date': date_to_send}).encode()
 #   req =  request.Request(API_TO_USE, data=data) # this will make the method "POST"
 #   resp = request.urlopen(req)
    # Convert bytes to string type and string type to dict
 #   string = resp.read().decode('utf-8')
 #   print(string)
 #   t.sleep(.0001)

    print('DAY:', x)    