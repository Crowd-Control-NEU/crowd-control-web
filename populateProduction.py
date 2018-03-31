from datetime import datetime, date, timedelta
from urllib import request, parse
import json
import time
import random

API_ENDPOINT_LOCAL = 'http://localhost:5000/data-add'
API_ENDPOINT_PRODUCTION = 'https://infinite-peak-11670.herokuapp.com/data-add'

days = 60
date_to_send = ''
for x in range(0,days):
    date = date.today() - timedelta(days=x)
 #   print('date:', date)
    for x in range(0,96):
        time2 = datetime.time(datetime.now() - timedelta(minutes=15*x))
        date_to_send = datetime.combine(date, time2)
  #      print('date_to_send', date_to_send)
        randomCount = random.randint(-2 , 5)
        data = parse.urlencode({'count': randomCount, 'location_name': 'Marino', 'date': date_to_send}).encode()
        req =  request.Request(API_ENDPOINT_PRODUCTION, data=data) # this will make the method "POST"
        resp = request.urlopen(req)
        # Convert bytes to string type and string type to dict
        string = resp.read().decode('utf-8')
        print(string)
        time.sleep(.01)
    print('DAY:', x)    