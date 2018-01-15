var keys = require('./keys');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

// Get Command Line Argument
var command = process.argv[2];

// Twitter Command
if(command === "my-tweets") {
	// Store Twitter keys as a variable
	var twitterKeys = keys.twitterKeys;

	// User authentication
	var client = new Twitter({
	  consumer_key: twitterKeys.consumer_key,
	  consumer_secret: twitterKeys.consumer_secret,
	  access_token_key: twitterKeys.access_token_key,
	  access_token_secret: twitterKeys.access_token_secret
	});

	// Set screen name
	var params = {
		screen_name: 'EimajDivad'
	};

	// GET tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("\nDisplaying the latest 20 Tweet of " + params.screen_name);
	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("Tweet #" + i + 1);
	    	console.log(tweets[i].text);
	    	console.log(tweets[i].created_at + '\n');
		}
	  }
	});
}
// Spotify Command
else if(command === "spotify-this-song") {
	// Store Spotify keys as a variable
	var spotifyKeys = keys.spotifyKeys;

	// Get the user's song name entry from the command line
	// but if no argument was passed then assign the track as "The Sign"
	var track = process.argv[3] || "The Sign";

	// index will be 7 if no argument is passed because "The Sign by Ace of Base"
	// is the 8th item returned by Spotify API else we just return
	// the first item which is 0
	var index = (track === "The Sign") ? 7 : 0;

	// User authentication
	var spotify = new Spotify({
	  id: spotifyKeys.client_id,
	  secret: spotifyKeys.client_secret
	});

	// Make a request to API
	spotify.search({ 
	  	type: 'track', 
	  	query: track 
	  })
	  .then(function(response) {
	  	console.log("\nDisplaying track info");

	    // Display the artist
	    console.log("Artist: " + response.tracks.items[index].artists[0].name + '\n');
	    // Display the song name
	    console.log("Song: " + response.tracks.items[index].name + '\n');
	    // Display the preview link of the song from Spotify
	    console.log("Preview URL: " + response.tracks.items[index].preview_url + '\n');
	    // Display the album of the song
	    console.log("Album: " + response.tracks.items[index].album.name);
	  })
	  .catch(function(err) {
	    console.log(err);
	  });
}
// Movie Command
else if(command === "movie-this") {

}
// Do What It Says Command
else if(command === "do-what-it-says") {

}