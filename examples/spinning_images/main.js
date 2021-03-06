if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, light1, tick = 0;
var geometry, material, mesh, particleSystem1, particleSystem2;
var options, spawnerOptions;
var clock = new THREE.Clock();
var PI = 3.14159; //replace with Math.Pi
var W = window.innerWidth, H = window.innerHeight;

var progress = document.getElementById( 'progress' );
var generating = false;
var time = 0;
//var capturer = new CCapture( { format: 'webm' , framerate: 30 } );

function init() {

    //var loader = new THREE.BinaryLoader();
    var loader = new THREE.JSONLoader();

    var container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x040306, 1, 1000 );
    scene.add( new THREE.AmbientLight( 0x00020 ) );

    //geometry = new THREE.CubeGeometry(200, 200, 200);
    geometry = new THREE.SphereGeometry(10, 30, 30 );
    material = new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  );
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    scene.add(mesh);

    var sphere = new THREE.SphereGeometry( 5, 64, 16 );
    /*
    light1 = new THREE.PointLight( 0xff0040, 10, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light1 );
    */

    light2 = new THREE.PointLight( 0x00fff0, 10, 50 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x00fff0 } ) ) );
    scene.add( light2 );

    THREE.ImageUtils.crossOrigin = '';
    var mapOverlay = THREE.ImageUtils.loadTexture("http://thecatapi.com/api/images/get?format=src&type=png")

    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: mapOverlay,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      // position values, -250 -> 250
      var pX = Math.random() * 500 - 250,
          pY = Math.random() * 500 - 250,
          pZ = Math.random() * 500 - 250,
          particle = new THREE.Vector3(pX, pY, pZ);

      // add it to the geometry
      particles.vertices.push(particle);
    }

    particleSystem1 = new THREE.Points(
        particles,
        pMaterial);

    scene.add(particleSystem1);
/*
    particleSystem2 = new THREE.GPUParticleSystem( {
        maxParticles: 250000
    } );

    scene.add( particleSystem2 );

    options = {
        position: new THREE.Vector3(),
        positionRandomness: .3,
        velocity: new THREE.Vector3(),
        velocityRandomness: .5,
        color: 0x00fff0, //0xaa88ff,
        colorRandomness: .2,
        turbulence: .5,
        lifetime: 2,
        size: 30,
        sizeRandomness: 1
    };

    spawnerOptions = {
        spawnRate: 15000,
        horizontalSpeed: 1.5,
        verticalSpeed: 1.33,
        timeScale: 1
    };*/

    
    /* import blender mesh
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

    moonGlow = new THREE.Mesh( sphere.clone(), customMaterial.clone() );
    moonGlow.position = light2.position;
    moonGlow.scale.multiplyScalar(7.2);
    scene.add( moonGlow );

    //renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
    //renderer.setPixelRatio( window.devicePixelRatio );
    //renderer.setSize( window.innerWidth, window.innerHeight );
    renderer = new THREE.WebGLRenderer( { antialias: false, preserveDrawingBuffer: true } );
    renderer.setSize( W, H );
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    //document.body.appendChild( renderer.domElement ); 
    container.appendChild( renderer.domElement );
    //renderer.gammaInput = true;
    //renderer.gammaOutput = true;
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;


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
    //if( mesh ) mesh.rotation.y -= 0.5 * delta;
    //moonGlow.rotation.y -= 1.5 * delta;

    mesh.position.x = Math.sin( time * 0.7 ) * 30;
    mesh.position.y = Math.cos( time * 0.5 ) * 40;
    mesh.position.z = Math.cos( time * 0.3 ) * 30;

    moonGlow.material.uniforms[ "c" ].value = (Math.sin(time * 3 ) / 25*PI) + PI/240;
    //console.log(moonGlow.material.uniforms[ "c" ].value);
    //if( moonGlow.material.uniforms[ "c" ].value < 0 ) 
    //moonGlow.material.uniforms[ "c" ].value = .1;
    
    moonGlow.position.y = light2.position.y;

    if(light2.position.y > 50){
        light2.position.y = 0; 
    }

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

init();
animate();
