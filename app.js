// Node module imports needed to run the functions
var fs = require("fs");
var request = require("request");
var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
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
process.stdout.write("\x1b[31m   ██▓     ██▓ ██▀███   ██▓\x1b[0m                         " + nextLine);
process.stdout.write("\x1b[31m  ▓██▒    ▓██▒▓██ ▒ ██▒▓██▒\x1b[0m   -t for twitter user search       " + nextLine);
process.stdout.write("\x1b[31m  ▒██░    ▒██▒▓██ ░▄█ ▒▒██▒\x1b[0m   -ts for twitter tag streaming " + nextLine);
process.stdout.write("\x1b[31m  ▒██░    ░██░▒██▀▀█▄  ░██░\x1b[0m   -tp to tweet  " + nextLine);
process.stdout.write("\x1b[31m  ░██████▒░██░░██▓ ▒██▒░██░\x1b[0m   -s for spotify        " + nextLine);
process.stdout.write("\x1b[31m  ░ ▒░▓  ░░▓  ░ ▒▓ ░▒▓░░▓  \x1b[0m   -o for omdb           " + nextLine);
process.stdout.write("\x1b[31m  ░ ░ ▒  ░ ▒ ░  ░▒ ░ ▒░ ▒ ░\x1b[0m   -do for manual entry  " + nextLine);
process.stdout.write("\x1b[31m    ░ ░    ▒ ░  ░░   ░  ▒ ░\x1b[0m   -h for help           " + nextLine);
process.stdout.write("\x1b[31m      ░  ░ ░     ░      ░  \x1b[0m                         " + nextLine);


switch (liriInput) {
  case "-t":
    myTweets();
    break;
  case "-tp":
    tweetPost();
    break;
  case "-s":
    spotifyThisSong();
    break;
  case "-o":
    movieThis();
    break;
  case "-ts":
    tweetStream();
    break;
  case "-do":
    doWhatItSays();
    break;
  case "-h":
    help();
    break;
}

function help() {
  console.clear();
  process.stdout.write(nextLine);
  process.stdout.write(redstart + " ██░ ██ ▓█████  ██▓     ██▓███  " + redend + nextLine);
  process.stdout.write(redstart + "▓██░ ██▒▓█   ▀ ▓██▒    ▓██░  ██▒" + redend + nextLine);
  process.stdout.write(redstart + "▒██▀▀██░▒███   ▒██░    ▓██░ ██▓▒" + redend + nextLine);
  process.stdout.write(redstart + "░▓█ ░██ ▒▓█  ▄ ▒██░    ▒██▄█▓▒ ▒" + redend + nextLine);
  process.stdout.write(redstart + "░▓█▒░██▓░▒████▒░██████▒▒██▒ ░  ░" + redend + nextLine);
  process.stdout.write(redstart + " ▒ ░░▒░▒░░ ▒░ ░░ ▒░▓  ░▒▓▒░ ░  ░" + redend + nextLine);
  process.stdout.write(redstart + " ▒ ░▒░ ░ ░ ░  ░░ ░ ▒  ░░▒ ░     " + redend + nextLine);
  process.stdout.write(redstart + " ░  ░░ ░   ░     ░ ░   ░░       " + redend + nextLine);
  process.stdout.write(redstart + " ░  ░  ░   ░  ░    ░  ░         " + redend + nextLine);
  process.stdout.write(redstart + "                                " + redend + nextLine);
  process.stdout.write(redstart + "Liri" + redend + " assists you with Twitter, Spotify, and Omdb Movie Lookup" + nextLine);
  process.stdout.write(redstart + "Liri" + redend + " takes an operator and an argument during execution" + nextLine);
  process.stdout.write("i.e: node app.js -tp 'This is a test'" + nextLine);
  process.stdout.write("The example above will post This is a test  without quotations to the twitter account linked in your .env file" + nextLine);
  process.exit();

}

function noEntry() {
  console.error(" You did not make a valid query! ");
  process.exit();
}

