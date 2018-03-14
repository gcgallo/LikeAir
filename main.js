if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene, renderer, container, video, videoImage, videoImageContext, videoTexture, camera

function init() {

    scene = new THREE.Scene();
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);
    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('container');
    container.appendChild( renderer.domElement );

    createStream();

    video = document.getElementById( 'monitor' );
        
    // webcam = importVideo('monitor', 0);

    videoImage = document.getElementById( 'videoImage0' );
    videoImageContext = videoImage.getContext( '2d' );
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
                    
    var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
    var movieGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.position.set(0,50,0);
    scene.add(movieScreen);

    video.play();
                                            
    camera.position.set(0,150,300);
    camera.lookAt(movieScreen.position);

}


function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
function render( time ){

   
    /* UPDATE VIDEO 
    */ 
    // for (var i = 0; i < video.length ; i++){
    //     if ( video[i].readyState === video[i].HAVE_ENOUGH_DATA ) 
    //     {
    //         videoImageContext[i].drawImage( video[i], 0, 0, videoImage[i].width, videoImage[i].height );
    //         if ( videoTexture[i] ) 
    //             videoTexture[i].needsUpdate = true;
    //     }
    //     if( video[i].readyState === video[i].HAVE_ENOUGH_DATA ){
    //       videoTexture[i].needsUpdate = true;
    //     }
    // }
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

    renderer.render( scene, camera );

}

init();
animate();
