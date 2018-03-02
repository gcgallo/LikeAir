# LikeAir  

a web-based suite for designing and performing visual projections. Potential uses:  
* accompany live performances (poetry, music, theatre)
* video installations (galleries, musuems)  
* solo VJ performance 
* infographic displays
* simple animations 

## To get started
This is still very much a "work-in-progress", if you'd like to try it out, here are some instructions:  
```
git clone https://github.com/paidforby/LikeAir
cd LikeAir/examples/video_overlay
python -m SimpleHTTPServer #or your preferred HTTP server
```
then go to localhost:8000 (or whatever port you started your server on)  
you should be able to play around with the video overlays even with out a midi keyboard  

Alternatively, you can go [here](https://paidforby.github.io/LikeAir/examples/video_overlay and try running the online version.

## MIDI Keyboard
The most-working and practical aspect of this project is currently providing a library for interfacing with midi keyboards via the WebMIDI standard.  
Import `midi_control.js` into any web page with,  
```
<script language="javascript" type="text/javascript" src="https://paidforby.github.io/LikeAir/libs/midi_control.js"></script>
```
Any key on any given midi device can then be referenced by octave and note, that is, "middle C" can be reference as `octave4.C` and holds the values `pressed`, `velocity`, and `time` where,  
`octave4.C.pressed` = a boolean of whether or not middle C has been pressed in the previous loop  
`octave4.C.velocity` = the speed at which the middle C key was pressed  
`octave4.C.time` = the duration for which the middle C key has been pressed (TODO change var name to "duration"?)  

Additionally, pads and knobs may be reference in a similar manner (note: pads often overlap with notes on the keyboard). Pads hold the same values as keys, so just replace the octave and note with 'pad.one', 'pad.two', 'pad.thr', and so on, (TODO come up with a better name scheme).    

Knobs return slightly different MIDI values and therefore are handled differently (this may change depending on keyboard model? for example, my knobs don't double as push buttons. also, I'm not sure how to handle encoders?) . Knobs can be referenced as follows,  
`knob.fve.turned` = a boolean of whether or not the fifth knob was turned (right now this has to be reset to manually)  
`knob.fve.value` = a decimal value between   
 
MIDI is a standard for representing music notes as discrete data. However, it can be used and interpreted for any purpose.
This project uses MIDI data to control visual elements of a javascript WebGL animation (a "piece" as I'm calling them).
The MIDI controls are defined in [libs/midi_control.js](https://github.com/paidforby/LikeAir/blob/master/libs/midi_control.js).
The keyboard used during development was the Akai MPK Mini MkII, though any standard MIDI keyboard with a USB interface should be compatible.

<img src="https://github.com/gcgallo/LikeAir/raw/master/sample.png">   

LikeAir is written in entirely in client-side Javascript using (mostly) the [three.js](threejs.org) framework for the WebGL standard.   

## Needed improvements  
fun stuff:
* fix/improve spinning_images example
* add drag-and-drop placement on videos in video_overlay example
* add in-browser editing options, a la http://threejsplaygnd.brangerbriz.net/gui/
* allow to pull in video streams from youtube, or sounds from soundcloud

not-fun stuff:
* create systematic, reliable fallback from midi controller (just dat.gui or keystrokes?)
* remove jquery dependency, only used to handle resizing the split panes
* dynamnically add video elements to the DOM, see [libs/video_import.js](https://github.com/paidforby/LikeAir/blob/master/libs/video_import.js)
* generalize parts of [air](https://github.com/paidforby/air), ie shape creation, movement, pulsing  
* add ability to import 3D (blender?) animations   

