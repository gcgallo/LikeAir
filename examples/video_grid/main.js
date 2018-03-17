if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene, renderer, container, camera;
var webcam;

function init() {

    scene = new THREE.Scene();
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 60, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 10000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    //camera.position.set(0,150,400);

    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('container');
    container.appendChild( renderer.domElement );

    createStream(); // opens webcam stream

    // control size and placement of screen
    // make webcam large for full feedback effect 
    webcam = loadVideo('monitor');
    webcam.video.play();
    webcam.screen.position.x = -200;
    scene.add(webcam.screen);
    videoControls(webcam);
    Mousetrap.bind('1', function() { toggleVisible(webcam.screen) } );

    sample = loadVideo('media/sample2.webm');
    sample.video.play();
    sample.screen.position.x = 0;
    scene.add(sample.screen);
    videoControls(sample);
    Mousetrap.bind('2', function() { toggleVisible(sample.screen) } );
                                            
    air = loadVideo('media/air2.m4v');
    air.video.play();
    air.screen.position.x = 200;
    scene.add(air.screen);
    videoControls(air);
    Mousetrap.bind('3', function() { toggleVisible(air.screen) } );

    water = loadVideo('media/waters.mp4');
    water.video.play();
    water.screen.position.x = -200;
    water.screen.position.y = -200;
    scene.add(water.screen);
    videoControls(water);
    Mousetrap.bind('4', function() { toggleVisible(water.screen) } );

    strings = loadVideo('media/strings.mp4');
    strings.video.play();
    strings.screen.position.x = 0;
    strings.screen.position.y = -200;
    scene.add(strings.screen);
    videoControls(strings);
    Mousetrap.bind('5', function() { toggleVisible(strings.screen) } );

    water2 = loadVideo('media/water1s.m4v');
    water2.video.play();
    water2.screen.position.x = 200;
    water2.screen.position.y = -200;
    scene.add(water2.screen);
    videoControls(water2);
    Mousetrap.bind('6', function() { toggleVisible(water2.screen) } );

    camera.position.set(0, 0, 300);
    camera.lookAt(sample.screen.position);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

}


function animate() {

    requestAnimationFrame( animate );
    time = Date.now();
    render( time );

}
    
function render( time ){

    updateAllVideos();
    //updateOneVideo(webcam);
    //updateOneVideo(sample);

    renderer.render( scene, camera );

}

init();
animate();
