if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;
var olivia_sphere;
var starSystem, particleSystem;
var explode=0;
var pulse=0;
var options, spawnerOptions;
var clock = new THREE.Clock();
var gui = new dat.GUI( { width: 350 } );
var pulse_options; 

var PI = Math.PI;
var W = window.innerWidth, H = window.innerHeight;

var video = [], videoImage = [], videoImageContext = [], videoTexture = [];
var vids=0;
var screen0, screen1, screen2;

var mixer, loader;

var object;

function init() {

    var container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();

    /*loader = new THREE.JSONLoader();

    loader.load( "media/monkey.json", function ( obj ) {
        //add the loaded object to the scene
        object = new THREE.Mesh( obj, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  )  );
        object.scale.x = object.scale.y = object.scale.z = 2;
        scene.add( object );
    }, 

    // Function called when download progresses
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // Function called when download errors
    function ( xhr ) {
        console.error( 'An error happened' );
    }

    );*/

    
    //scene.fog = new THREE.Fog( 0x040306, 1, 1000 );
    scene.add( new THREE.AmbientLight( 0x00020 ) );
    //var loader = new THREE.TextureLoader();
   
    /* IMPORT VIDEOS HERE
    */ // this could be functionalized further
    var import0 = importVideo("media/cops.mp4", 0);
    video[0] = import0.video;    
    videoImage[0] = import0.videoImage;    
    videoImageContext[0] = import0.videoImageContext;    
    videoTexture[0] = import0.videoTexture;    
    screen0 = createScreen(videoTexture[0], 0, 0, 0, 0);
    screen0.visible = false;
    scene.add(screen0);

    var import1 = importVideo("media/resist.mp4", 1);
    video[1] = import1.video;    
    videoImage[1] = import1.videoImage;    
    videoImageContext[1] = import1.videoImageContext;    
    videoTexture[1] = import1.videoTexture;    
    screen1 = createScreen(videoTexture[1], 1, 0, 0, 0);
    screen1.visible = false;
    scene.add(screen1);

    var import2 = importVideo("media/waters.mp4", 2);
    video[2] = import2.video;    
    videoImage[2] = import2.videoImage;    
    videoImageContext[2] = import2.videoImageContext;    
    videoTexture[2] = import2.videoTexture;    
    screen2 = createScreen(videoTexture[2], 2, 0, 0, 0);
    screen2.visible = false;
    scene.add(screen2);

    /*var import3 = importVideo("media/water.mp4", 3);
    video[3] = import3.video;    
    videoImage[3] = import3.videoImage;    
    videoImageContext[3] = import3.videoImageContext;    
    videoTexture[3] = import3.videoTexture;    
    screen3 = createScreen(videoTexture[3], 3, 0, 0, 0);
    screen3.visible = false;
    scene.add(screen3);*/
    /* END IMPORT
    */

    /* CREATE MAIN POINT LIGHT
    */
    var olivia = new THREE.SphereGeometry( 1, 64, 16 );
    olivia_light = new THREE.PointLight( 0x00fff0, 10, 50 );
    olivia_light.add( new THREE.Mesh( olivia, new THREE.MeshBasicMaterial( { color: 0x00fff0 } ) ) );
    scene.add( olivia_light );
    /* END MAIN POINT LIGHT
    */ 

    /* CREATE STAR SYSTEM
    */
    THREE.TextureLoader.crossOrigin = '';
    var starCount = 1800;
    var starShape = new THREE.SphereGeometry( 1, 64, 16 );

    for (var p = 0; p < starCount; p++){ 
        // create a star of random color
        var colors = randomColor({
           luminosity: 'light',
           hue: 'blue'
        });
        
        // convert to array? and/or merge into a single mesh?
        stars = new THREE.PointLight( colors, 10, 50 );
        stars.add( new THREE.Mesh( starShape, new THREE.MeshBasicMaterial( { color: colors} ) ) );

        var pX = Math.random() * 500 - 250; // pre-load random numbers
        var pY = Math.random() * 500 - 250; // see example in GPU particle system
        var pZ = Math.random() * 500 - 250;

        stars.position.x = pX;
        stars.position.y = pY;
        stars.position.z = pZ;

        var radius = Math.sqrt(pX*pX + pY*pY + pZ*pZ)
        if(radius < 250) 
            scene.add( stars );
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
        lifetime: 1,
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
    var pulseMaterial = new THREE.ShaderMaterial( 
    {
        uniforms: 
        { 
            "c":   { type: "f", value: .1 }, // what are C and P?
            "p":   { type: "f", value: 6 },
            pulseColor: { type: "c", value: new THREE.Color(0x00fff0) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    }   );
    
    //knob1value = .01
    
    // add more controllable options?
    pulse_options = {
        pulse: .01, 
        min: .005,
        max: .05,
        size: 50
    };

    knob1value = pulse_options.pulse; 

    gui.add( pulse_options, "pulse", pulse_options.min, pulse_options.max ).listen();
    gui.add( pulse_options, "size", 0, 99 ).listen();

    pulsing = new THREE.Mesh( olivia.clone(), pulseMaterial.clone() );
    pulsing.position = olivia.position;
    pulsing.scale.multiplyScalar(36);
    scene.add( pulsing );
    /* END PULSING SHADER
    */

    /* CONFIG RENDERER
    */
    renderer = new THREE.WebGLRenderer( { antialias: false , preserveDrawingBuffer: true, alpha: true} );
    renderer.setSize( W, H );
    //renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    /* END RENDERER

    */
        // Load a scene with objects, lights and camera from a JSON file
    

    /* ADD LISTENERS
    */ 
    // rehandle for midi
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

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function ease( control, target, easing ){
    var dx = control-target;
    target += dx * easing;
    return target; 
}

var fade_in;
var fade_out;
function fadeIn(screen, interval){
    screen.material.opacity = 0;
    fade_in = setInterval(
        function(){ 
            screen.material.opacity += .05;
        },
    interval);
}
function fadeOut(screen, interval){
    //screen.material.opacity = 0;
    fade_out = setInterval(
        function(){ 
            screen.material.opacity -= .05;
        },
    interval);
}
/* END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now() * 0.0005;

    render( time );

}


function render( float ){


    var delta = clock.getDelta() * spawnerOptions.timeScale;

    // figure a better fallback method
    //screen0.visible = ;

    if (pad1.pressed || window.is1Down) {

        if(screen0.visible)
            fadeOut(screen0, 500/pad1.value);
        else
            fadeIn(screen0, 500/pad1.value);

        screen0.visible = !screen0.visible;
        pad1.pressed = false;
        window.is1Down = false;

    }
    // this seems bad or lazy
    if(screen0.material.opacity > .5)
        clearInterval(fade_in);
    if(screen0.material.opacity < 0)
        clearInterval(fade_out);

    console.log(screen0.material.opacity);

    screen1.visible = pad2.pressed || window.is2Down;
    screen2.visible = pad3.pressed || window.is3Down;

    //fix so nob doesn't stay always on
    if(knob1.turned){
        screen0.material.opacity = ease(knob1.value, screen0.material.opacity, .1);
        setTimeout(function(){ knob1.turned = false}, 2000); //lazy, but works
    }

    if(knob2.turned){
        screen1.material.opacity = ease(knob2.value, screen1.material.opacity, .1);
        setTimeout(function(){ knob2.turned = false}, 2000);
    }

    if(knob3.turned){
        screen2.material.opacity = ease(knob3.value, screen2.material.opacity, .1);
        setTimeout(function(){ knob3.turned = false}, 2000);
    }

    if(knob5.turned){
        var range = knob5.value*(pulse_options.max-pulse_options.min)+pulse_options.min;
        pulse_options.pulse = ease(range, pulse_options.pulse, .1)
    }
    
    if(knob6.turned){
        pulse_options.size = ease(knob6.value*100, pulse_options.size, .1)
        pulsing.scale.x = pulse_options.size;
        pulsing.scale.y = pulse_options.size;
        pulsing.scale.z = pulse_options.size;
    }    

    // quasar effect (add bool/knob control)
    if(key.C1.pressed){ 
        pulsing.rotation.y -= 20 * delta; 
    }
    if(key.C1SH.pressed){ 
        pulsing.rotation.y += 20 * delta; 
    }
    if(key.D1.pressed){ 
        pulsing.rotation.x -= 20 * delta; 
    }
    if(key.D1SH.pressed){ 
        pulsing.rotation.x += 20 * delta; 
    }

    // pulse effect (add bool to switch between sine and linear?)
    //pulsing.material.uniforms[ "c" ].value = (Math.sin(time * 3 ) / 25*PI) + PI/240;
    if (pulse == 1){
        pulsing.material.uniforms[ "c" ].value += pulse_options.pulse;
        if (pulsing.material.uniforms[ "c" ].value > .13)
            pulse = 0;
    }else{
        pulsing.material.uniforms[ "c" ].value -= pulse_options.pulse;
        if (pulsing.material.uniforms[ "c" ].value < -.01)
            pulse = 1;
    }

    //controls to modify options
    particleSystem.spawnParticle( options );

    // Inital expansion of particle system 
    /*if (explode == 1) {
        options.positionRandomness -= .5;
    }
    else{
        for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {


        }
        options.positionRandomness += .5;
        if (options.positionRandomness > 100)
            explode = 1;
    }*/ 
   
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

    /* START ANIMATION

    */
    // add switch statement based state machine?

    //olivia_light.position.y += 2 * delta;
    //pulsing.position.y = light2.position.y;

    if(olivia_light.position.y > 50){
        olivia_light.position.y = 0; 
    }

    tick += delta;

    particleSystem.update( tick );

    renderer.render( scene, camera );

}

init();
animate();
