function importVideo(source, index){
    var videoElement = 'video' + index;
    var videoImageElement = 'videoImage' + index;
    var video = document.createElement( 'video' );
    video.id = videoElement
    video.src = source;
    video.load(); // must call after setting/changing source
    video.loop = true;
    video.muted = true;
    video.play();
    console.log(video);
    var videoImage = document.getElementById( videoImageElement );
    var videoImageContext = videoImage.getContext( '2d' );
    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    var videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    console.log(vids);
    console.log(videoTexture);
    vids++;
    return {
        video: video,
        videoImage: videoImage,
        videoImageContext: videoImageContext,
        videoTexture: videoTexture};
}

function createScreen(texture, index, position_x, position_y, position_z ){
    var movieMaterial = new THREE.MeshBasicMaterial( { 
        map: texture, 
        overdraw: true, 
        side:THREE.DoubleSide, 
        transparent: true, 
        opacity: 0} );
    // the geometry on which the movie will be displayed;
    //  movie image will be scaled to fit these dimensions.
    var movieGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.transparent = true;
    //movieScreen.opacity = 1;
    movieScreen.position.set(position_x, position_y, position_z);
    return movieScreen;
}