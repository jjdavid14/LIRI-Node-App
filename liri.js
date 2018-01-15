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
	  	var infoToDisplay = getTwitterInfo(tweets, params.screen_name);
	  	console.log(infoToDisplay);
	  	appendToFile(infoToDisplay);
	  }
	});
}

// Returns a string containing the info that needs to be displayed for Twitter
function getTwitterInfo(tweets, user) {
	var toReturn = "";

	toReturn += ("\nDisplaying the latest 20 Tweet of " + user);
  	for(var i = 0; i < tweets.length; i++) {
  		toReturn += ("\nTweet #" + i + 1);
  		// Display the tweet
    	toReturn += ("\n" + tweets[i].text);
    	// Display when the tweet was created
    	toReturn += ("\n" + tweets[i].created_at + '\n');
	}

   	return toReturn;
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
	  	var infoToDisplay = getSpotifyInfo(response, index);
	  	console.log(infoToDisplay);
	  	appendToFile(infoToDisplay);
	  })
	  .catch(function(err) {
	    console.log(err);
	  });
}

// Returns a string containing the info that needs to be displayed for Spotify
function getSpotifyInfo(response, index) {
	var toReturn = "";

	toReturn += ("\nDisplaying track info");

    // Display the artist
    toReturn += ("\nArtist: " + response.tracks.items[index].artists[0].name + '\n');
    // Display the song name
    toReturn += ("\nSong: " + response.tracks.items[index].name + '\n');
    // Display the preview link of the song from Spotify
    toReturn += ("\nPreview URL: " + response.tracks.items[index].preview_url + '\n');
    // Display the album of the song
    toReturn += ("\nAlbum: " + response.tracks.items[index].album.name + "\n");

   	return toReturn;
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
	  	var infoToDisplay = getOmdbRequestInfo(body);
	  	console.log(infoToDisplay);
	  	appendToFile(infoToDisplay);
	  }
	 });
}

// Returns a string containing the info that needs to be displayed for OMDB Request
function getOmdbRequestInfo(body) {
	var toReturn = "";
	toReturn += ("\nDisplaying movie info");

    // Display Title of the movie.
    toReturn += ("\nTitle: " + JSON.parse(body).Title + '\n');
   	// Display Year the movie came out.
   	toReturn += ("\nYear: " + JSON.parse(body).Year + '\n');
   	// Display IMDB Rating of the movie.
   	toReturn += ("\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value + '\n');
   	// Display Rotten Tomatoes Rating of the movie.
   	toReturn += ("\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + '\n');
   	// Display Country where the movie was produced.
   	toReturn += ("\nCountry: " + JSON.parse(body).Country + '\n');
   	// Display Language of the movie.
   	toReturn += ("\nLanguage: " + JSON.parse(body).Language + '\n');
   	// Display Plot of the movie.
   	toReturn += ("\nPlot: " + JSON.parse(body).Plot + '\n');
   	// Display Actors in the movie.
   	toReturn += ("\nActors: " + JSON.parse(body).Actors + "\n");

   	return toReturn;
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

// Appends to log.txt the text argument passed
function appendToFile(text) {
	fs.appendFile('log.txt', text, function(err) {
	  // If an error was experienced we console.log it.
	  if (err) {
	    console.log(err);
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