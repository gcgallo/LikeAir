if (navigator.requestMIDIAccess) {
  // Try to connect to the MIDI interface.
  navigator.requestMIDIAccess().then(onSuccess, onFailure);

} else {
  console.log("Web MIDI API not supported!");
}

var key_down = 144,
    key_up = 128;

// convert keyboard to JSON object
var key = { 
        C1: { id: 48, pressed: false, value: 0 },
        C1SH: { id: 49, pressed: false, value: 0 },
        D1: { id: 50, pressed: false, value: 0 },
        D1SH: { id: 51, pressed: false, value: 0 }
};

// keys and pads overload? same notes? hmmm
            
var pad1 = { id: 44, pressed: false, value: 0 },
    pad2 = { id: 45, pressed: false, value: 0 },
    pad3 = { id: 46, pressed: false, value: 0 },
    pad4 = { id: 47, pressed: false, value: 0 },
    pad5 = { id: 48, pressed: false, value: 0 },
    pad6 = { id: 49, pressed: false, value: 0 },
    pad7 = { id: 50, pressed: false, value: 0 }, 
    pad8 = { id: 51, pressed: false, value: 0 };

var knob1 = { id: 5, turned: false, value: 0 },
    knob2 = { id: 6, turned: false, value: 0 },
    knob3 = { id: 7, turned: false, value: 0 };
    knob3 = { id: 7, turned: false, value: 0 };

/*var keyC1id = 48;
    keyCSH1id = 49;
    keyD1id = 50;
    keyDSH1id = 51;*/

/*var pad1pressed = false;
var pad2pressed = false;
var pad3pressed = false;
var pad4pressed = false;*/

//var knob1value;
//var knob1turned = false;

//var keyC1pressed = false;
//var keyCSH1pressed = false;
//var keyD1pressed = false;
//var keyDSH1pressed = false;

// Function executed on successful connection
function onSuccess(interface) {

    console.log('Got MIDI', interface);

    var inputs = interface.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIMessage (message) {
    console.log(message.data);
    var message_type = message.data[0];
    var message_id = message.data[1];
    var message_value = message.data[2];

    switch(message_id){
        case pad1.id:
            pad1.pressed = !pad1.pressed;
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

        case knob1.id:
            knob1.value = (message_value/128);
            knob1.turned = true; 
        break;

        case key.C1.id:
            key.C1.pressed = keyboardPress(message_type)
        break;
        case key.C1SH.id:
            key.C1SH.pressed = keyboardPress(message_type)
        break;
        case key.D1.id:
            key.D1.pressed = keyboardPress(message_type)
        break;
        case key.D1SH.id:
            key.D1SH.pressed = keyboardPress(message_type)
        break;
    }
}

function keyboardPress(type){
        if(type == key_down){
            pressed = true;
        }else{
            pressed = false;
        }
    return pressed;
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
