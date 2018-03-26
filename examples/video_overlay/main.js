if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;

var clock = new THREE.Clock(); //use Date.now() instead?
//var gui = new dat.GUI( { width: 350, autoPlace: false } );

var pulse_options; 

var PI = Math.PI;
var W = window.innerWidth, H = window.innerHeight;

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

    midiController("akai");

    /* IMPORT VIDEOS HERE
    */ 
    // this could be better, return scene add, xyz positioning
    space = loadVideo("media/sample2.webm", 0);
    space.screen.position.y = 0;
    space.video.play();
    scene.add(space.screen);

    water1 = loadVideo("media/waters.mp4");
    water1.screen.position.y = 0;
    water1.video.play();
    water1.video.muted = false;
    scene.add(water1.screen);

    water2 = loadVideo("media/water1s.m4v");
    water2.screen.position.y = 0;
    water2.video.play();
    water2.video.muted = false;
    scene.add(water2.screen);

    air = loadVideo("media/air2.m4v");
    air.screen.position.y = 0;
    air.video.play();
    air.video.muted = false;
    scene.add(air.screen);

    strings = loadVideo("media/strings.mp4");
    strings.screen.position.y = 0;
    strings.video.play();
    strings.video.muted = false;
    console.log(strings.video);
    scene.add(strings.screen);

    /* END IMPORT
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
    //Mousetrap.bind('d', function() { console.log(strings.screen.position.rotation.x); } );
    /*
    gui.domElement.id = 'gui';

    controller.appendChild(gui.domElement);
    */

    /* END CONTROLS
    */

}

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
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
    screenSwitch(pad.one, space);
    screenSwitch(pad.two, water1);
    screenSwitch(pad.thr, water2);
    screenSwitch(pad.fur, air);
    screenSwitch(pad.fve, strings);

    screenOpacity(knob.one, space);
    screenOpacity(knob.two, water1);
    screenOpacity(knob.thr, water2);
    screenOpacity(knob.fur, air);
    screenOpacity(knob.fve, strings);

    strings.video.volume = knob.six.value;
    water1.video.volume = knob.svn.value;
    water2.video.volume = knob.eht.value;
  
    updateAllVideos();
    /* UPDATE VIDEO 
    */ 
    /*
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
    */
    /* END VIDEO UPDATE
    */

    renderer.render( scene, camera );

}

init();
animate();
