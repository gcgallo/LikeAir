if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;
var olivia_sphere;
var olivia = {
        shape: undefined,
        light: undefined,
        pulse: undefined,
        pulse_inc: 0,
        level: 0,
        color: 0x00fff0,
        size: 0
}

var adam = {
        shape: undefined,
        light: undefined,
        pulse: undefined,
        pulse_inc: 0,
        level: 0,
        color: 0xff0f00,
        size: 0
}

var starSystem, particleSystem;
var starCount = 1200;
var star = [];
var explode=0;
var pulse=0;
var options, spawnerOptions;
var clock = new THREE.Clock(); //use Date.now() instead?
var gui = new dat.GUI( { width: 350, autoPlace: false } );

var pulse_options; 

var PI = Math.PI;
var W = window.innerWidth/2, H = window.innerHeight;

var video = [], videoImage = [], videoImageContext = [], videoTexture = [];
var vids=0;
var screen1, screen2, screen3;

var mixer, loader;

var object;

function init() {

    var container = document.getElementById( 'container' );
    var controller = document.getElementById('controller');

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x00020 ) );
    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

    /* add animation importer
    loader = new THREE.JSONLoader();
    loader.load( "media/monkey.json", 
        function ( obj ) {
            //add the loaded object to the scene
            object = new THREE.Mesh( obj, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  )  );
            object.scale.x = object.scale.y = object.scale.z = 2;
            scene.add( object );
    }
    );*/
    
    /* IMPORT VIDEOS HERE
    */ // this could be functionalized further
    var import0 = importVideo("media/cops.mp4", 0);
    video[0] = import0.video;    
    videoImage[0] = import0.videoImage;    
    videoImageContext[0] = import0.videoImageContext;    
    videoTexture[0] = import0.videoTexture;    
    screen1 = createScreen(videoTexture[0], 0, 0, 0, 0);
    screen1.visible = false;
    scene.add(screen1);

    var import1 = importVideo("media/resist.mp4", 1);
    video[1] = import1.video;    
    videoImage[1] = import1.videoImage;    
    videoImageContext[1] = import1.videoImageContext;    
    videoTexture[1] = import1.videoTexture;    
    screen2 = createScreen(videoTexture[1], 1, 0, 0, 0);
    screen2.visible = false;
    scene.add(screen2);

    var import2 = importVideo("media/waters.mp4", 2);
    video[2] = import2.video;    
    videoImage[2] = import2.videoImage;    
    videoImageContext[2] = import2.videoImageContext;    
    videoTexture[2] = import2.videoTexture;    
    screen3 = createScreen(videoTexture[2], 2, 0, 0, 0);
    screen3.visible = false;
    scene.add(screen3);

    /*var import3 = importVideo("media/water.mp4", 3);
    video[3] = import3.video;    
    videoImage[3] = import3.videoImage;    
    videoImageContext[3] = import3.videoImageContext;    
    videoTexture[3] = import3.videoTexture;    
    screen4 = createScreen(videoTexture[3], 3, 0, 0, 0);
    screen4.visible = false;
    scene.add(screen4);*/
    /* END IMPORT
    */

    /* CREATE MAIN POINT LIGHT
    */
    olivia.shape = new THREE.SphereGeometry( 1, 64, 16 );
    olivia.light = new THREE.PointLight( 0x00fff0, 10, 50 );
    olivia.light.add( new THREE.Mesh( olivia.shape, new THREE.MeshBasicMaterial( { color: olivia.color } ) ) );
    scene.add( olivia.light );

    adam.shape = new THREE.SphereGeometry( 1, 64, 16 );
    adam.light = new THREE.PointLight( 0xff0f00, 10, 50 );
    adam.light.add( new THREE.Mesh( adam.shape, new THREE.MeshBasicMaterial( { color: adam.color } ) ) );
    adam.light.visible = false;
    scene.add( adam.light );
    /* END MAIN POINT LIGHT
    */ 

    /* CREATE STAR SYSTEM
    */
    THREE.TextureLoader.crossOrigin = '';
    
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

        var pX = Math.random() * 500 - 250; // pre-load random numbers
        var pY = Math.random() * 500 - 250; // see example in GPU particle system
        var pZ = Math.random() * 500 - 250;

        star[p].position.x = pX;
        star[p].position.y = pY;
        star[p].position.z = pZ;

        var radius = Math.sqrt(pX*pX + pY*pY + pZ*pZ)
        if(radius < 250) 
            scene.add( star[p] );
    }
    /* END STAR SYSTEM
    */

    /* CREATE PARTICLE SYSTEM
    */
    // make less cubical, alter origin? tie to another mesh?
    particleSystem = new THREE.GPUParticleSystem( {
        maxParticles: 2500000
    } );

    scene.add( particleSystem );

    // make options controllable from midi
    options = {
        position: new THREE.Vector3(),
        positionRandomness: 50,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0,
        color: 0x00fff0, //0xaa88ff,
        colorRandomness: .2,
        turbulence: 0,
        lifetime: .5,
        size: 30,
        sizeRandomness: 1
    };

    spawnerOptions = {
        spawnRate: 5000,
        horizontalSpeed: 0,
        verticalSpeed: 0,
        timeScale: .05,
    };

    gui.add( options, "lifetime", .1, 10 );
    /* END PARTICLE SYSTEM
    */

    /* CREATE PULSING SHADER
    */

    // add more controllable options?
    pulse_options = {
        pace: .01, 
        min: .005,
        max: .05,
        size: 50
    };

    var f0 = gui.addFolder('pulsing')    
    gui.add( pulse_options, "pace", pulse_options.min, pulse_options.max ).listen();
    gui.add( pulse_options, "size", 0, 99 ).listen();

    var f1 = gui.addFolder('video1');
    f1.add( screen1, "visible").listen();
    f1.add( screen1.material, "opacity", 0, 1 ).listen();

    var f2 = gui.addFolder('video2');
    f2.add( screen2, "visible").listen();
    f2.add( screen2.material, "opacity", 0, 1 ).listen();

    var f3 = gui.addFolder('video3');
    f3.add( screen3, "visible").listen();
    f3.add( screen3.material, "opacity", 0, 1 ).listen();

    olivia.pulse = new THREE.Mesh( olivia.shape.clone(), pulseMaterial(olivia.color) );
    olivia.pulse.position = olivia.shape.position;
    olivia.pulse.scale.multiplyScalar(36);
    scene.add( olivia.pulse );

    adam.pulse = new THREE.Mesh( adam.shape.clone(), pulseMaterial(adam.color) );
    adam.pulse.position = adam.shape.position;
    adam.pulse.scale.multiplyScalar(36);
    adam.pulse.visible = false;
    scene.add( adam.pulse );
    /* END PULSING SHADER
    */

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

    // create separate window for controls?
    //var newWin = open('controller','Controls','height=300,width=300');

    /* END CONTROLS
    */

    /* ADD LISTENERS
    */ 
    // create fallbacks if no midi
    window.addEventListener('keydown', handleKeyDown, false);
    //window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener( 'resize', onWindowResize, false );


}

