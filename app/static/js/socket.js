var socket = io();
    
socket.on('connect', function() {
    socket.emit('send id', socket.id);
});

socket.on('matchResponse', function(match) {
    console.log(match)
});

function guess(animal){
    socket.emit('guess', {'session': socket.id, 'guess': animal});
}
