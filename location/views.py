from django.shortcuts import render
from django.http import HttpResponse
from .models import Room


def index(request):

    all_rooms = Room.objects.all()
    html = '<h3>Click a room below to see details</h3>'

    for room in all_rooms:
        url = '/location/' + str(room.id) + '/'
        html += '<a href="' + url + '">' + room.name + '</a><br>'

    return HttpResponse(html)

def detail(request, location_id):
    room = Room.objects.get(id=location_id)

    html = ''
    name = '<h1>Room: ' + room.name + '</h2>'
    description = '<h3>Description: ' + room.description + '</h3>'
    count = '<h3>Current People Count: ' + str(room.count) + '</h3>'
    sensor_id = '<h3>Sensor being used: ' + room.sensor_id + '</h3>'
    html += name + description + count + sensor_id

    return HttpResponse(html);