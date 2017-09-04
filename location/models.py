from django.db import models

class Room(models.Model):
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=500)
    count = models.IntegerField(default=0)
    sensor_id = models.CharField(max_length=100)

    def __str__(self):
        return self.name
