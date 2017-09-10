if (navigator.requestMIDIAccess) {
  // Try to connect to the MIDI interface.
  navigator.requestMIDIAccess().then(onSuccess, onFailure);

} else {
  console.log("Web MIDI API not supported!");
}

var pad1pressed = false;
var pad2pressed = false;

// Function executed on successful connection
function onSuccess(interface) {

    console.log('Got MIDI', interface);

    var inputs = interface.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }


/*
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
*/
}

function onMIDIMessage (message) {
    console.log(message.data);
    if(message.data[1] == 44){
        pad1pressed = !pad1pressed;
    }
    if(message.data[1] == 45){
        pad2pressed = !pad2pressed;
    }
}

// Function executed on failed connection
function onFailure(error) {
  console.log("Could not connect to the MIDI interface");
}