// -s
function spotifyThisSong() {
  var spotify = new Spotify(keys.spotify);
  var fullSong = "";
  var fullArtists = "";
  for (i = 3; i < process.argv.length; i++) {
    fullSong = fullSong + " " + process.argv[i];
  }
  if (!userInput) {
    noEntry();
  }
  if (doQuery == true){
    fullSong = userInput;
  }
  spotify.search({
    type: "track",
    query: fullSong
  }, function (err, data) {
    if (err) {
      console.log(err);
    }
    var songs = data.tracks.items;

    // Finds the full list of artists and formats them
    // removing the comma if theyre the last artist
    // The rest is the format for the results
    // for (var i = 0; i < songs.length; i++) {    reduced amount of results
    var artistLog = [];
    for (var i = 0; i < 1; i++) {

      if (songs[i].artists.length != 1) {
        for (var a = 0; a < songs[i].artists.length; a++) {
          if (a == songs[i].artists.length - 1) {
            fullArtists = fullArtists + songs[i].artists[a].name;
          } else {
            fullArtists = fullArtists + songs[i].artists[a].name + ", ";
          }
        }
      } else {
        fullArtists = songs[i].artists[0].name;
      }
      process.stdout.write(hr + nextLine + redstart + "Artist(s): " + redend + fullArtists);
      process.stdout.write(nextLine + redstart + "album: " + redend + songs[i].album.name);
      process.stdout.write(nextLine + redstart + "title: " + redend + songs[i].name);
      if (songs[i].preview_url !== null) {
        process.stdout.write(nextLine + redstart + "url: " + redend + songs[i].preview_url + nextLine);
      }
      artistLog = {
        Artist: fullArtists,
        Album: songs[i].album.name,
        Title: songs[i].name,
        URL: songs[i].preview_url
      };




    }
    fs.appendFile("log.txt", hr + nextLine + "  Artist: " + fullArtists + "  Album: " + artistLog.Album + "  Title: " + artistLog.Title + "  URL: " + artistLog.URL + nextLine + hr, function (error) {
      if (error) throw error;
      console.log(" *** results have been logged to log.txt ***");
    });
    process.stdout.write(hr + nextLine);


  });

}

function tweetPost() {
  var Twitter = require('twitter');
  var client = new Twitter(keys.twitter);
  var fullTweet = "";
  for (i = 3; i < process.argv.length; i++) {
    fullTweet = fullTweet + " " + process.argv[i];
  }

  var params = {
    status: fullTweet
  };
  if (!userInput) {
    noEntry();
  }

  client.post('statuses/update', params, function (error, tweet, response) {
    if (!error) {

      process.stdout.write("You tweeted: " + fullTweet + nextLine + nextLine);
    }
  });
}
// -do
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) throw error;
    var fileInput = "";
    var cmd = data.split(" ", 1);
    data = data.replace(cmd, "");
    fileInput = data.replace('"', "");
    fileInput = fileInput.replace('"', "");
    switch (cmd[0]) {
      case "-t":
        userInput = fileInput;
        myTweets();
        break;
      case "-tp":
        userInput = fileInput;
        tweetPost();
        break;
      case "-s":
        userInput = fileInput;
        doQuery = true;
        spotifyThisSong();
        break;
      case "-o":
        userInput = fileInput;
        movieThis();
        break;
      case "-ts":
        userInput = fileInput;
        tweetStream();
        break;
      case "-do":
        userInput = fileInput;
        doWhatItSays();
        break;
      case "-h":
        userInput = fileInput;
        help();
        break;
    }


  });
}
// -t userInput
function myTweets() {
  var Twitter = require('twitter');
  var client = new Twitter(keys.twitter);
  var text = "text";
  var params = {
    screen_name: userInput,
    count: 20
  };
  if (!userInput) {
    noEntry();
  }
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var tweetNum = i + 1;
        var time = tweets[i].created_at;
        var timeArr = time.split(' ');
        var output = tweetNum + nextLine + tweets[i].text + nextLine + timeArr.slice(0, 4).join('- ') + nextLine + nextLine;
        process.stdout.write(output);
        fs.appendFile("log.txt", +nextLine + output, function (error) {
          if (error) throw error;

        });
      }
      console.log(" *** results have been logged to log.txt ***");
    }
  });
}
// -ts
function tweetStream() {
  var Twitter = require('twitter');
  var client = new Twitter(keys.twitter);

  var fullTweet = "";
  for (i = 3; i < process.argv.length; i++) {
    fullTweet = fullTweet + " " + process.argv[i];
  }
  var params = {
    track: fullTweet
  };
  client.stream('statuses/filter', params, function (stream) {
    stream.on('data', function (tweet) {
      console.log(tweet.text);
    });

    stream.on('error', function (error) {
      console.log(error);
    });
  });
}


// -o userInput
function movieThis() {
  var movie = userInput;
  if (!movie) {
    noEntry();
  }
  movieName = movie;
  request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieObject = JSON.parse(body);
      var movieResults = hr +
        redstart + "Title: " + redend + movieObject.Title + nextLine +
        redstart + "Year: " + redend + movieObject.Year + nextLine +
        redstart + "Country: " + redend + movieObject.Country + nextLine +
        redstart + "Director: " + redend + movieObject.Director + nextLine +
        redstart + "Writer: " + redend + movieObject.Writer + nextLine +
        redstart + "Production: " + redend + movieObject.Production + nextLine +
        redstart + "Language:" + redend + movieObject.Language + nextLine +
        redstart + "Awards:" + redend + movieObject.Awards + hr +
        redstart + "Imdb Rating: " + redend + movieObject.imdbRating + nextLine +

        redstart + movieObject.Ratings[0].Source + ": " + redend + movieObject.Ratings[0].Value + nextLine +
        redstart + movieObject.Ratings[1].Source + ": " + redend + movieObject.Ratings[1].Value + nextLine +
        redstart + movieObject.Ratings[2].Source + ": " + redend + movieObject.Ratings[2].Value + nextLine +
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
      console.error("Error :" + error);
      return;
    }
  });
}