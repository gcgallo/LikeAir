if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, light1;
var geometry, material, mesh;
var clock = new THREE.Clock();
var PI = 3.14159
//var capturer = new CCapture( { format: 'gif', workersPath: 'js/' } );
var W = window.innerWidth, H = window.innerHeight;
var gif = new GIF({
  workers: 2,
  quality: 10,
  width: W, 
  height: H 
});

var progress = document.getElementById( 'progress' );
var generating = false;
var time = 0;


function init() {

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
    light1 = new THREE.PointLight( 0xff0040, 10, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0x00fff0, 10, 50 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x00fff0 } ) ) );
    scene.add( light2 );

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
    moonGlow.position = light1.position;
    moonGlow.scale.multiplyScalar(7.2);
    scene.add( moonGlow );

    //rendererGL.shadowMapEnabled = true;
/*
    for ( var i = 0; i < 5; i ++ ) {
        map = THREE.ImageUtils.loadTexture('../media/pulsar.png');
        // your mesh code (from the geometry GUI) goes here
        geometry = new THREE.SphereGeometry(121.78, 100, 100);
        material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xdcdcdc, map: map});
        mesh = new THREE.Mesh(geometry, material);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 1, 1 );
        mesh.position.x = 1000 - 500*i;
        mesh.position.y = 1000 - 500*i;
        mesh.position.z = 1000 - 500;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.castShadow = true;

        scene.add(mesh);

    }*/

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

                if ( generating === false) {

                    requestAnimationFrame( animate );

                }

                time = ( time + 0.002 ) % 1;

                render( time );

            }

function render( float ){

    //controls.update();

    // experiment with code from the snippets menu here
    //camera.position.z = (Math.sin( Date.now() * 0.002 ) * 500) - 3000;
    //camera.position.y = Math.sin( Date.now() * 0.002 ) * 300;
    //camera.lookAt(mesh.position);
    var delta = clock.getDelta();
    if( mesh ) mesh.rotation.y -= 0.5 * delta;
    moonGlow.rotation.y -= 1.5 * delta;

    mesh.position.x = Math.sin(time *  0.7) * 30;
    mesh.position.y = Math.cos( time * 0.5 ) * 40;
    mesh.position.z = Math.cos( time * 0.3 ) * 30;

    moonGlow.material.uniforms[ "c" ].value = (Math.sin(time * 3 ) / 25*PI) + PI/240;
    //console.log(moonGlow.material.uniforms[ "c" ].value);
    //if( moonGlow.material.uniforms[ "c" ].value < 0 ) 
    //moonGlow.material.uniforms[ "c" ].value = .1;
    
    light2.position.y += 0.5 * delta;
    //console.log(light2.position.y)
    if(light2.position.y > 30){
        light2.position.y = 0; 
    }

    renderer.render( scene, camera );
    //effect.render( scene, camera );


}

function generateGIF() {

    generating = true;

    var current = 0;
    var total = 50;

    var canvas = document.createElement( 'canvas' );
    canvas.width = renderer.domElement.width;
    canvas.height = renderer.domElement.height;

    var context = canvas.getContext( '2d' );

    var buffer = new Uint8Array( canvas.width * canvas.height * total * 5 );
    var gif = new GifWriter( buffer, canvas.width, canvas.height, { loop: 0 } );

    var pixels = new Uint8Array( canvas.width * canvas.height );

    var addFrame = function () {

        render( current / total );

        context.drawImage( renderer.domElement, 0, 0 );

        var data = context.getImageData( 0, 0, canvas.width, canvas.height ).data;

        var palette = [];

        for ( var j = 0, k = 0, jl = data.length; j < jl; j += 4, k ++ ) {

            var r = Math.floor( data[ j + 0 ] * 0.1 ) * 10;
            var g = Math.floor( data[ j + 1 ] * 0.1 ) * 10;
            var b = Math.floor( data[ j + 2 ] * 0.1 ) * 10;
            var color = r << 16 | g << 8 | b << 0;

            var index = palette.indexOf( color );

            if ( index === -1 ) {

                pixels[ k ] = palette.length;
                palette.push( color );

            } else {

                pixels[ k ] = index;

            }

        }

        // force palette to be power of 2

        var powof2 = 1;
        while ( powof2 < palette.length ) powof2 <<= 1;
        palette.length = powof2;

        gif.addFrame( 0, 0, canvas.width, canvas.height, pixels, { palette: new Uint32Array( palette ), delay: 5 } );

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

        var string = '';

        for ( var i = 0, l = gif.end(); i < l; i ++ ) {

            string += String.fromCharCode( buffer[ i ] )

        }

        var image = document.createElement( 'img' );
        image.src = 'data:image/gif;base64,' + btoa( string );
        document.body.appendChild( image );

        generating = false;
        animate();

    }

    addFrame();

}

init();
animate();
