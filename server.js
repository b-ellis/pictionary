var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var players = [];

var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

var correctWord;

var randomWord = function() {
    var random = Math.floor(Math.random() * WORDS.length);
    return WORDS[random];
};

io.on('connection', function(socket) {
    players.push(socket.id);

    if (socket.id == players[0]) {
        io.in(socket.id).emit('drawer');
        correctWord = randomWord();
        io.in(socket.id).emit('draw word', correctWord);
    } else {
        io.in(socket.id).emit('guesser');
    }

    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });

    socket.on('userGuess', function(guess) {
        if (guess === correctWord) {
            correctWord = randomWord();
            socket.broadcast.emit('new game');
            io.in(socket.id).emit('new game');
            io.in(socket.id).emit('drawer');
            io.in(socket.id).emit('draw word', correctWord);
            for (var i = 0 ; i < players.length ; i++) {
                if(players[i] != socket.id) {
                    io.in(players[i]).emit('guesser');
                }
            }
        } else {
            socket.broadcast.emit('userGuess', "Latest Guess: " + guess);
        }
    });

    socket.on('disconnect', function() {
        console.log('user has disconnected');
        for (var i = 0; i < players.length; i++) {
            if (players[i] == socket.id) {
                players.splice(i, 1);
            }
        }
    });

});

server.listen(process.env.PORT || 8080);
