if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene, renderer, container, camera;
var webcam;

function init() {

    scene = new THREE.Scene();
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 60, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);

    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('container');
    container.appendChild( renderer.domElement );

    createStream(); // opens webcam stream

    webcam = loadVideo('monitor');
    webcam.video.play();
    webcam.screen.position.x = -200;
    scene.add(webcam.screen);
    videoControls(webcam);
    Mousetrap.bind('1', function() { toggleVisible(webcam.screen) } );

    sample = loadVideo('examples/video_overlay/media/sample2.webm');
    sample.video.play();
    sample.screen.position.x = 100;
    scene.add(sample.screen);
    videoControls(sample);
    Mousetrap.bind('2', function() { toggleVisible(sample.screen) } );
                                            
    camera.position.set(0,150,300);
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
