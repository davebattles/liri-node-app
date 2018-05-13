// Node module imports needed to run the functions
var fs = require("fs");
var request = require("request");
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
require('console-wrap')();
var liriInput = process.argv[2];
var userInput = process.argv[3];
var indent = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
var hr = "\n==============================================================\n";
var nextLine = "\n";
var redstart = "\x1b[31m";
var redend = "\x1b[0m";


console.clear();
process.stdout.write(nextLine);
process.stdout.write("\x1b[31m   ██▓     ██▓ ██▀███   ██▓\x1b[0m                         "+nextLine);
process.stdout.write("\x1b[31m  ▓██▒    ▓██▒▓██ ▒ ██▒▓██▒\x1b[0m   -t for twitter        "+nextLine);
process.stdout.write("\x1b[31m  ▒██░    ▒██▒▓██ ░▄█ ▒▒██▒\x1b[0m   -ts for twitterTrack  "+nextLine);
process.stdout.write("\x1b[31m  ▒██░    ░██░▒██▀▀█▄  ░██░\x1b[0m   -o for omdb           "+nextLine);
process.stdout.write("\x1b[31m  ░██████▒░██░░██▓ ▒██▒░██░\x1b[0m   -s for spotify        "+nextLine);
process.stdout.write("\x1b[31m  ░ ▒░▓  ░░▓  ░ ▒▓ ░▒▓░░▓  \x1b[0m   -do for manual entry  "+nextLine);
process.stdout.write("\x1b[31m  ░ ░ ▒  ░ ▒ ░  ░▒ ░ ▒░ ▒ ░\x1b[0m   -h for help           "+nextLine);
process.stdout.write("\x1b[31m    ░ ░    ▒ ░  ░░   ░  ▒ ░\x1b[0m                   "+nextLine);
process.stdout.write("\x1b[31m      ░  ░ ░     ░      ░  \x1b[0m                   "+nextLine);


switch(liriInput) {
  case "-t": myTweets(); break;
  case "-s": spotifyThisSong(); break;
  case "-o": movieThis(); break;
  case "-ts": tweetStream(); break;
  case "-do": doWhatItSays(); break;
  case "h": help(); break;
}
function help(){
  print.stdout("You dont need help");
  process.exit();
}

function noEntry() {
  console.error(" You did not make a valid query! ");
  process.exit();
}

// -s
function spotifyThisSong(){
  console.log("spotifyThisSong");
}

// -do
function doWhatItSays(){
  console.log("doWhatItSays");
}
// -t userInput
function myTweets(){
  var Twitter = require('twitter');
  var client = new Twitter(keys.twitter);	
		var text = "text";
		var params = {screen_name: userInput, count: 20};
		if(!userInput){
      noEntry();      
		}
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		  	for (var i = 0; i < tweets.length; i++) {
          var tweetNum = i+1;
		  		var time = tweets[i].created_at;
		  		var timeArr = time.split(' ');
          var output = tweetNum  + nextLine + tweets[i].text + nextLine + timeArr.slice(0,4).join('- ') + nextLine + nextLine;
		  		process.stdout.write(output);
		  		fs.appendFile("log.txt", + nextLine + output, function (error) {
		  		  if (error) throw error;
		  		  
		  		});		  		
		  	}
		  	console.log(" *** results have been logged to log.txt ***");
		  }
		});
}
// -ts
function tweetStream(){
  var Twitter = require('twitter');
  var client = new Twitter(keys.twitter);

  client.stream('statuses/filter', {track: "javascript"},  function(stream) {
    stream.on('data', function(tweet) {
      console.log(tweet.text);
    });
  
    stream.on('error', function(error) {
      console.log(error);
    });
  });
}


// -o userInput
function movieThis(){
  var movie = userInput;
  if(!movie){
    noEntry();
  }
  movieName = movie;
  request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieObject = JSON.parse(body);
      var movieResults = hr + 
      redstart + "Title: " + redend +movieObject.Title + nextLine +
      redstart + "Year: " + redend + movieObject.Year +  nextLine +
      redstart + "Country: " + redend + movieObject.Country +  nextLine +
      redstart + "Director: " + redend + movieObject.Director +  nextLine +
      redstart + "Writer: " + redend + movieObject.Writer +  nextLine +
      redstart + "Production: " + redend + movieObject.Production +  nextLine +
      redstart + "Language:" + redend + movieObject.Language + nextLine +
      redstart + "Awards:" + redend + movieObject.Awards + hr +
      redstart + "Imdb Rating: " + redend + movieObject.imdbRating+ nextLine+

      redstart +  movieObject.Ratings[0].Source+": " + redend + movieObject.Ratings[0].Value + nextLine +
      redstart +  movieObject.Ratings[1].Source+": " + redend + movieObject.Ratings[1].Value + nextLine +
      redstart +  movieObject.Ratings[2].Source+": " + redend + movieObject.Ratings[2].Value + nextLine +
      redstart + "Metascore: " + redend + movieObject.Metascore + hr +
      "Actors:" + nextLine + indent + movieObject.Actors + hr +
      "Plot: " + nextLine + indent + movieObject.Plot + nextLine + nextLine + nextLine;
      process.stdout.write(movieResults);
      fs.appendFile("log.txt", movieResults, function (error) {
        if (error) throw error;
        console.log(" *** results have been logged to log.txt ***");
      });
      // console.log(movieObject);
    } else {
      console.error("Error :"+ error);
      return;
    }
  });
}