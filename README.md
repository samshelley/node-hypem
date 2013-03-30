# Hypem NodeJS Wrapper

This is an unofficial nodejs wrapper around the (undocumented? -- I couldn't find anything) **Hype Machine** (http://hypem.com) public API. It is a port of [@JackCA's](https://github.com/JackCA/) implementation of a [Ruby gem](https://github.com/JackCA/hypem/) of the api. Note that there are some differences.

## Installation
`npm install node-hypem`

## Usage
For general usage:
```javascript
var Hypem = require("node-hypem");
```
The `Hypem` object has both a `Playlist` object, which can grab information about the various song lists on the hypem website, and a `User` object which returns playlists specific to the provided user.

All callbacks are of the form `function(err, response)`.
###Playlist
Playlist functions return json playlist data. All parameters except for `filter` are required (which defaults to `all`). As the api does not provide cursors, paging may have concurrency issues if you don't monitor changes.
```javascript
Hypem.playlist.popular(filter, page_number, callback) //Valid arguments for filter are: all, lastweek, remix, noremix, artists, twitter
Hypem.playlist.latest(filter, page_number, callback) //Valid arguments for filter are: all, remix, noremix, us
Hypem.playlist.artist(artist_name, page_number, callback)
Hypem.playlist.blog(blog_id, page_number, callback(data)) //note that you need the blog id, not it's name
Hypem.playlist.search(search_query, page_number, callback(data))
Hypem.playlist.tags([tag_array], page_number, callback(data)) //API warns against using too many tags
```

###User
`Hypem.user(user_name)` creates a new user object. If the username is invalid, specific user requests will return either `[]` or `null` depending on the api call.

The following requests return playlists of tracks specific to the user.
```javascript
Hypem.user(user_name).loved(page_number, callback)
Hypem.user(user_name).feed(page_number, callback)
Hypem.user(user_name).obsessed(page_number, callback)
Hypem.user(user_name).people(page_number, callback)
Hypem.user(user_name).people_history(page_number, callback)
Hypem.user(user_name).people_obsessed(page_number, callback)
```

Additionally, the following user specific requests are also available:
```javascript
Hypem.user(user_name).get_profile(page_number, callback)
Hypem.user(user_name).get_friends(page_number, callback)
Hypem.user(user_name).get_favorite_blogs(page_number, callback)
```
