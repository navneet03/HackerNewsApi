from django.shortcuts import render
from django.http import HttpResponse
import json
import ast
import datetime
# from django.utils import simplejson
from models import News
from mongoengine import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging
log = logging.getLogger('topNewsApp')
# Create your views here.


def index(request):
    return render(request, 'index.html')


def top_news(request):
    return render(request, 'top_news.html')


class TopNewsId(APIView):
    def post(self, request):
        try:
            api_news_ids = request.data
            top_news_id_list = []
            for news_id in api_news_ids:
                row = News.objects(news_id=news_id).first()
                if not row:
                    top_news_id_list.append(news_id)
            return Response({"data": top_news_id_list, "statusCode" : 200})
        except Exception, e:
            log.debug(str(e) + " IN TopNewsIdApi ")
            return Response({"data": "failure", "statusCode" : 404})


class SaveDetails(APIView):
    def post(self, request):
        try:
            news_detail_list = request.data
            if news_detail_list:
                for news_details in news_detail_list:
                    news = News(
                        news_id=long(news_details["news_id"]),
                        username=news_details["username"],
                        title=news_details["title"],
                        url=news_details["url"] if "url" in news_details else '',
                        score=int(news_details["score"]) if "score" in news_details else 0,
                        description=news_details["description"] if "description" in news_details else '',
                        descendants=int(news_details["descendants"]) if "descendants" in news_details else 0,
                        confidence=float(news_details["confidence"]) if "confidence" in news_details else 0,
                        sentiment=news_details["sentiment"] if "sentiment" in news_details else '',
                    )
                    news.save()
                return Response({"statusCode" : 200})
            else:
                return Response({"statusCode" : 505, "message" : "wrong type of arguments : " + news_detail_list})
        except Exception, e:
            log.debug(str(e) + " IN SaveDetailsApi ")
            return Response({"statusCode" : 404, "message" : "Exception occured while saving : " + str(e)})


class DisplayNews(APIView):
    def post(self, request):
        try:
            top_news_ids = request.data
            top_news_list = []
            for news_id in top_news_ids:
                a = News.objects(news_id=news_id).first()
                if a:
                    news_details_json = {"news_id": a.news_id, "username": a.username, "title": a.title, "url": a.url,
                                          "score": a.score, "description": a.description, "descendants": a.descendants,
                                          "confidence": a.confidence, "sentiment": a.sentiment}
                    top_news_list.append(news_details_json)
            return Response({"data": top_news_list, "statusCode" : 200})
        except Exception, e:
            log.debug(str(e) + " IN DisplayNewsApi ")
            return Response({"statusCode" : 404})


class SearchQuery(APIView):
    def post(self, request):
        try:
            search_text = request.data
            search_text = search_text["search_text"]
            objects = News.objects.search_text(search_text).order_by('$text_score').all()
            search_list = []
            for obj in objects:
                tmp = {"title": obj.title, "sentiment": obj.sentiment, "url": obj.url}
                search_list.append(tmp)
            return Response({ "data": search_list, "statusCode" : 200})
        except Exception, e:
            log.debug(str(e) + " IN SearchQueryApi ")
            return Response({"statusCode" : 404})