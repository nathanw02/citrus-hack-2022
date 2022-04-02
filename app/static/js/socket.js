var socket = io();


let attributes = ['hair', 'feather', 'milk', 'egg', 'airborne', 'aquatic', 'predator', 'toothed', 'backbone', 'breathes', 'venomous', 'fins', 'legs', 'tail', 'domestic']
    

let inputs = document.getElementsByTagName('input')
let currentInput = 0

socket.on('connect', function() {
    socket.emit('send id', socket.id);
});

socket.on('win', function(data) {
    console.log(data);
    inputs[currentInput].disabled = true;
    //do something

    //display win

    //display animal
    //fun fact
    //endangered not yes

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
    currentInput++;
    inputs[currentInput].disabled = false;
    
    /*
     <p style="display: inline; color:greenyellow">hair</p>
    <p style="display: inline; color: gray">feather</p>
    <p style="display: inline; color:greenyellow">milk</p>
    <p style="display: inline; color: greenyellow">egg</p>
    <p style="display: inline; color:greenyellow">airborne</p>
    <p style="display: inline; color: gray">aquatic</p>
    <p style="display: inline; color:greenyellow">preadator</p>
    <p style="display: inline; color: greenyellow">toothed</p>
    <p style="display: inline; color:greenyellow">backbone</p>
    <p style="display: inline; color: gray">breathes</p>
    <p style="display: inline; color:greenyellow">venomous</p>
    <p style="display: inline; color: greenyellow">fins</p>
    <p style="word-spacing: 2px;display: inline; color:greenyellow">2 legs</p>
    <p style="display: inline; color: gray">tail</p>
    <p style="display: inline; color:greenyellow">domestic</p>
    <p style="display: inline; color:gray">bird</p>
    */

});

socket.on('error', function(err){
    console.log(err);
});

function guess(animal){
    socket.emit('guess', {'session': socket.id, 'guess': animal});
}
