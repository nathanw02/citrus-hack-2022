import json
import random
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

MAX_GUESSES = 10
sessions = {}

with open('citrus-hack-2022\\app\\animals.json') as json_file:
    animals = json.load(json_file)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('send id')
def connection(id):
    newSession = Session(id)
    sessions[id] = newSession

@socketio.on('disconnect')
def disconnect(id):
    del sessions[id]

@socketio.on('guess')
def guess(data):
    print('data:', data)
    id = data['session']

    session = sessions[id]
    
    if session.guesses == MAX_GUESSES:
        return emit('gameOver', {'data': session.animal})

    emit('matchResponse', session.match(data['guess']))

    session.guesses += 1

class Session:
    def __init__(self, id):
        self.id = id
        self.animal = self.generate()
        self.guesses = 0
    

    def generate(self):
        return random.choice(list(animals))

    def match(self, guess):
        if guess == self.animal:
            return {'match': 'correct'}

        animalCorrect = animals[self.animal]
        animalGuess = animals[guess]
        result = []

        correctList = list(animalCorrect.values())
        guessList = list(animalGuess.values())
        for i in range(15):
            if i == 12: #check leg count
                if correctList[i] == guessList[i]:
                    result.append([int(correctList[i]), True])
                else:
                    result.append([int(guessList[i]), False])

            elif correctList[i] == guessList[i]: #normal check
                result.append(1)
            else:
                result.append(0)
        
        return {'match': result}

if __name__ == '__main__':
    socketio.run(app, debug=True)

