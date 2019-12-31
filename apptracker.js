

var appID = "";
var BASE_URL = "https://apimassdta.boodskap.io";
var API_TOKEN = "RKZDQZJUWA:NpQaywSvC6ar";
var RECORD_ID = 1000;

$(document).ready(function () {

    /////////  Getting APP ID //////////////
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var urlSplit = scripts[i].src.split("?");
        if (urlSplit[0] == 'https://www.boodskapcdn.com/apptracker/js') {
            var id = urlSplit[1].split("=");
            appID = id[1];
        }
    }

    /////////  Adding CDN For User Details & Rest Call //////////////
    var jqueryCDN = document.createElement('script');
    jqueryCDN.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    document.head.appendChild(jqueryCDN);
    $.ajax({
        url: "https://ipapi.co/json?callback=UserInfo",
        contentType: "application/json",
        type: 'GET',
        success: function (result) {
            UserInfo(result)
        }
    })

});

function UserInfo(data) {
    data.href = window.location.href;
    data.protocol = window.location.protocol;
    data.host = window.location.host;
    data.hostname = window.location.hostname;
    data.port = window.location.port;
    data.pathname = window.location.pathname;
    data.createdtime = new Date().getTime();
    data.appid = appID;
    console.log(data);
    insertRecord(data)
}

function insertRecord(data) {
    $.ajax({
        url: BASE_URL + '/record/insert/dynamic/' + API_TOKEN + '/' + RECORD_ID,
        data: JSON.stringify(data),
        contentType: 'text/plain',
        type: 'POST',
        success: function (result) {
            console.log('Record inserted successfully')
        }
    })
}
