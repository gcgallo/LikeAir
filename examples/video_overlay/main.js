if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;

var h = $('#handle'),
    l = $('#container'),
    r = $('#controller'),
    w = $('body').width() - 18;

var clock = new THREE.Clock(); //use Date.now() instead?
var gui = new dat.GUI( { width: 350, autoPlace: false } );

var pulse_options; 

var PI = Math.PI;
var W = l.width(), H = window.innerHeight;

var mixer, loader;

var object;

function init() {

    var container = document.getElementById( 'container' );
    var controller = document.getElementById('controller');

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x00020 ) );
    //scene.fog = new THREE.FogExp2( 0x00000, 0.02 );

    /* IMPORT VIDEOS HERE
    */ 
    // this could be better, return scene add, xyz positioning
    space_vid = loadVideo("media/sample2.webm", 0);
    //screen[0].position.y = -50;
    space.video.play()
    scene.add(space.screen);

    loadVideo("media/waters.mp4", 1);
    screen[1].position.y = -50;
    video[1].play()
    scene.add(screen[1]);

    loadVideo("media/water1s.m4v", 2);
    screen[2].position.y = -50;
    video[2].play()
    scene.add(screen[2]);

    loadVideo("media/air2.m4v", 3);
    screen[3].position.y = -50;
    video[3].play()
    scene.add(screen[   3]);

    loadVideo("media/strings.mp4", 4);
    screen[4].position.y = -50;
    video[4].play()
    scene.add(screen[4]);

    /* END IMPORT
    */


    /* CREATE STAR SYSTEM
    */
    THREE.TextureLoader.crossOrigin = '';

    // make smaller and only in sky


    videoControls(0);
    videoControls(1);
    videoControls(2);
    videoControls(3);
    videoControls(4);

    /* CONFIG RENDERER
    */
    renderer = new THREE.WebGLRenderer( { antialias: false , preserveDrawingBuffer: true, alpha: true} );
    renderer.setSize( W, H );
    //renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    /* END RENDERER
    */

    /* INTERACTIVE CONTROLS
    */ 
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    console.log(controls);
    gui.domElement.id = 'gui';

    controller.appendChild(gui.domElement);

    /* END CONTROLS
    */

    /* ADD LISTENERS
    */ 
    // create fallbacks if no midi
    window.addEventListener('keydown', handleKeyDown, false);
    //window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener( 'resize', onWindowResize, false );

    // FINE, i'll use jquery
    var isDragging = false;

    h.mousedown(function(e){
        isDragging = true;
        e.preventDefault();
    });
    $(document).mouseup(function(){
        isDragging = false;
    }).mousemove(function(e){
        if(isDragging){
            l.css('width', e.pageX);
            r.css('width', w - e.pageX);
            camera.aspect = l.width() / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( l.width(), window.innerHeight );
        }
    });


}

/*UTILTY FUNCTIONS
*/
function videoControls(index){
    var text = 'video' + index; 
    var f = gui.addFolder(text);
    f.add( screen[index], "visible").listen();
    f.add( screen[index].material, "opacity", 0, .99 ).listen();
    f.open();
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
        window.is1Down = false;
    }*/
    if (event.keyCode === 50) { 
        window.is2Down = false;
    }
    if (event.keyCode === 51) { 
        window.is3Down = false;
    }
}

function onWindowResize() {

    var l = $('#container');

    camera.aspect = (l.width()) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( l.width(), window.innerHeight );

}

function ease(control, target, easing){
    var dx = control-target;
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
function fadeOut(index, interval){
    //screen.material.opacity = 0;
    var level = screen[index].material.opacity;
    fade_out = setInterval(
        function(){ 
            screen[index].material.opacity -= .01;
            level -= .01;
            if(level < 0){
                screen[index].visible = false;
                //video[index].pause();
                clearInterval(fade_out);
            }
        },
    interval);
}

function screenSwitch(control, index){
    if (control.pressed || window.is1Down) {
        if(screen[index].visible){
            video[index].muted = true;
            fadeOut(index, 1/control.velocity);
        }else{
            video[index].muted = false;
            console.log(video[index]);
            //video[index].play();
            fadeIn(screen[index], 1/control.velocity, .2);
            
        }
        control.pressed = false;
        //window.is1Down = false;
    }
}

function screenOpacity(control, index){
    if(control.turned){
        screen[index].material.opacity = ease(control.value, screen[index].material.opacity, .1);
        if(control.value - .01 < screen[index].material.opacity < control.value + .01)
            setTimeout(function(){ control.turned = false}, 500); //moved to midi_control
    }
}

function pressLength(control){
    var length = Date.now() - control.time; 
    return length;
}

function pulseAnimation(object){
    if (object.pulse_inc == 1){
        object.pulse.material.uniforms[ "c" ].value += pulse_options.pace;
        if (object.pulse.material.uniforms[ "c" ].value > .05)
            object.pulse_inc = 0;
    }else{
        object.pulse.material.uniforms[ "c" ].value -= pulse_options.pace;
        if (object.pulse.material.uniforms[ "c" ].value < -.2)
            object.pulse_inc = 1;
    }
}

function pulseMaterial(color){
    var pulseMaterial = new THREE.ShaderMaterial( 
    {
        uniforms: 
        { 
            "c":   { type: "f", value: .1 }, // intensity variables 
            "p":   { type: "f", value: 6 },
            pulseColor: { type: "c", value: new THREE.Color(color) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    }   );
    return pulseMaterial 
}

function lightAppear(object, object2, control){
    if(control.pressed){
        object.light.visible = !object.light.visible; 
        object.pulse.visible = !object.pulse.visible;
        object2.light.visible = !object2.light.visible; 
        object2.pulse.visible = !object2.pulse.visible;
        control.pressed = false;     
    }
}    

/* END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
knob.eht.value = 1;

function render( time ){

    //if (scene.fog.density > .0002){
    //    scene.fog.density -= .0001;
    //}

    // TODO: add range opt to ease func
    // knobs are are bad, need to be rethought 
    //var fog_range = .02;
    //fog_range = knob.eht.value*(.02-.0002)+.0002;
    //scene.fog.density = ease(fog_range, scene.fog.density, .1)

    // change screen numbering to match or switch to object?
    screenSwitch(pad.one, 0);
    screenSwitch(pad.two, 1);
    screenSwitch(pad.thr, 2);
    screenSwitch(pad.fur, 3);
    screenSwitch(pad.fve, 4);

    screenOpacity(knob.one, 0);
    screenOpacity(knob.two, 1);
    screenOpacity(knob.thr, 2);
    screenOpacity(knob.fur, 3);
    screenOpacity(knob.fve, 4);

   
    /* UPDATE VIDEO 
    */ 
    for (var i = 0; i < video.length ; i++){
        if ( video[i].readyState === video[i].HAVE_ENOUGH_DATA ) 
        {
            videoImageContext[i].drawImage( video[i], 0, 0, videoImage[i].width, videoImage[i].height );
            if ( videoTexture[i] ) 
                videoTexture[i].needsUpdate = true;
        }
        if( video[i].readyState === video[i].HAVE_ENOUGH_DATA ){
          videoTexture[i].needsUpdate = true;
        }
    }
    /* END VIDEO UPDATE
    */

    renderer.render( scene, camera );

}

init();
animate();
