import json
import random
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

MAX_GUESSES = 5
sessions = {}

with open('animals.json') as json_file:
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
    id = data['session']

    session = sessions[id]

    animalGuess = data['guess']

    if animalGuess == session.animal:
        emit('matchResponse', session.match(data['guess']))
        return emit('win', {
            'animal': session.animal, 
            'data': animals[session.animal]
        })

    if session.guesses >= MAX_GUESSES-1:
        emit('matchResponse', session.match(data['guess']))
        return emit('lose', {
            'animal': session.animal, 
            'data': animals[session.animal],
        })

    if animalGuess not in animals:
        return emit('error', {'error': 'Invalid input'})
    
    

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


        animalCorrect = animals[self.animal]
        animalGuess = animals[guess]
        result = []

        correctList = list(animalCorrect.values())
        guessList = list(animalGuess.values())
        for i in range(17):
            if i == 15:
                continue

            if i == 12: #check leg count
                if correctList[i] == guessList[i]:
                    result.append([int(correctList[i]), True])
                else:
                    result.append([int(guessList[i]), False])
            
            elif i == 16: #check class type
                if correctList[i] == guessList[i]:
                    result.append([correctList[i], True])
                else:
                    result.append([guessList[i], False])

            elif correctList[i] == guessList[i] and correctList[i] == 'true':
                result.append([1, 1])

            elif correctList[i] == guessList[i] and correctList[i] == 'false':
                result.append([1, 0])

            else:
                result.append([0, 0])
        
        return {'match': result}

if __name__ == '__main__':
    socketio.run(app, port=8000, debug=True)

