var socket = io();

var guessBox;
var drawing;
var canvas, context;

var displayWord = function(word) {
    $('.hidden-word').text('The word is: ' + word);
};

var displayGuess = function(val) {
    $('#guessList').text(val);
};

var guessing = function() {
    var onKeyDown = function(event) {
        if (event.keyCode != 13) {
            return;
        }
        
        console.log(guessBox.val());
        displayGuess(guessBox.val());
        socket.emit('userGuess', guessBox.val());
        guessBox.val('');
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    socket.emit('userGuess', guessBox.val());
};

var draw = function(position) {
    context.beginPath();
    context.arc(position.x, position.y,
                    6, 0, 2 * Math.PI);
    context.fill();
};
    
var pictionary = function() {
    canvas.on('mousedown', function(event) {
        event.preventDefault();
        drawing = true;
        canvas.on('mousemove', function(event) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};
        draw(position);
        socket.emit('draw', position);
        });
    });
    canvas.on('mouseup', function(event) {
        event.preventDefault();
        drawing = false;
        canvas.unbind('mousemove');
    });
};

$(document).ready(function() {
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    socket.on('drawer', pictionary);
    socket.on('draw', draw);
    socket.on('userGuess', displayGuess);
    socket.on('guesser', guessing);
    socket.on('draw word', displayWord);
});