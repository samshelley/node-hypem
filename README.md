# Hypem NodeJS Wrapper

**Hypem Machine** (http://hypem.com) has an undocumented read-only public API.
This is a nodejs port of @JackCA's implementation of a Ruby gem of the api https://github.com/JackCA/hypem/. Note that there are some differences.

## Installation
`npm install hypem`

## Usage
For general usage:
```javascript
var Hypem = require("hypem-api");
```
The `Hypem` object has both a `Playlist` object, which can grab information about the various song lists on the hypem website, and `User` object which returns a user object

###Playlist
Playlist commands return JSON playlist data. All parameters except for `filter` are required (which defaults to `all`. As there are no cursors offered, paging can have concurrency issues.
```javascript
Hypem.playlist.popular(filter, page_number, callback(data)) //Valid arguments for filter are: all, lastweek, remix, noremix, artists, twitter`
Hypem.playlist.latest(filter, page_number, callback(data)) //Valid arguments for filter are: all, remix, noremix, us`
Hypem.playlist.artist(artist_name, page_number, callback(data))
Hypem.playlist.blog(blog_name, page_number, callback(data))
Hypem.playlist.search(search_query, page_number, callback(data))
Hypem.playlist.tags([tag_array], page_number, callback(data))
```

###User
`Hypem.user(user_name)` creates a new user object. If the username is invalid, specific user requests will return either `[]` or `null` depending on the api call.

The following requests extend the playlist object and return lists of tracks.
```javascript
Hypem.user(user_name).loved(page_number, callback(data))
Hypem.user(user_name).feed(page_number, callback(data))
Hypem.user(user_name).obsessed(page_number, callback(data))
Hypem.user(user_name).people(page_number, callback(data))
Hypem.user(user_name).people_history(page_number, callback(data))
Hypem.user(user_name).people_obsessed(page_number, callback(data))
```

Additionally, the following user specific requests are also available:
```javascript
Hypem.user(user_name).get_profile(page_number, callback(data))
Hypem.user(user_name).get_friends(page_number, callback(data))
Hypem.user(user_name).get_favorite_blogs(page_number, callback(data))
```
