if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;
var olivia = {
        shape: new THREE.SphereGeometry( 1, 64, 16 ),
        light: new THREE.PointLight( 0x00fff0, 10, 50 ),
        pulse: undefined, 
        pulse_inc: 0,
        level: 0,
        color: 0x00fff0,
        size: 1,
        height: 1
}

var adeymo = {
        shape: new THREE.SphereGeometry( 20, 64, 16 ),
        light: new THREE.PointLight( 0xff0f00, 10, 50 ),
        pulse: undefined,
        pulse_inc: 0,
        level: 0,
        color: 0xff0f00,
        size: 1,
        height: 1
}

var bar = [];
for(var i = 0; i < 8; i++){
    bar[i] = {
            shape: undefined,
            light: undefined,
            pulse: undefined,
            pulse_inc: 0,
            level: 0,
            color: 0xff0f00,
            size: 1,
            height: 1
    };
}

var cal = [];
for(var i = 0; i < 8; i++){
    cal[i] = {
            shape: undefined,
            light: undefined,
            pulse: undefined,
            pulse_inc: 0,
            level: 0,
            color: 0xff0f00,
            size: 1,
            width: 1
    };
}

var starSystem, particleSystem;
var starCount = 1200;
var star = [];
var pulse=0;
var clock = new THREE.Clock(); //use Date.now() instead?
var gui = new dat.GUI( { width: 350, autoPlace: false } );

var pulse_options; 

var PI = Math.PI;
var W = window.innerWidth*.48, H = window.innerHeight;

var mixer, loader;

var object;

function init() {

    var container = document.getElementById( 'container' );
    var controller = document.getElementById('controller');

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x00020 ) );
    scene.fog = new THREE.FogExp2( 0x00000, 0.02 );

    /* IMPORT VIDEOS HERE
    */ 
    // this could be better, return scene add, xyz positioning
    loadVideo("media/resist.mp4", 0);
    scene.add(screen[0]);

    loadVideo("media/nature.webm", 1);
    scene.add(screen[1]);

    /* END IMPORT
    */

    /* CREATE MAIN POINT LIGHT
    */
    pulse_options = {
        pace: .01, 
        min: .0005,
        max: .01,
    };

    olivia.light.add( new THREE.Mesh( olivia.shape, new THREE.MeshBasicMaterial( { color: olivia.color } ) ) );
    olivia.light.position.x = 0;
    olivia.light.position.y = -40;
    olivia.light.position.z = 0;
    olivia.light.visible = false;
    scene.add( olivia.light );

    olivia.pulse = new THREE.Mesh( olivia.shape.clone(), pulseMaterial(olivia.color) ),
    olivia.light.position.x = 0;
    olivia.pulse.position.y = -40;
    olivia.pulse.position.z = 0;
    scene.add( olivia.pulse );

    adeymo.light.add( new THREE.Mesh( adeymo.shape, new THREE.MeshBasicMaterial( { color: adeymo.color } ) ) );
    adeymo.light.position.x = 150;
    adeymo.light.position.y = 40;
    adeymo.light.position.z = -100;
    scene.add( adeymo.light );

    adeymo.pulse = new THREE.Mesh( adeymo.shape.clone(), pulseMaterial(adeymo.color) ),
    adeymo.pulse.position.x = 150;
    adeymo.pulse.position.y = 40;
    adeymo.pulse.position.z = -100;
    scene.add( adeymo.pulse );

    //add ground plane
    var plane = new THREE.PlaneGeometry(1000, 1000);
    var ground = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x824242 , side: THREE.DoubleSide }));
    ground.position. y = -50;
    ground.rotation.x = Math.PI/2; 
    scene.add(ground);

    /* END MAIN POINT LIGHT
    */ 

    /* CREATE STAR SYSTEM
    */
    THREE.TextureLoader.crossOrigin = '';

    // make smaller and only in sky

    var starShape = new THREE.SphereGeometry( 1, 64, 16 );

    for (var p = 0; p < starCount; p++){ 
        // create a star of random color
        var colors = randomColor({
           luminosity: 'light',
           hue: 'blue'
        });
        
        star[p] = new THREE.PointLight( colors, 10, 50 );
        star[p].add( new THREE.Mesh( starShape, new THREE.MeshBasicMaterial( { color: colors } ) ) );
        //star[p] = new THREE.Mesh( starShape, new THREE.MeshBasicMaterial( { color: colors, transparent: true, opacity: 0} ) );
        star[p].visible = false;

        var pX = Math.random() * 800 - 400; // pre-load random numbers
        var pY = Math.random() * 800 - 400; // see example in GPU particle system
        var pZ = Math.random() * 800 - 400;

        star[p].position.x = pX;
        star[p].position.y = pY;
        star[p].position.z = pZ;

        var radius = Math.sqrt(pX*pX + pY*pY + pZ*pZ)
        if(radius > 150 && radius < 400 && pY > 10) 
            scene.add( star[p] );
    }
    /* END STAR SYSTEM
    */


    gui.add( scene.fog, "density", .0002, .02 ).listen();
    var f0 = gui.addFolder('pulsing')    
    gui.add( pulse_options, "pace", pulse_options.min, pulse_options.max ).listen();
    gui.add( olivia, "size", 0, 99 ).listen();
    gui.add( adeymo, "size", 0, 99 ).listen();

    videoControls(0);
    videoControls(1);

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
    var h = $('#handle'),
    l = $('#container'),
    r = $('#controller'),
    w = $('body').width() - 18;

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
                video[index].pause();
                clearInterval(fade_out);
            }
        },
    interval);
}

