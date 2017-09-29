if (navigator.requestMIDIAccess) {
  // Try to connect to the MIDI interface.
  navigator.requestMIDIAccess().then(onSuccess, onFailure);

} else {
  console.log("Web MIDI API not supported!");
}

var key_down = 144, // midi code for up/down event type
    key_up = 128;

// convert keyboard to JSON object
var octave1 = { 
        C: { id: 48, pressed: false, value: 0 },
        Csh: { id: 49, pressed: false, value: 0 },
        D: { id: 50, pressed: false, value: 0 },
        Dsh: { id: 51, pressed: false, value: 0 },
        E: { id: 52, pressed: false, value: 0 },
        F: { id: 53, pressed: false, value: 0 },
        Fsh: { id: 54, pressed: false, value: 0 },
        G: { id: 55, pressed: false, value: 0 },
        Gsh: { id: 56, pressed: false, value: 0 },
        A: { id: 57, pressed: false, value: 0 },
        Ash: { id: 58, pressed: false, value: 0 },
        B: { id: 59, pressed: false, value: 0 }
};

var octave2 = { 
        C: { id: 60, pressed: false, value: 0 },
        Csh: { id: 61, pressed: false, value: 0 },
        D: { id: 62, pressed: false, value: 0 },
        Dsh: { id: 63, pressed: false, value: 0 },
        E: { id: 64, pressed: false, value: 0 },
        F: { id: 65, pressed: false, value: 0 },
        Fsh: { id: 66, pressed: false, value: 0 },
        G: { id: 67, pressed: false, value: 0 },
        Gsh: { id: 68, pressed: false, value: 0 },
        A: { id: 69, pressed: false, value: 0 },
        Ash: { id: 70, pressed: false, value: 0 },
        B: { id: 71, pressed: false, value: 0 }
};

// keys and pads overloaded? same notes? hmmm
            
var pad = {
        one: { id: 44, pressed: false, value: 0 },
        two: { id: 45, pressed: false, value: 0 },
        thr: { id: 46, pressed: false, value: 0 },
        fur: { id: 47, pressed: false, value: 0 },
        fve: { id: 48, pressed: false, value: 0 }, //overload starts here
        six: { id: 49, pressed: false, value: 0 },
        svn: { id: 50, pressed: false, value: 0 }, 
        eht: { id: 51, pressed: false, value: 0 }
};

var knob = {
        one: { id: 5, turned: false, value: 0 },
        two: { id: 6, turned: false, value: 0 },
        thr: { id: 7, turned: false, value: 0 },
        fur: { id: 8, turned: false, value: 0 },
        fve: { id: 1, turned: false, value: 0 },
        six: { id: 2, turned: false, value: 0 },
        svn: { id: 3, turned: false, value: 0 },
        eht: { id: 4, turned: false, value: 0 }
};

// Function executed on successful connection
function onSuccess(interface) {

    console.log('Got MIDI', interface);

    var inputs = interface.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

var debounce = 300; //debounce const
var waitingMIDI = false;
function onMIDIMessage (message) {
    console.log(message.data);
    var message = {
                type: message.data[0],
                id: message.data[1],
                value: message.data[2]
    };

    if (!waitingMIDI){ 
        waitingMIDI = true;
        matchId(message);
        /*octave1.keys(obj).map((key) => {
        if(obj[key].id = message.id)
              
        });*/
        setTimeout(function() { waitingMIDI = false; }, debounce);
        // filter instead of switch?
        // octave1.map for id
        // if found return object
        // pass to type to keypress
        // octave2 ""
        // ""
        // ""
        // pad.map for id
        // if found return object
        // pass object value type to pressed function 


        /*switch(message_id){
            case pad1.id:
                pad1.pressed = !pad1.pressed;
                if (message_type==144){
                    pad1.value = (message_value/128);
                }
            break; 
            case pad2.id:
                pad2.pressed = !pad2.pressed;
            break; 
            case pad3.id:
                pad3.pressed = !pad3.pressed;
            break; 
            case pad4.id:
                pad4.pressed = !pad4.pressed;
            break; 

            //Knob cases
            case knob1.id:
                knob1.value = (message_value/128);
                knob1.turned = true; 
            break;
            case knob2.id:
                knob2.value = (message_value/128);
                knob2.turned = true; 
            break;
            case knob3.id:
                knob3.value = (message_value/128);
                knob3.turned = true; 
            break;
            case knob4.id:
                knob4.value = (message_value/128);
                knob4.turned = true; 
            break;
            case knob5.id:
                knob5.value = (message_value/128);
                knob5.turned = true; 
            break;
            case knob6.id:
                knob6.value = (message_value/128);
                knob6.turned = true; 
            break;
            case knob7.id:
                knob7.value = (message_value/128);
                knob7.turned = true; 
            break;
            case knob8.id:
                knob8.value = (message_value/128);
                knob8.turned = true; 
            break;


            case octave1.C.id:
                octave1.C = buttonEvent(message)
            break;
            case octave1.Csh.id:
                octave1.Csh.pressed = keyboardEvent(message_type)
            break;
            case octave1.D.id:
                octave1.D.pressed = keyboardEvent(message_type)
            break;
            case octave1.Dsh.id:
                octave1.Dsh.pressed = keyboardEvent(message_type)
            break;
        }*/
        
    }
}

// more general???
function matchId(message){

    for( var key in octave1){
        if( octave1[key].id === message.id )
            octave1[key] = buttonEvent(message);
    }
    for( var key in octave2){
        if( octave2[key].id === message.id )
            octave2[key] = buttonEvent(message);
    }
    for( var key in pad){
        if( pad[key].id === message.id )
            pad[key] = buttonEvent(message);
    }
    for( var key in knob){
        if( knob[key].id === message.id )
            knob[key] = knobEvent(message);
    }
}

function buttonEvent(message){
    var id, pressed, value;

    id = message.id;

    if(message.type === key_down){
        pressed = true;    
    }else{
        pressed = false;
    }

    value = (message.value/128); //should this be auto-converted to percentage?

    return { id: id, pressed: pressed, value: value };
}

function knobEvent(message){
    var id, turned, value; 

    id = message.id;

    turned = true;
    setTimeout(function(){ turned = false }, 1000); //specify knob to be timed out?

    value = (message.value/128);

    return { id: id, turned: turned, value: value};

    // maybe easing could be applied here also, but then everythin has same easing?
    // should definitely set turned timeout here

}

// Function executed on failed connection
function onFailure(error) {
    console.log("Could not connect to the MIDI interface");
}

/*function outputNote(){
    var noteon,
        noteoff,
        outputs = [];

    // Grab an array of all available devices
    var iter = interface.outputs.values();
    for (var i = iter.next(); i && !i.done; i = iter.next()) {
        outputs.push(i.value);
    }

    // Craft 'note on' and 'note off' messages (channel 3, note number 60 [C3], max velocity)
    noteon = [0x92, 60, 127];
    noteoff = [0x82, 60, 127];

    // Send the 'note on' and schedule the 'note off' for 1 second later
    outputs[0].send(noteon);
    setTimeout(
    function() {
        outputs[0].send(noteoff);
    },
    1000
    );
}*/
