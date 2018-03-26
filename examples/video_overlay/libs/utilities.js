/*UTILTY FUNCTIONS
*/
//var gui = new dat.GUI(); //{ width: 350, autoPlace: false } );

function videoControls(vid){
        console.log(vid);
        var text = vid.name; 
        var f = gui.addFolder(text);
        f.add(vid.screen, "visible").listen();
        vid.screen.material.transparent = true;
        f.add(vid.screen.material, "opacity", 0, 1 ).listen();
        f.open();
}

function toggleVisible(obj){
        obj.visible = !obj.visible;
}

var waitingDown = false;
var waitingUp = false;
function handleKeyDown(event) {
    if (! waitingDown ){ 
        waitingDown = true;
        if (event.keyCode === 49) {
            window.is1Down = !window.is1Down;
        }
        if (event.keyCode === 50) {
            window.is2Down = !window.is2Down;
        }
        if (event.keyCode === 51) {
            window.is3Down = !window.is3Down;
        }
        setTimeout(function () { waitingDown = false; }, 300);
    }
}

function handleKeyUp(event) {
    /*if (event.keyCode === 49) { 
     *         window.is1Down = false;
     *             }*/
    if (event.keyCode === 50) { 
        window.is2Down = false;
    }
    if (event.keyCode === 51) { 
        window.is3Down = false;
    }
}

function onWindowResize() {

    camera.aspect = (l.width()) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( l.width(), window.innerHeight );

}

function ease(min, max, control, target, easing){
    var ranged = control*(max - min) - min
    var dx = ranged-target;
    target += dx * easing;
    return target; 
}

// tune fade in/out
var fade_in;
var fade_out;
function fadeIn(object, interval, target){
    var level = 0;
    object.material.opacity = 0;
    object.visible = true;
    fade_in = setInterval(
        function(){ 
            object.material.opacity += .01;
            level += .01;
            if( level > target){
                clearInterval(fade_in);
            }
        },
        interval);
}

//screen-specific, should be general
function fadeOut(vid, interval){
    //screen.material.opacity = 0;
    var level = vid.screen.material.opacity;
    fade_out = setInterval(
        function(){ 
            vid.screen.material.opacity -= .01;
            level -= .01;
            if(level < 0){
                vid.screen.visible = false;
                vid.video.pause();
                clearInterval(fade_out);
            }
        },
    interval);
}

function screenSwitch(control, vid){
    if (control.pressed || window.is1Down) {
        if(vid.screen.visible){
            vid.screen.visible = false; //fadeOut(vid, 1/control.velocity);
        }else{
            //console.log(video[index]);
            vid.video.play();
            vid.screen.visible = true;
            //fadeIn(vid.screen, 1/control.velocity, .3);
            
        }
        control.pressed = false;
        //window.is1Down = false;
    }
}

function screenOpacity(control, vid){
    if(control.turned){
        vid.screen.material.opacity = ease(0, 1, control.value, vid.screen.material.opacity, .1);
        if(control.value - .01 < vid.screen.material.opacity < control.value + .01)
            setTimeout(function(){ control.turned = false}, 500); //moved to midi_control
    }
}

function pressLength(control){
    var length = Date.now() - control.time; 
    return length;
}

