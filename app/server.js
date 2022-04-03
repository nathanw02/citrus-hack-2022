const express = require('express');
const app = express();
app.use(express.static(__dirname + '/static'));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

animals = require('./animals.json');

const MAX_GUESSES = 5;
var sessions = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
    socket.on('send id', (id) => {
        let newSession = new Session(id);
        sessions[id] = newSession;
    });

    socket.on('guess', (data) => {
        let id = data.session;

        if(!sessions.hasOwnProperty(id)) {
            return;
        }

        let session = sessions[id];

        let animalGuess = data.guess;

        if(animalGuess == session.animal) {
            io.to(id).emit('matchResponse', session.match(animalGuess));
            return io.to(id).emit('win', {
                'animal': session.animal,
                'data': animals[session.animal]
            });
        }

        if(session.guesses >= MAX_GUESSES - 1) {
            io.to(id).emit('matchResponse', session.match(animalGuess));
            return io.to(id).emit('lose', {
                'animal': session.animal,
                'data': animals[session.animal]
            });
        }

        if(!animals.hasOwnProperty(animalGuess)) return io.to(id).emit('error', {'error': 'Invalid input'});

        io.to(id).emit('matchResponse', session.match(animalGuess));

        session.guesses++;

    });

});


class Session {
    constructor(id) {
        this.id = id;
        this.animal = this.generate();
        this.guesses = 0;
    }

    generate() {
        let animalList = Object.keys(animals);
        return animalList[Math.floor(Math.random()*animalList.length)];
    }

    match(guess) {
        let animalCorrect = animals[this.animal];
        let animalGuess = animals[guess];

        let result = [];

        let correctList = Object.values(animalCorrect);
        let guessList = Object.values(animalGuess);

        for(let i = 0; i < 17; i++) {
            if(i == 15) continue;

            if(i == 12) {
                if(correctList[i] == guessList[i]) {
                    result.push([correctList[i], true]);
                }else{
                    result.push([correctList[i], false]);
                }
            
            }else if(i == 16) {
                if(correctList[i] == guessList[i]) {
                    result.push([correctList[i], true]);
                }else{
                    result.push([correctList[i], false]);
                }
            
            }else if(correctList[i] == guessList[i] && correctList[i] == 'true') {
                result.push([1, 1]);
            
            }else if(correctList[i] == guessList[i] && correctList[i] == 'false') {
                result.push([1, 0]);
            
            }else{
                result.push([0, 0,]);
            }

        }

        console.log(result);

        return {'match': result};

    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});