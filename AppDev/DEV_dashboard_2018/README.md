# Welcome to our Dashboard documentation !

Here is a simple documentation to use all API routes developed in this dashboard !
All of these API routes will return a success boolean and a statuscode depending on the result of the request.

# Weather
/weather route takes one parameter : city
It will return the city temperature as a message and a json with a lot of others informations.

# Twitter
/twitsearch route takes two parameters : field, number
It will return the number of last related twits based on the field.

/twituser route takes one parameters : field
It will return the followers number of the Twitter user send in field.

/twitpost route takes one parameters : field
It will post on your Twitter account the given field and return it to you.

# YouTube
/ytplaylist route takes one parameter : field
It will return the number of videos in the playlist and a link to this playlist.

/ytsub route takes one parameters : field
It will return the followers number of the YouTube channel, the amount of views on this channel and a link to the last uploaded video as a message and a json containing few more informations.

/ytsearch route takes two parameters : field, number
It will return the number of videos in relation with the field given as paramter.

# Hogwarts
/hogwarts route takes one parameter : city
It will return the city scores of the students in each family.

# About
/about.json route takes no parameter
It will return a json containing all widgets informations from this dashboard.