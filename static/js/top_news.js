
Init();

function Init(){
    getIdsFormHackerNews();
    filterExistingIds(idsFromHackerNews);
    getNewsDetail(newIdList);
    saveNewsDetails(newsDetailList);
    displayNews(idsFromHackerNews);
}
function getIdsFormHackerNews(){
    $.ajax({
        url : "https://community-hacker-news-v1.p.mashape.com/topstories.json?print=pretty",
        type : "GET",
        dataType: 'json',
        async: false,
        success : function(response) {
            idsFromHackerNews = JSON.stringify(response);
        },

        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "x8pwLVT6ekmshzWAy8ZyJ9SJke2Kp1X9U4OjsnmNYCIlbasCw9");
        }
    });
}


function filterExistingIds(idsFromHackerNews){
    if(idsFromHackerNews) {
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url : "/get_top_news_id/",
        type : "POST",
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: idsFromHackerNews,
        async: false,
        success : function(response) {
            response = JSON.parse(response);
            if (response.statusCode == 200){
                newIdList = response.data;
            }
            else{
                console.log("something went wrong in getNewTopNewsId Api StatusCode : " + response.statusCode );
            }
        },

        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        },
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    }
}

function getNewsDetail(newIdList) {
    newsDetailList = [];
   if (newIdList) {
    for(i=0; i<newIdList.length; i++){
        getDetails(newIdList[i]);
    }
   }

}



function getDetails(news_id){
    var data = news_id;
    $.ajax({
        url : "https://community-hacker-news-v1.p.mashape.com/item/"+news_id+".json?print=pretty",
        type : "GET",
        dataType: 'json',
        async: false,
        success : function(response) {
            getSentiment(response);
        },

        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        },
        beforeSend: function(xhr) {
           xhr.setRequestHeader("X-Mashape-Authorization", "x8pwLVT6ekmshzWAy8ZyJ9SJke2Kp1X9U4OjsnmNYCIlbasCw9");
        }
    });
}


function stripEndQuotes(s){
	var t=s.length;
	s=s.substring(1,t-1);
	return s;
}


function getSentiment(data){
    var title=data.title;
    title = stripEndQuotes(title);
    var req_data={"txt":title};
    $.ajax({
        url : "https://community-sentiment.p.mashape.com/text/",
        type : "POST",
        dataType: 'json',
        data: req_data,
        async: false,
        success : function(response) {
            var newsDetail = {"news_id":data.id, "username":data.by, "title":data.title, "url":data.url, "score":data.score,
            "description":data.type, "descendants":data.descendants, "confidence":response.result.confidence,
            "sentiment":response.result.sentiment
            }
            newsDetailList.push(newsDetail)
        },

        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "x8pwLVT6ekmshzWAy8ZyJ9SJke2Kp1X9U4OjsnmNYCIlbasCw9");
        }
    });
}


function saveNewsDetails(newsDetailList){
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url : "/save_details/",
        type : "POST",
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: JSON.stringify(newsDetailList),
        async: false,
        success : function(response) {
             response = JSON.parse(response);
             if (response.statusCode != 200){
                console.log("something went wrong in SaveDetails Api");
                console.log(response.message);
             }
        },

        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        },
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
}


function displayNews(idsFromHackerNews){
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url : "/display_news/",
        type : "POST",
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: idsFromHackerNews,
        success : function(response) {
            response = JSON.parse(response);
            if (response.statusCode == 200){
                var top_news_list = response.data;
                //Add all news title data to html tag
                var title_row=$('<tbody><tr><th>Index</th><th>Title</th><th>Sentiment</th></tr></tbody>');
                $('#top_news_title').append(title_row);
                for(var i=0; i<top_news_list.length; i++){
                    var title = top_news_list[i].title;
                    var sentiment = top_news_list[i].sentiment;
                    var url = top_news_list[i].url;
                    var data_row=$('<tbody><tr><td>'+(i+1)+'</td><td><a href="'+url+'" target="_blank">'+title+'</a></td><td>'+sentiment+'</td></tr> </tbody>');
                    $('#top_news_title').append(data_row);
                }
            }
            else{
                console.log("something went wrong in displayNews Api");
            }

        },

        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        },
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
}


function search_query(){
    var search_text =  $("#search").val();
    var csrftoken = getCookie('csrftoken');
    if(typeof(search_text) == "undefined" || search_text==null ||search_text=="")
    alert("Please Enter the Value");
    else{
        var data = {"search_text":search_text};
        data = JSON.stringify(data);
        $.ajax({
            url : "/search_query/",
            type : "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: 'text',
            data: data,
            success : function(response) {
                response = JSON.parse(response);
                if (response.statusCode == 200){
                    var search_list = response.data;
                    $("#top_news_title").empty();
                    var tmp1=$('<tbody><tr><th>Index</th><th>Title</th><th>Sentiment</th></tr></tbody>');
                    $('#top_news_title').append(tmp1);
                    for(var i=0; i < search_list.length; i++){
                        var title = search_list[i].title;
                        var sentiment = search_list[i].sentiment;
                        var url = search_list[i].url;
                        var tmp=$('<tbody><tr><td>'+(i+1)+'</td><td><a href="'+url+'" target="_blank">'+title+'</a></td><td>'+sentiment+'</td></tr> </tbody>');
                        $('#top_news_title').append(tmp);
                    }
                }
                 else{
                    console.log("something went wrong in search_query Api");
                 }
            },

            error : function(xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        });
    }
}


function home(){
    $("#top_news_title").empty();
    displayNews(idsFromHackerNews);
}


    //For getting CSRF token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
