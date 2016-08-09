from __future__ import unicode_literals

from django.db import models

# Create your models here.
from mongoengine import *
from HackerNews.settings import DBNAME

# connect database to mongoengine
connect(DBNAME)


class News(Document):
    news_id = LongField(required=True)
    username = StringField(required=True)
    title = StringField(required=True)
    url = StringField()
    score = IntField()
    description = StringField()
    descendants = IntField()
    confidence = FloatField()
    sentiment = StringField(required=True)
    meta = {'indexes': [
        {'fields': ['$title'],
         'default_language': 'english',
         'weights': {'title': 10}
         }
    ]}