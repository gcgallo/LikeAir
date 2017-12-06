var container, stats;

var camera, scene, renderer, mixer;

var mouseX = 0, mouseY = 0;

var clock = new THREE.Clock();

var MODEL_SCALE = 10;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


init();
//animate();


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 4;

  // scene

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  scene.add( directionalLight );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  window.addEventListener( 'resize', onWindowResize, false );

  // BEGIN Clara.io JSON loader code
  var objectLoader = new THREE.JSONLoader();
  objectLoader.load("media/sittingBox.js", 

    /*function ( obj ) {
      object = new THREE.Mesh( obj, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  )  );
      object.scale.x = object.scale.y = object.scale.z = 2;
      scene.add( object );
      mixer = new THREE.AnimationMixer( object );
      mixer.clipAction( object.animations[ 0 ] ).play();
      animate();*/

    function ( object ) {

            object.traverse( function( node ) {

              if( node.material ) {

                  node.material.skinning = true;

              }

            });


            console.log(object);


            mesh = object.children[0];


            // MODEL_SCALE is defined in html. Used with monster
            if ( typeof MODEL_SCALE !== "undefined" ) {

              object.scale.x = object.scale.y = object.scale.z = MODEL_SCALE;

            }

            mixer = new THREE.AnimationMixer( );
            var action = mixer.clipAction( mesh.geometry.animations[ 0 ], mesh );
            action.play();
            
        
            scene.add( object );
            animate();
  } );
  // END Clara.io JSON loader code

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

  requestAnimationFrame( animate );
  mixer.update( clock.getDelta() );
  render();

}

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}