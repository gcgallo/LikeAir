if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;
var olivia_sphere;
var geometry, material, mesh, particleSystem1, particleSystem2;
var explode=0;
var pulse=0;
var options, spawnerOptions;
var clock = new THREE.Clock();
var PI = 3.14159; //replace with Math.Pi
var W = window.innerWidth, H = window.innerHeight;
var gui = new dat.GUI( { width: 350 } );
var glow_options; 

var progress = document.getElementById( 'progress' );
var generating = false;
var time = 0;
var capturer = new CCapture( { format: 'webm' , framerate: 30 } );

function init() {

    var container = document.getElementById( 'container' );

    // JSON loader for exported meshes
    var loader = new THREE.JSONLoader();

    /* //import blender mesh
    var callback = function( geometry ) {
        object = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  )  );
        object.scale.x = object.scale.y = object.scale.z = 0.80;
        scene.add( object );
    };
    
    loader.load( "monkey.json", function ( obj ) {
        //add the loaded object to the scene
        object = new THREE.Mesh( obj, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  )  );
        object.scale.x = object.scale.y = object.scale.z = 2;
        scene.add( object );
    });*/

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x040306, 1, 1000 );
    scene.add( new THREE.AmbientLight( 0x00020 ) );

    //geometry = new THREE.CubeGeometry(200, 200, 200);

    //orbiting sphere
    geometry = new THREE.SphereGeometry(10, 30, 30 );
    material = new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  );
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    scene.add(mesh);

    //rising sphere
    var olivia = new THREE.SphereGeometry( 1, 64, 16 );
    olivia_light = new THREE.PointLight( 0x00fff0, 10, 50 );
    olivia_light.add( new THREE.Mesh( olivia, new THREE.MeshBasicMaterial( { color: 0x00fff0 } ) ) );
    scene.add( olivia_light );

    THREE.TextureLoader.crossOrigin = '';
    //var mapOverlay = THREE.ImageUtils.loadTexture("http://thecatapi.com/api/images/get?format=src&type=png")
    //var mapOverlay = THREE.ImageUtils.loadTexture("textures/perlin-512.png")

    var particleCount = 1800;
        /*particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 30,
            map: mapOverlay,
            blending: THREE.AdditiveBlending,
            transparent: true
        });*/
    
    var stars = new THREE.SphereGeometry( 1, 64, 16 );
    var loader = new THREE.TextureLoader();
    var mapOverlay = loader.load("http://thecatapi.com/api/images/get?format=src&type=png",
    function ( texture ) {
        // do something with the texture
        var material2 = new THREE.MeshBasicMaterial( {
            map: texture
         } );
    
        for (var p = 0; p < particleCount; p++){ 
        
            // create a particle with random
            // position values, -250 -> 250
            var pX = Math.random() * 500 - 250;
            var pY = Math.random() * 500 - 250;
            var pZ = Math.random() * 500 - 250;
              //particle = new THREE.Vector3(pX, pY, pZ);
            //var colors = randomColor({hue: 'blue', count: 18});
            var colors = randomColor({
               luminosity: 'light',
               hue: 'blue'
            });

            //var cats = new THREE.PointLight( 0x00fff0, 10, 50 );
            //cats.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x00fff0 } ) ) ); //new THREE.Mesh( sphere, mapOverlay ));
            cats = new THREE.PointLight( colors, 10, 50 );
            cats.add( new THREE.Mesh( stars, new THREE.MeshBasicMaterial( { color: colors} ) ) );
            //cats = new THREE.Mesh(sphere, material2);
            cats.position.x = pX;
            cats.position.y = pY;
            cats.position.z = pZ;
            scene.add( cats );
            // add it to the geometry
            //particles.vertices.push(particle);
        }
    })


    /*particleSystem1 = new THREE.Points(
        particles,
        pMaterial);

    scene.add(particleSystem1);*/

    particleSystem2 = new THREE.GPUParticleSystem( {
        maxParticles: 2500000
    } );

    scene.add( particleSystem2 );

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

    // create glowly stuff
    var customMaterial = new THREE.ShaderMaterial( 
    {
        uniforms: 
        { 
            "c":   { type: "f", value: .1 },
            "p":   { type: "f", value: 6 },
            glowColor: { type: "c", value: new THREE.Color(0x00fff0) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    }   );

    glow_options = {
        pulse: .01
    };

    gui.add( glow_options, "pulse", .005, .05 );

    moonGlow = new THREE.Mesh( olivia.clone(), customMaterial.clone() );
    moonGlow.position = olivia.position;
    moonGlow.scale.multiplyScalar(36);
    scene.add( moonGlow );

    //renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
    //renderer.setPixelRatio( window.devicePixelRatio );
    //renderer.setSize( window.innerWidth, window.innerHeight );
    renderer = new THREE.WebGLRenderer( { antialias: false, preserveDrawingBuffer: true } );
    renderer.setSize( W, H );
    //renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    //document.body.appendChild( renderer.domElement ); 
    container.appendChild( renderer.domElement );
    //renderer.gammaInput = true;
    //renderer.gammaOutput = true;
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    window.addEventListener( 'resize', onWindowResize, false );

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    time = Date.now() * 0.0005;

    render( time );

}

function render( float ){

    //controls.update();

    // experiment with code from the snippets menu here
    //camera.position.z = (Math.sin( Date.now() * 0.002 ) * 500) - 3000;
    //camera.position.y = Math.sin( Date.now() * 0.002 ) * 300;
    //camera.lookAt(mesh.position);
    //var delta = clock.getDelta();

    var delta = clock.getDelta() * spawnerOptions.timeScale;

    /*//Orbit pattern
    mesh.rotation.y -= 0.5 * delta;
    mesh.position.x = Math.sin( time * 0.7 ) * 30;
    mesh.position.y = Math.cos( time * 0.5 ) * 40;
    mesh.position.z = Math.cos( time * 0.3 ) * 30;
    */

    // quasar effect 
    //moonGlow.rotation.y -= 1.5 * delta; 

    // pulse effect
    //moonGlow.material.uniforms[ "c" ].value = (Math.sin(time * 3 ) / 25*PI) + PI/240;
    if (pulse == 1){
        moonGlow.material.uniforms[ "c" ].value += glow_options.pulse;
        if (moonGlow.material.uniforms[ "c" ].value > .13)
            pulse = 0;
    }else{
        moonGlow.material.uniforms[ "c" ].value -= glow_options.pulse;
        if (moonGlow.material.uniforms[ "c" ].value < -.01)
            pulse = 1;
    }
    console.log(moonGlow.material.uniforms[ "c" ].value)
    
    
    //light2.position.y += 2 * delta;
    //moonGlow.position.y = light2.position.y;

    if(olivia_light.position.y > 50){
        olivia_light.position.y = 0; 
    }

    //particleSystem1.rotation.y += 0.01;

    tick += delta;

    //options.position.x = Math.sin( tick * spawnerOptions.horizontalSpeed ) * 20;
    //options.position.y = Math.sin( tick * spawnerOptions.verticalSpeed ) * 10;
    //options.position.z = Math.sin( tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed ) * 5;
    
    if (explode == 1)
        options.positionRandomness -= .5;
    else{
        for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {

            // Yep, that's really it.   Spawning particles is super cheap, and once you spawn them, the rest of
            // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below

            particleSystem2.spawnParticle( options );

        }
        options.positionRandomness += .5;
        if (options.positionRandomness > 100)
            explode = 1;
    } 

    particleSystem2.update( tick );

    renderer.render( scene, camera );
    //effect.render( scene, camera );

}

function generateWEBM() {

    capturer.start();
    generating = true;

    var current = 0;
    var total = 400;

    var addFrame = function () {

        render( current / total );
        capturer.capture( renderer.domElement );

        current ++;

        if ( current < total ) {

            setTimeout( addFrame, 0 );

        } else {

            setTimeout( finish, 0 );

        }

        progress.value = current / total;

    }

    var finish = function () {

        // return buffer.slice( 0, gif.end() );

        capturer.stop();
        download(capturer.save(), "sample", "webm")
        generating = false;
        animate();

    }

    addFrame();

}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

init();
animate();