function screenSwitch(control, index){
    if (control.pressed || window.is1Down) {
        if(screen[index].visible){
            fadeOut(index, 1/control.velocity);
        }else{
            console.log(video[index]);
            video[index].play();
            fadeIn(screen[index], 1/control.velocity, .5);
            
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

function barFormation(control, object){
    if(control.pressed){
        object.light.visible = true;
        object.height += pressLength(control)*.001; 
    }
    object.light.scale.y = ease(object.height, object.light.scale.y, .05 );
}

function barDecay(control, object){
    if(control.pressed){
        object.light.visible = true;
        object.level -= pressLength(control)*.001; 
    }
    object.light.position.y = ease(object.level, object.light.position.y, .05 );
}

function calendarFormation(control, object){
    if(control.pressed){
        object.light.visible = true;
        object.width += pressLength(control)*.001; 
    }
    object.light.scale.x = ease(object.width, object.light.scale.x, .05 );
}
/* END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
var supermoon = true;
var therapy = false;
var bookstore = false;
knob.eht.value = 1;

function render( time ){

    var p = Math.floor(Math.random() * starCount);
    star[p].visible = true;

    //if (scene.fog.density > .0002){
    //    scene.fog.density -= .0001;
    //}

    // TODO: add range opt to ease func
    // knobs are are bad, need to be rethought 
    var fog_range = .02;
    fog_range = knob.eht.value*(.02-.0002)+.0002;
    scene.fog.density = ease(fog_range, scene.fog.density, .1)

    // change screen numbering to match or switch to object?
    screenSwitch(pad.one, 0);
    screenSwitch(pad.two, 1);

    screenOpacity(knob.one, 0);
    screenOpacity(knob.two, 1);

    // fix: need ifs to allow dat gui fall back...

    /*if(knob.fve.turned){
        range = knob.fve.value*(pulse_options.max-pulse_options.min)+pulse_options.min;
    }*/
    var range = knob.fve.value;
    range = knob.fve.value*(pulse_options.max-pulse_options.min)+pulse_options.min;
    pulse_options.pace = ease(range, pulse_options.pace, .1);

    /*if(knob.six.turned){
    }*/
    olivia.size = ease(knob.six.value*100, olivia.size, .1)
    olivia.pulse.scale.x = olivia.size;
    olivia.pulse.scale.y = olivia.size;
    olivia.pulse.scale.z = olivia.size;

    adeymo.size = ease(knob.svn.value*100, adeymo.size, .1)
    adeymo.pulse.scale.x = adeymo.size;
    adeymo.pulse.scale.y = adeymo.size;
    adeymo.pulse.scale.z = adeymo.size;

    // slow/stop pulse
    pulseAnimation(olivia);
    pulseAnimation(adeymo);
    olivia.pulse.lookAt(camera.position);
    adeymo.pulse.lookAt(camera.position);

    if(supermoon){
        if(octave1.F.pressed){
            olivia.level += pressLength(octave1.F)*.001; 
        }

        if(octave1.Fsh.pressed){
            olivia.level -= pressLength(octave1.Fsh)*.001; 
        }
        //olivia.light.position.x = ease(olivia.level, olivia.light.position.y, .05 );
        //olivia.pulse.position.x = olivia.light.position.y;

        if(octave1.G.pressed){
            adeymo.level += pressLength(octave1.G)*.001; 
        }
        if(octave1.Gsh.pressed){
            adeymo.level -= pressLength(octave1.Gsh)*.001; 
        }
        //adeymo.light.position.x = ease(adeymo.level, adeymo.light.position.y, .05 );
        //adeymo.pulse.position.x = adeymo.light.position.y;

        if(octave1.A.pressed) 
            therapy = true;

    }

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
