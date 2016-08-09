
from django.conf.urls import url, include
from django.contrib import admin
from topNewsApp import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index, name='index'),
    url(r'^hacker_news$', views.index, name='index'),
    url(r'^hacker_news/top_news/$', views.top_news, name='top_news'),
    url(r'^get_top_news_id/', views.TopNewsId.as_view()),
    url(r'^save_details/', views.SaveDetails.as_view()),
    url(r'^display_news/', views.DisplayNews.as_view()),
    url(r'^search_query/', views.SearchQuery.as_view()),
]
