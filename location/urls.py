from django.conf.urls import url
from . import views

urlpatterns = [
    # /location/
    url(r'^$', views.index, name='index'),

    # /location/71
    url(r'^(?P<location_id>[0-9]+)/$', views.detail, name='detail')
]