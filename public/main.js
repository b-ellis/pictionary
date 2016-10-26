var socket = io();
var pictionary = function() {
    var drawing;
    var canvas, context;
    
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                        6, 0, 2 * Math.PI);
        context.fill();
    };
    
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function(event) {
        event.preventDefault();
        drawing = true;
        canvas.on('mousemove', function(event) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};
        draw(position);
        socket.on('draw', draw);
        });
    });
    canvas.on('mouseup', function(event) {
        event.preventDefault();
        drawing - false;
        canvas.unbind('mousemove');
    });
};

$(document).ready(function() {
    pictionary();
})