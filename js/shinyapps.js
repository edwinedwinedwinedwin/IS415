var settings = getSettings();

function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

function getSettings() {
    var uri = window.location.pathname;
    if (uri.charAt(uri.length - 1) == '/')
        uri = uri.substr(0, uri.length - 1);
    var xhr = $.ajax({
        dataType: "json",
        url: uri + '/__settings__/',
        async: false
    });
    if (xhr.status == 200) {
        return JSON.parse(xhr.responseText)
    }
}

function showToolbar() {

}

function hideToolbar() {

}

$(document).ready(function () {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "/__static__/styles/shinyapps.css"
    }).appendTo("head");
});