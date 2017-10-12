if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;
var h = $('#handle'),
    l = $('#container'),
    r = $('#controller'),
    w = $('body').width() - 18;
var olivia_sphere;
var olivia = {
        shape: undefined,
        light: undefined,
        pulse: undefined,
        pulse_inc: 0,
        level: 0,
        color: 0x99ceff,//0x00fff0,
        size: 1,
        height: 1
}

var adeymo = {
        shape: undefined,
        light: undefined,
        pulse: undefined,
        pulse_inc: 0,
        level: 0,
        color: 0xffff4d,
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
            color: randomColor({ luminosity: 'bright', hue: 'blue' }),
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
            color: randomColor({ luminosity: 'dark', hue: 'yellow' }),
            size: 1,
            width: 1
    };
}

var starSystem, particleSystem;
var starCount = 1200;
var star = [];
var explode=0;
var pulse=0;
var particle_options, spawnerOptions;
var clock = new THREE.Clock(); //use Date.now() instead?
var gui = new dat.GUI( { width: 350, autoPlace: false } );

var pulse_options; 

var PI = Math.PI;
var W = l.width(), H = window.innerHeight;

var video = [], videoImage = [], videoImageContext = [], videoTexture = [];
var vids=0;
var screen = [];

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

    loadVideo("media/cops.mp4", 0);
    //screen[0].position.y = -50;
    scene.add(screen[0]);

    loadVideo("media/partis.mp4", 1);
    //screen[1].position.y = -50;
    scene.add(screen[1]);

    /*loadVideo("media/bookstore1s.mp4", 2);
    screen[2].position.y = -50;
    scene.add(screen[2]);

    loadVideo("media/bookstore2s.mp4", 3);
    screen[3].position.y = -50;
    scene.add(screen[3]);*/

    /* END IMPORT
    */


    /* CREATE MAIN POINT LIGHT
    */
    pulse_options = {
        pace: .01, 
        min: .0005,
        max: .005,
    };

    olivia.shape = new THREE.SphereGeometry( 1, 64, 16 );
    olivia.light = new THREE.PointLight( 0x00fff0, 10, 50 );
    olivia.light.add( new THREE.Mesh( olivia.shape, new THREE.MeshBasicMaterial( { color: olivia.color } ) ) );
    scene.add( olivia.light );

    olivia.pulse = new THREE.Mesh( olivia.shape.clone(), pulseMaterial(olivia.color) );
    olivia.pulse.position = olivia.shape.position;
    olivia.pulse.scale.multiplyScalar(36);
    scene.add( olivia.pulse );

    adeymo.shape = new THREE.SphereGeometry( 1, 64, 16 );
    adeymo.light = new THREE.PointLight( adeymo.color, 10, 50 );
    adeymo.light.add( new THREE.Mesh( adeymo.shape, new THREE.MeshBasicMaterial( { color: adeymo.color } ) ) );
    adeymo.light.visible = false;
    scene.add( adeymo.light );

    adeymo.pulse = new THREE.Mesh( adeymo.shape.clone(), pulseMaterial(adeymo.color) );
    adeymo.pulse.position = adeymo.shape.position;
    adeymo.pulse.scale.multiplyScalar(36);
    adeymo.pulse.visible = false;
    scene.add( adeymo.pulse );

    for(var i = 0 ; i < 8 ; i++){
        bar[i].shape = new THREE.SphereGeometry( 1, 64, 16 );
        bar[i].light = new THREE.PointLight( adeymo.color, 10, 50 );
        bar[i].light.add( new THREE.Mesh( adeymo.shape, new THREE.MeshBasicMaterial( { color: bar[i].color } ) ) );
        bar[i].light.position.x = 20*i-70;
        bar[i].light.position.y = 70;
         bar[i].light.position.z = 5;
        bar[i].light.visible = false;
        scene.add( bar[i].light );

        /*bar[i].pulse = new THREE.Mesh( adeymo.shape.clone(), pulseMaterial(adeymo.color) );
        bar[i].pulse.position = adeymo.shape.position;
        bar[i].pulse.scale.multiplyScalar(36);
        bar[i].pulse.visible = false;
        scene.add( bar[i].pulse );*/
    }

    for(var i = 0 ; i < 8 ; i++){
        cal[i].shape = new THREE.SphereGeometry( 1, 64, 16 );
        cal[i].light = new THREE.PointLight( 0xff0f00, 10, 50 );
        cal[i].light.add( new THREE.Mesh( adeymo.shape, new THREE.MeshBasicMaterial( { color: cal[i].color } ) ) );
        cal[i].light.position.x = -120;
        cal[i].light.position.y = 20*i-70;
        cal[i].light.visible = false;
        scene.add( cal[i].light );

        /*bar[i].pulse = new THREE.Mesh( adeymo.shape.clone(), pulseMaterial(adeymo.color) );
        bar[i].pulse.position = adeymo.shape.position;
        bar[i].pulse.scale.multiplyScalar(36);
        bar[i].pulse.visible = false;
        scene.add( bar[i].pulse );*/
    }

    /* END MAIN POINT LIGHT
    */ 

    /* CREATE STAR SYSTEM
    */
    THREE.TextureLoader.crossOrigin = '';
    
    var starShape = new THREE.SphereGeometry( 1, 64, 16 );

    for (var p = 0; p < starCount; p++){ 
        // create a star of random color
        var select = Math.floor(Math.random()*3);
        if (select === 0){
            var colors = randomColor({ luminosity: 'bright', hue: 'blue' });
        }
        else if (select === 1){
            var colors = randomColor({ luminosity: 'bright', hue: 'yellow' });
        }
        else {
            var colors = randomColor({ luminosity: 'light', hue: 'red' });
        }
        console.log(select);
        
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
        if(radius > 120 && radius < 250) 
            scene.add( star[p] );
    }
    /* END STAR SYSTEM
    */

    /* CREATE PARTICLE SYSTEM
    */
    // make less cubical, alter origin? tie to another mesh?
    /*particleSystem = new THREE.GPUParticleSystem( {
        maxParticles: 2500000
    } );

    scene.add( particleSystem );*/

    // make particle_options controllable from midi
    /*particle_options = {
        position: new THREE.Vector3(),
        positionRandomness: 50,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0,
        color: olivia.color, //0xaa88ff,
        colorRandomness: .2,
        turbulence: 0,
        lifetime: .2,
        size: 30,
        sizeRandomness: 1
    };

    spawnerOptions = {
        spawnRate: 5000,
        horizontalSpeed: 0,
        verticalSpeed: 0,
        timeScale: .05,
    };

    gui.add( particle_options, "lifetime", .1, 10 );*/
    /* END PARTICLE SYSTEM
    */


    var f0 = gui.addFolder('pulsing')    
    gui.add( pulse_options, "pace", pulse_options.min, pulse_options.max ).listen();
    gui.add( olivia, "size", 0, 99 ).listen();
    gui.add( adeymo, "size", 0, 99 ).listen();

    videoControls(0);
    videoControls(1);
    //videoControls(2);
    //videoControls(3);

    /*var f1 = gui.addFolder('video1');
    f1.add( screen[0], "visible").listen();
    f1.add( screen[0].material, "opacity", 0, .99 ).listen();

    var f2 = gui.addFolder('video2');
    f2.add( screen[1], "visible").listen();
    f2.add( screen[1].material, "opacity", 0, 1 ).listen();

    var f3 = gui.addFolder('video3');
    f3.add( screen[2], "visible").listen();
    f3.add( screen[2].material, "opacity", 0, 1 ).listen();

    var f4 = gui.addFolder('video4');
    f4.add( screen[3], "visible").listen();
    f4.add( screen[3].material, "opacity", 0, 1 ).listen();
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

function screenSwitch(control, index){
    if (control.pressed || window.is1Down) {
        if(screen[index].visible){
            fadeOut(index, 1/control.velocity);
        }else{
            console.log(video[index]);
            video[index].play();
            fadeIn(screen[index], 1/control.velocity, .3);
            
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
    if(control.pressed && object.height < 200){
        object.light.visible = true;
        object.height += pressLength(control)*.001; 
    }
    object.light.scale.y = ease(object.height, object.light.scale.y, .005 );
}

function barDecay(control, object){
    if(control.pressed){
        object.light.visible = true;
        object.level -= pressLength(control)*.001; 
        
    }
    object.light.position.y = ease(object.level, object.light.position.y, .005 );
}

function calendarFormation(control, object){
    if(control.pressed && object.width < 400){
        object.light.visible = true;
        object.width += pressLength(control)*.001; 
        
    }
    object.light.scale.x = ease(object.width, object.light.scale.x, .005 );
}

function calendarRecede(control, object){
    if(control.pressed && object.width > 1){
        object.light.visible = true;
        object.width -= pressLength(control)*.001; 
        
    }
    object.light.scale.x = ease(object.width, object.light.scale.x, .005 );
}
/* END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
var breathe = true;
var barz = true;
var list = false;
knob.eht.value = 1;

function render( time ){

    //var delta = clock.getDelta() * spawnerOptions.timeScale;

    var p = Math.floor(Math.random() * starCount);
    star[p].visible = true;

    //lazy way of fadin in objects?
    if (scene.fog.density > .0002){
        scene.fog.density -= .0001;
    }

    // TODO: add range to ease func
    // knobs are are bad, need to be rethought 
    var fog_range = .02;
    fog_range = knob.eht.value*(.02-.0002)+.0002;
    scene.fog.density = ease(fog_range, scene.fog.density, .1)

    //fadeIn(star[p], 100, 1);

    // change screen numbering to match or switch to object?
    screenSwitch(pad.one, 0);
    screenSwitch(pad.two, 1);
    //screenSwitch(pad.thr, 2);
    //screenSwitch(pad.fur, 3);

    screenOpacity(knob.one, 0);
    screenOpacity(knob.two, 1);
    //screenOpacity(knob.thr, 2);
    //screenOpacity(knob.fur, 3);

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

    pulseAnimation(olivia);
    pulseAnimation(adeymo);

    if(breathe){
        if(octave1.D.pressed){
            //particle_options.color = olivia.color;
            olivia.light.visible = !olivia.light.visible; 
            olivia.pulse.visible = !olivia.pulse.visible;
            adeymo.light.visible = !adeymo.light.visible; 
            adeymo.pulse.visible = !adeymo.pulse.visible;
            octave1.D.pressed = false; 
        }
        if(octave1.D.pressed){    
            adeymo.light.visible = !adeymo.light.visible; 
            adeymo.pulse.visible = !adeymo.pulse.visible;
            octave1.E.pressed = false; 
        }    

        if(octave1.F.pressed){
            olivia.light.visible = true;
            olivia.pulse.visible = true;
            olivia.level += pressLength(octave1.F)*.001; 
        }

        if(octave1.Fsh.pressed){
            olivia.level -= pressLength(octave1.Fsh)*.001; 
        }
        olivia.light.position.y = ease(olivia.level, olivia.light.position.y, .01 );
        olivia.pulse.position.y = olivia.light.position.y;
        olivia.pulse.lookAt(camera.position);

        if(octave1.G.pressed){
            //particle_options.color = adeymo.color;
            adeymo.light.visible = true;
            adeymo.pulse.visible = true;
            adeymo.level += pressLength(octave1.G)*.001; 
        }
        if(octave1.Gsh.pressed){
            adeymo.level -= pressLength(octave1.Gsh)*.001; 
        }
        adeymo.light.position.y = ease(adeymo.level, adeymo.light.position.y, .01 );
        adeymo.pulse.position.y = adeymo.light.position.y;
        adeymo.pulse.lookAt(camera.position);

    }
    if(barz){
        /*if(octave1.A.pressed){ 
            olivia.height += pressLength(octave1.A)*.001; 
        }
        olivia.light.scale.y = ease(olivia.height, olivia.light.scale.y, .05 );
        olivia.pulse.scale.y = olivia.light.scale.y;

        if(octave1.B.pressed){ 
            adeymo.height += pressLength(octave1.B)*.001; 
        }
        adeymo.light.scale.y = ease(adeymo.height, adeymo.light.scale.y, .05 );
        adeymo.pulse.scale.y = adeymo.light.scale.y;
        */

        barFormation(octave2.C, bar[0]);
        barFormation(octave2.D, bar[1]);
        barFormation(octave2.E, bar[2]);
        barFormation(octave2.F, bar[3]);
        barFormation(octave2.G, bar[4]);
        barFormation(octave2.A, bar[5]);
        barFormation(octave2.B, bar[6]);
        barFormation(octave3.C, bar[7]);

        calendarFormation(octave3.D, cal[0]);
        calendarFormation(octave3.E, cal[1]);
        calendarFormation(octave3.F, cal[2]);
        calendarFormation(octave3.G, cal[3]);
        calendarFormation(octave3.A, cal[4]);
        calendarFormation(octave3.B, cal[5]);
        calendarFormation(octave4.C, cal[6]);
        calendarFormation(octave4.D, cal[7]);
        if(pad.fve.pressed){
            barz = false;
            list = true;
            pad.fve.pressed = false;
        }
        

    }
    if(list){

        barDecay(octave2.C, bar[0]);
        barDecay(octave2.D, bar[1]);
        barDecay(octave2.E, bar[2]);
        barDecay(octave2.F, bar[3]);
        barDecay(octave2.G, bar[4]);
        barDecay(octave2.A, bar[5]);
        barDecay(octave2.B, bar[6]);
        barDecay(octave3.C, bar[7]);

        calendarRecede(octave3.D, cal[0]);
        calendarRecede(octave3.E, cal[1]);
        calendarRecede(octave3.F, cal[2]);
        calendarRecede(octave3.G, cal[3]);
        calendarRecede(octave3.A, cal[4]);
        calendarRecede(octave3.B, cal[5]);
        calendarRecede(octave4.C, cal[6]);
        calendarRecede(octave4.D, cal[7]);


    }

    //controls to modify particle_options
    //particleSystem.spawnParticle( particle_options );
   
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

    //tick += delta;

    //particleSystem.update( tick );

    renderer.render( scene, camera );

}

init();
animate();