/*UTILTY FUNCTIONS
*/
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

    camera.aspect = (window.innerWidth/2) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth/2, window.innerHeight );

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
            object.material.opacity += .05;
            level += .05;
            if( level > target){
                clearInterval(fade_in);
            }
        },
    interval);
}
function fadeOut(object, interval){
    //screen.material.opacity = 0;
    var level = object.material.opacity;
    fade_out = setInterval(
        function(){ 
            object.material.opacity -= .05;
            level -= .05;
            if(level < 0){
                object.visible = false;
                clearInterval(fade_out);
            }
        },
    interval);
}

function screenSwitch(control, screen){
    if (control.pressed || window.is1Down) {
        if(screen.visible){
            fadeOut(screen, 500/control.velocity, .5);
        }else{
            fadeIn(screen, 500/control.velocity, .5);
            
        }
        control.pressed = false;
        //window.is1Down = false;
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
            "c":   { type: "f", value: .1 }, // what are C and P?
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

/* END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}

function render( time ){

    var delta = clock.getDelta() * spawnerOptions.timeScale;

    var p = Math.floor(Math.random() * starCount);
    star[p].visible = true;
    //fadeIn(star[p], 100, 1);

    // change screen numbering to match or switch to object?
    screenSwitch(pad.one, screen1);
    screenSwitch(pad.two, screen2);
    screenSwitch(pad.thr, screen3);
    //screenSwitch(pad.fur, screen4);

    if(knob.one.turned){
        screen1.material.opacity = ease(knob.one.value, screen1.material.opacity, .1);
        if(knob.one.value - .1 < screen1.material.opacity < knob.one.value + .1)
            setTimeout(function(){ knob.one.turned = false}, 500); //moved to midi_control
    }

    if(knob.two.turned){
        screen2.material.opacity = ease(knob.two.value, screen2.material.opacity, .1);
        if(knob.two.value - .1 < screen1.material.opacity < knob.two.value + .1)
            setTimeout(function(){ knob.two.turned = false}, 500); //moved to midi_control
    }

    if(knob.thr.turned){
        screen3.material.opacity = ease(knob.thr.value, screen3.material.opacity, .1);
    }

    // fix: need ifs to allow dat gui fall back...

    /*if(knob.fve.turned){
        range = knob.fve.value*(pulse_options.max-pulse_options.min)+pulse_options.min;
    }*/
    var range = knob.fve.value;
    range = knob.fve.value*(pulse_options.max-pulse_options.min)+pulse_options.min;
    pulse_options.pace = ease(range, pulse_options.pace, .1);

    /*if(knob.six.turned){
    }*/
    pulse_options.size = ease(knob.six.value*100, pulse_options.size, .1)
    olivia.pulse.scale.x = pulse_options.size;
    olivia.pulse.scale.y = pulse_options.size;
    olivia.pulse.scale.z = pulse_options.size;
    olivia.pulse.lookAt(camera.position);

    adam.size = ease(knob.svn.value*100, adam.size, .1)
    adam.pulse.scale.x = adam.size;
    adam.pulse.scale.y = adam.size;
    adam.pulse.scale.z = adam.size;
    adam.pulse.lookAt(camera.position);

    pulseAnimation(olivia);
    pulseAnimation(adam);

    // quasar effect (add bool/knob control)
    /*if(octave1.C.pressed){ 
        olivia_pulse.rotation.y -= 20 * delta; 
    }
    if(octave1.Csh.pressed){ 
        olivia_pulse.rotation.y += 20 * delta; 
    }
    if(octave1.D.pressed){ 
        olivia_pulse.rotation.x -= 20 * delta; 
    }
    if(octave1.Dsh.pressed){ 
        olivia_pulse.rotation.x += 20 * delta; 
    }*/

    if(octave1.E.pressed){
        olivia.level += pressLength(octave1.E)*.001; 
    }
    olivia.light.position.y = ease(olivia.level, olivia.light.position.y, .05 );
    olivia.pulse.position.y = olivia.light.position.y;

    if(octave1.F.pressed){
        adam.light.visible = true;
        adam.pulse.visible = true;
        adam.level += pressLength(octave1.F)*.001; 
    }
    adam.light.position.y = ease(adam.level, adam.light.position.y, .05 );
    adam.pulse.position.y = adam.light.position.y;


    //controls to modify options
    particleSystem.spawnParticle( options );
   
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

    tick += delta;

    particleSystem.update( tick );

    renderer.render( scene, camera );

}

init();
animate();
