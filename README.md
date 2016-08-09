# HackerNewsApi
Current Top Trending News from HackerNews

##Problem Statement:

  HackerNews (HN) is an extremely popular news aggregator site (just in case you haven’t been there, do give it a try!!!).
  The way this site functions is pretty straight-forward:
  
  * People find interesting links.
  * They post it on Hacker News.
  * Others who like the content on the linked site upvote the posting and can do the comment also.
  * There’s an algorithm which measures the “importance” of a posting based on the number of upvotes it secures, the number of comments it gets and the time that has elapsed since it was posted.
  
On a different note, “Sentiment Analysis” is an integral part of the advanced field of Natural Language Processing. In short, you can think of it as—given a statement, predict what is the underlying sentiment and what’s the likelihood (probability) of that prediction.

Your task, should you choose to accept it, is: create a web-based application which fulfills the following functions:

  1. Lists the currently top trending articles on HN.
  2. For each of the top articles, provides an additional visual aid which tells the viewer whether the article has a positive sentiment or not. To determine the sentiment, only consider the “Title” of the posting.
  3. Once fetched, the following attributes of the article should be stored, so that if the site were to be refreshed, any of the top articles already fetched won’t need to be fetched again:
    a. Username of the person who submitted the article
    b. Title of the article
    c. URL of the article
    d. Upvotes/score of the article
    e. Description for the posting
    f. The computed sentiment for that article
  4. There should also be a facility for a “search” – wherein, the search term should provide a full-text search across the titles of ONLY the articles which have been fetched and stored previously.


##Technology Used:

 **Front end:** Html, Javascript, Bootstrap
 
 **Backend:** Python 2.7, Django 1.9.8, DjangoRestFramework
 
 **Database:** MongoDB(mongoengine ORM)
 
##Application Overview:

  * A simple "topNewsApp" application that display the current top trending news from hacker news website(https://news.ycombinator.com/).
  * News title displayed as a clickable link and when user click on title then particular news link is open in new tab.
  * Included one search box, that search the query by title using full text search technique and display the searchable result in ranking order wise.
  * Home Button will navigate to home page.

##Implementation Overview:

  * Used ajax for client server communication and callback function for sequentially ajax call.
  * Used  built api from mashape for fetch the data from hacker news and for find sentiment of word.
  * There are following step that describe the implementation details.
    1. Make an ajax call to mashape api to get the all current top news id from Hacker News.
    2. Make an ajax call with newsIds as data payload to django server to filter out exsiting news id.
    3. Now iterate the left NewsIds(get in previous ajax call) and call to mashape api using callback function "allDetails" to get all the details of each news_id and another call to mashape api using callback function "getSentiment" for get the sentiment of news title.
    4. Now in previous step we have all the details of new_news_id. Now call the django "saveDetails" api to save all the details in our database.
    5. Make a call to django "DisplayNews" api that fetch all the details of top_news_id stored in database. After getting the response dynamically render the data with all top news title.
    6. When search event call through the "search_query" api. That get all search result by order of ranking (using mongodb full text search query) and render search result data in html page.

##Improvement:

*Using mashape api for getting the news item details that receive request data single news_id and return response details of that particular news_id. This is not optimised because for getting the details for list of news_id have to call the server again and again(iteratively).for this we can make own api using xpath & scrapy python library(used for scrape web page) that receive news_id as list and return details of all news_id in single call.*

