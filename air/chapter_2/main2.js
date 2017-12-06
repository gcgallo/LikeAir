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

var video = [], videoImage = [], videoImageContext = [], videoTexture = [];
var vids=0;
var screen = [];

var mixer, loader;

var eyeball;

function init() {

    var container = document.getElementById( 'container' );
    var controller = document.getElementById('controller');

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0xffffff ) );
    scene.fog = new THREE.FogExp2( 0x00000, 0.02 );

    THREE.TextureLoader.crossOrigin = '';

    var geometry = new THREE.PlaneGeometry(500,500);
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('textures/fall.jpg',THREE.SphericalRefractionMapping) } );
    var eyeball = new THREE.Mesh( geometry, material );
    //eyeball.rotation.x = Math.PI/2;
    eyeball.overdraw = true;
    eyeball.castShadow = true;
    scene.add( eyeball );
    
       
    
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

/*END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
var breathe = true;
var barz = false;
var list = false;
knob.eht.value = 1;

function render( time ){

    //var delta = clock.getDelta() * spawnerOptions.timeScale;

    //lazy way of fadin in objects?
    //if (scene.fog.density > .0002){
    //    scene.fog.density -= .0001;
    //}

    // TODO: add range to ease func
    // knobs are are bad, need to be rethought 
    var fog_range = .05;
    fog_range = knob.eht.value*(.05-.0002)+.0002;
    scene.fog.density = ease(fog_range, scene.fog.density, .1)

    //fadeIn(star[p], 100, 1);

    // change screen numbering to match or switch to object?
   

    renderer.render( scene, camera );

}

init();
animate();
