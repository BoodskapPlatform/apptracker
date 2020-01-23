"use strict";
var appID = "";
var isActive = true;
var browserName = '';
var OSName = "Unknown OS";
var userCount = 0;
var SessionID = '';
var temp = '';
var type = '';
var UserName = ''
var time = '';
var URL = 'http://192.168.1.223:4006/apptracker';

$(document).ready(function () {
    ////// checking available CDN in index.html ////////
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var urlSplit = scripts[i].src.split("?");
        if (urlSplit[0] == 'https://raw.githubusercontent.com/BoodskapPlatform/apptracker/master/apptracker.js') {
            var str = urlSplit[1].split("&");
            var id = str[0].split('=');
            time = Number(str[1].split('=')[1]);
            appID = id[1];
        }
    }

    var jqueryCDN = document.createElement('script');
    jqueryCDN.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    document.head.appendChild(jqueryCDN);
    ////set time interval dynamically
    setInterval(function () {
        $.ajax({
            url: "/ipinfo",
            contentType: "application/json",
            type: 'POST',
            success: function (result) {

                // To find navigation start time for below browser
                var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                var isFirefox = typeof InstallTrigger !== 'undefined';
                var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
                    return p.toString() === "[object SafariRemoteNotification]";
                })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
                var isIE = false || !!document.documentMode;
                var isEdge = !isIE && !!window.StyleMedia;
                var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

                if (isIE === true) {
                    browserName = "Internet Explorer"
                }
                if (isChrome) {
                    browserName = "Chrome"
                    SessionID = window.performance.timing.navigationStart
                }
                if (isEdge) {
                    browserName = "Edge"
                    SessionID = window.performance.timing.navigationStart
                }
                if (isFirefox) {
                    browserName = "Firefox"
                    SessionID = window.performance.timing.navigationStart
                }
                if (isSafari) {
                    browserName = "Safari"
                }
                if (isOpera) {
                    browserName = "Opera"
                }

                window.onfocus = function () {
                    isActive = true;
                };
                window.onblur = function () {
                    isActive = false;
                };
                result.result.href = window.location.href;
                result.result.protocol = window.location.protocol;
                result.result.host = window.location.host;
                result.result.domain = window.location.hostname;
                result.result.port = window.location.port;
                result.result.pathname = window.location.pathname;
                result.result.createdtime = new Date().getTime();
                result.result.appid = appID;
                result.result.screenresolution = screen.height + '*' + screen.width;
                result.pageactive = isActive;
                result.result.lang = document.documentElement.lang;
                result.result.IsOnline = navigator.onLine;
                result.result.userCount = userCount;
                result.result.pageduration = SessionID;
                //// Insert all result to platform
                insertRecord(data);

            }
        });
    }, time)

});

function insertRecord(data) {
    $.ajax({
        url: "/apptracker",
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: 'POST',
        success: function (result) {
            console.log('App Tracking Last Reported Time:' + new Date())
        }
    })
}
