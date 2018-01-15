var keys = require('./keys');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

// Get Command Line Argument
var command = process.argv[2];
var userEntry = process.argv[3];

// This handles the retrieval of Twitter info and display them
function processTweets() {
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
	  		// Display the tweet
	    	console.log(tweets[i].text);
	    	// Display when the tweet was created
	    	console.log(tweets[i].created_at + '\n');
		}
	  }
	});
}

// This handles the retrieval of track info and display them
function processSpotify(entry) {
	// Store Spotify keys as a variable
	var spotifyKeys = keys.spotifyKeys;

	// Get the user's song name entry from the command line
	// but if no argument was passed then assign the track as "The Sign"
	var track = entry || "The Sign";

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

// This handles the retrieval of movie info and display them
function processOmdbRequest(entry) {
	// Get OMDB api key
	var omdbKey = keys.omdbKey;

	// Get the user's movie name entry from the command line
	var movieName = entry || "Mr. Nobody";

	 // Run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=" + omdbKey.apiKey;

	// Make the request
	request(queryUrl, function(error, response, body) {
	  // If the request is successful
	  if (!error) {
	  	console.log("\nDisplaying movie info");

	    // Display Title of the movie.
	    console.log("Title: " + JSON.parse(body).Title + '\n');
	   	// Display Year the movie came out.
	   	console.log("Year: " + JSON.parse(body).Year + '\n');
	   	// Display IMDB Rating of the movie.
	   	console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value + '\n');
	   	// Display Rotten Tomatoes Rating of the movie.
	   	console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + '\n');
	   	// Display Country where the movie was produced.
	   	console.log("Country: " + JSON.parse(body).Country + '\n');
	   	// Display Language of the movie.
	   	console.log("Language: " + JSON.parse(body).Language + '\n');
	   	// Display Plot of the movie.
	   	console.log("Plot: " + JSON.parse(body).Plot + '\n');
	   	// Display Actors in the movie.
	   	console.log("Actors: " + JSON.parse(body).Actors);
	  }
	 });
}

// This handles the parsing of the random.txt file
function processRandom() {
	// Read from the "random.txt" file.
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // Log the error to the console.
	  if (error) {
	    return console.log(error);
	  }

	  // Then split it by commas (to make it more readable)
	  var dataArr = data.split(",");


	  // Run what is inside random.txt
	  // Twitter Command
		if(dataArr[0] === "my-tweets") {
			processTweets();
		}
		// Spotify Command
		else if(dataArr[0] === "spotify-this-song") {
			processSpotify(dataArr[1]);
		}
		// Movie Command
		else if(dataArr[0] === "movie-this") {
			processOmdbRequest(dataArr[1]);
		}
	});
}

// Twitter Command
if(command === "my-tweets") {
	processTweets();
}
// Spotify Command
else if(command === "spotify-this-song") {
	processSpotify(userEntry);
}
// Movie Command
else if(command === "movie-this") {
	processOmdbRequest(userEntry);
}
// Do What It Says Command
else if(command === "do-what-it-says") {
	processRandom();
}