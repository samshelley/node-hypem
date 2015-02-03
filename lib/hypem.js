var https = require("https");

(function() {

    function Hypem() {
        this.playlist = new Playlist();
        this.user = function(name) {
            return new User(name);
        };
    }
    function Playlist() {
        this.BASE_URL = "api.hypem.com";
        this.BASE_PATH = "/playlist";
        this.format = "json";
    }
    var PLAYLIST_GENERIC_FUNCTIONS = ["blog","search","artist"];
    PLAYLIST_GENERIC_FUNCTIONS.forEach(function(val) {
        Playlist.prototype[val] = function(filter, page, cb) {
            this.fetchData(val, filter, page, cb);
        };
    });
    Playlist.prototype.tags = function(tags, page, cb) {
        if(!(tags instanceof Array)) {
            cb(new Error("Invalid Argument Exception"));
        } else {
            this.fetchData("tags",tags.join(","), page, cb);
        }
    };
    Playlist.prototype.latest = function(filter, page, cb) {
        var filters = ["all", "remix", "noremix", "fresh", "us"];
        if(typeof filter !== "string") {
            cb = page;
            page = filter;
            filter = filters[0];
        }
        if(filters.indexOf(filter) !== -1) {
            this.fetchData("latest", filter, page, cb);
        } else {
            cb(new Error("Invalid Argument Exception"));
        }
    };

    Playlist.prototype.popular = function(filter, page, cb) {
        var filters = ["all", "lastweek", "remix", "noremix", "artists", "twitter"];
        if(typeof filter !== "string") {
            cb = page;
            page = filter;
            filter = filters[0];
        }
        if(filters.indexOf(filter) !== -1) {
            this.fetchData("popular", filter, page, cb);
        } else {
            cb(new Error("Invalid Argument Exception"));
        }
    };

    Playlist.prototype.fetchData = function(type, filter, page, cb) {
        if(typeof page !== 'number' || page < 1) {
            cb(new Error("Invalid Page Number Exception"));
        } else {
            page = typeof page !== 'undefined' ? page : 1;
            var options = {
                hostname: this.BASE_URL,
                port: 443,
                path: this.BASE_PATH+"/"+type+"/"+filter+"/"+this.format+"/"+page,
                method: "GET"
            };
            this.fetch(options, cb);
        }
    };

    Playlist.prototype.fetch = function(options, cb) {
        var req = https.request(options, function (res) {
            requestResponse = "";
            res.on("data", function(response) {
                requestResponse += response;
            });
            res.on("end", function() {
                if (res.statusCode === 404) {
                    cb(new Error("Not Found"), null);
                } else {
                    // For safety, do try-catch 
                    try {
                        cb(null, JSON.parse(requestResponse));
                    } catch (err) {
                        cb(new Error("Invalid JSON"), null);
                    }
                }
            });
        });
        req.end();
        req.on("error", function(err) {
            cb(err, null);
        });
    };

    function User(name) {
        Playlist.call(this);
        this.name = name;
    }
    User.prototype.fetch = Playlist.prototype.fetch;
    User.prototype.fetchData = Playlist.prototype.fetchData;

    var USER_GENERIC_FUNCTIONS = ["loved","feed","obsessed","people","people_history", "people_obsessed"];
    USER_GENERIC_FUNCTIONS.forEach(function(val) {
        User.prototype[val] = function(page, cb) {
            this.fetchData(val, this.name, page, cb);
        };
    });
    User.prototype.fetchUserData = function(type, cb) {
        var options = {
            hostname: this.BASE_URL,
            port: 443,
            path: "/api/"+type+"?username="+this.name,
            method: "GET"
        };
        this.fetch(options, cb);
    };

    var USER_DATA_GENERIC_FUNCTIONS = ["get_profile","get_friends", "get_favorite_blogs"];
    USER_DATA_GENERIC_FUNCTIONS.forEach(function(val) {
        User.prototype[val] = function(cb) {
            this.fetchUserData(val, cb);
        };
    });

    module.exports = new Hypem();
}).call(this);

