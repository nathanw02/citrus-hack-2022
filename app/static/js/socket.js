var socket = io();
    

socket.on('connect', function() {
    socket.send('send id', socket.id);
});

