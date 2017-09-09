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

var video, videoImage, videoImageContext, videoTexture;


function init() {

    var container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x040306, 1, 1000 );
    scene.add( new THREE.AmbientLight( 0x00020 ) );
    var loader = new THREE.TextureLoader();

    /* VIDEO IMPORT (functionalize and generalize)
    */
    video = document.createElement( 'video' );
    video.src = "media/cops.mp4";
    video.load(); // must call after setting/changing source
    video.loop = true;
    video.play();
    
    videoImage = document.getElementById( 'videoImage' );
    videoImageContext = videoImage.getContext( '2d' );
    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    /* END VIDEO IMPORT
    */

    /* CREATE SCREEN OBJECT
    */    
    var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide, transparent: true, opacity: .5} );
    // the geometry on which the movie will be displayed;
    //      movie image will be scaled to fit these dimensions.
    var movieGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.transparent = true;
    movieScreen.opacity = .5;
    movieScreen.position.set(0,0,50);
    scene.add(movieScreen);
    /* END SCREEN OBJECT
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
        lifetime: 100,
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
    
    // add more controllable options?
    pulse_options = {
        pulse: .01
    };

    gui.add( pulse_options, "pulse", .005, .025 );

    pulsing = new THREE.Mesh( olivia.clone(), pulseMaterial.clone() );
    pulsing.position = olivia.position;
    pulsing.scale.multiplyScalar(36);
    scene.add( pulsing );
    /* END PULSING SHADER
    */

    /* CONFIG RENDERER
    */
    renderer = new THREE.WebGLRenderer( { antialias: false , preserveDrawingBuffer: true} );
    renderer.setSize( W, H );
    //renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    /* END RENDERER
    */

    /* ADD LISTENERS
    */ 
    // rehandle for midi
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener( 'resize', onWindowResize, false );

}

/*UTILTY FUNCTIONS
*/
function handleKeyDown(event) {
  if (event.keyCode === 66) { //66 is "b"
    window.isBDown = true;
  }
  if (event.keyCode === 66) { //66 is "b"
    window.isUDown = true;
  }
}

function handleKeyUp(event) {
  if (event.keyCode === 66) { //66 is "b"
    window.isBDown = false;
  }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

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

    if (window.isBDown) {

        pulsing.visible = !pulsing.visible;

    }
    // quasar effect (add bool/knob control)
    //pulsing.rotation.y -= 1.5 * delta; 

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

    // Inital expansion of particle system 
    if (explode == 1)
        options.positionRandomness -= .5;
    else{
        for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {

            particleSystem.spawnParticle( options );

        }
        options.positionRandomness += .5;
        if (options.positionRandomness > 100)
            explode = 1;
    } 
   
    /* UPDATE VIDEO 
    */ 
    if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
    {
        videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
        if ( videoTexture ) 
            videoTexture.needsUpdate = true;
    }
    if( video.readyState === video.HAVE_ENOUGH_DATA ){
      videoTexture.needsUpdate = true;
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
