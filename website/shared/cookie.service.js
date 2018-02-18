(function(app) {
  app.CookieService =
  	ng.core.Class({
  		constructor: [
        function() {

          this.GetCookiesString = function() {
              return document.cookie;
          }

          this.CookieExists = function(name) {
            var cookie = this.GetCookie(name);
            if(cookie != "") {
              return true;
            }
            return false;
          }

          this.SetCookie = function(name, value, exp) {
            var d = new Date();
            d.setTime(d.getTime() + (exp*24*3600*1000));
            var expires = "expires="+d.toUTCString();
            var domain = "path=/"
            document.cookie = name + "=" + value +";" + expires+";"+domain;
          }

          this.ClearCookie = function(name) {
            document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';;
          }

          this.GetCookie = function(name) {
            var nameString = name + "=";
            var cookies = document.cookie.split(";");
            for(var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i];

              while(cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
              }
              if(cookie.indexOf(name) == 0) {
                return cookie.substring(nameString.length, cookie.length);
              }
            }
            return "";
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));