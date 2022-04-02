import json
import random
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

with open('citrus-hack-2022\\app\\animals.json') as json_file:
    animals = json.load(json_file)

@app.route('/')
def index():
    return render_template('index.html')








class Session:
    def __init__(self, id):
        self.id = id
        self.animal = self.generate()
        self.guesses = 0
    

    def generate(self):
        return random.choice(list(animals))

    def match(self, guess):
        animalGuess = animals[guess]
        result = {key: [val, animalGuess[key]] for key, val in animals[self.animal].items() if key in animalGuess}
        print(result)


if __name__ == '__main__':
    #socketio.run(app, debug=True)
    a = Session(123)
    print(a.animal)

