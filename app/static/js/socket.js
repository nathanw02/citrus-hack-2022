var socket = io();


let attributes = ['hair', 'feather', 'egg', 'milk', 'airborne', 'aquatic', 'predator', 'toothed', 'backbone', 'breathes', 'venomous', 'fins', 'legs', 'tail', 'domestic']
    

let inputs = document.getElementsByTagName('input')
let currentInput = 0

socket.on('connect', function() {
    socket.emit('send id', socket.id);
});

socket.on('win', function(data) {
    inputs[currentInput].disabled = true;
    let animalTag = document.getElementById('animal');
    let factTag = document.getElementById('fact');
    let animal = data.animal;
    let pic = document.getElementById('picture');
    pic.src = data.data.picture;
    pic.setAttribute('style', 'border-style: solid; border-color: #4BD710; width: 18%; height: 18%');

    animalTag.innerText = 'Nice! Well done! The animal is: ' + animal;
    factTag.innerText = 'Fun fact: ' + data.data.fact;
    
    if(data.data.endangered === 'true'){
        let endangeredTag = document.getElementById('endangered');
        endangeredTag.innerText = 'This animal is endangered';
        endangeredTag.setAttribute('style', 'color: red');
    }
});

socket.on('lose', function(data){
    inputs[currentInput].disabled = true;
    let animalTag = document.getElementById('animal');
    let factTag = document.getElementById('fact');
    let animal = data.animal;
    let pic = document.getElementById('picture');
    pic.src = data.data.picture;
    pic.setAttribute('style', 'border-style: solid; border-color: red; width: 18%; height: 18%');
    animalTag.innerText = 'The correct animal was: ' + animal;
    factTag.innerText = 'Fun fact: ' + data.data.fact;

    if(data.data.endangered === 'true'){
        let endangeredTag = document.getElementById('endangered');
        endangeredTag.innerText = 'This animal is endangered';
        endangeredTag.setAttribute('style', 'color: red');
    }
});

socket.on('matchResponse', function(match) {

    matchArray = match.match;

    for(let i = 0; i < matchArray.length; i++) {
        let ptag = document.createElement('p');
        let text;
        if(i == 12) {
            if(matchArray[i][1] == true) {
                ptag.setAttribute('style', 'display: inline; color:greenyellow;');
                
            }else{
                ptag.setAttribute('style', 'display: inline; color:gray;');
            }

            text = document.createTextNode(`${matchArray[i][0]} ${attributes[i]}    `);
        
        }else if(i == 15) {
            if(matchArray[i][1] == true) {
                ptag.setAttribute('style', 'display: inline; color:greenyellow;');
                
            }else{
                ptag.setAttribute('style', 'display: inline; color:gray;');
            }

            text = document.createTextNode(`${matchArray[i][0]}    `);
        
        }else{
            if(matchArray[i][0] == 1) {
                if(matchArray[i][1] == 1) {
                    ptag.setAttribute('style', 'display: inline; color:greenyellow;');
                }else{
                    ptag.setAttribute('style', 'display: inline; color:gold;');
                }
            }else{
                ptag.setAttribute('style', 'display: inline; color:gray;');
            }
            text = document.createTextNode(`${attributes[i]}    `);
        }

        ptag.appendChild(text);
        let matchId = `match-${currentInput}`;
        let element = document.getElementById(matchId);
        element.appendChild(ptag);

    }
    
    inputs[currentInput].disabled = true;
    if(currentInput < 4){
        currentInput++;
        inputs[currentInput].disabled = false;
    }
    
});

socket.on('error', function(err){
    console.log(err);
});

function guess(animal){
    socket.emit('guess', {'session': socket.id, 'guess': animal.toLowerCase()});
}
