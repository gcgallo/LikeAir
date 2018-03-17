var video = [];
var videoImage = [];    
var videoImageContext = [];    
var videoTexture = [];    
var screen = [];
var index = 0;

// index correspondes to the statically created video canvas element listed in index.html
function loadVideo(source){
    var imported;
    if(source == 'monitor'){
    	imported = importWebcam(source, index);
    } else {
    	imported = importVideo(source, index);
    }
    video[index] = imported.video;    
    videoImage[index] = imported.videoImage;    
    videoImageContext[index] = imported.videoImageContext;    
    videoTexture[index] = imported.videoTexture;    
    screen[index] = createScreen(videoTexture[index], index, 0, 0, 0);
    screen[index].visible = true;
    index++;
    return {
        video: video[index-1],
        videoImage: videoImage[index-1],
        videoImageContext: videoImageContext[index-1],
        videoTexture: videoTexture[index-1],
	screen: screen[index-1],
        index: index-1}
}

function importWebcam(source, index){
    console.log("loading webcam");
    var videoElement = 'video' + index;
    var videoImageElement = 'videoImage' + index;
    video[index] = document.getElementById( source );
    console.log(video[index]);
    var videoImage = document.getElementById( videoImageElement );
    var videoImageContext = videoImage.getContext( '2d' );
    // background color if no video[index] present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    var videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    console.log(videoTexture);
    return {
        video: video[index],
        videoImage: videoImage,
        videoImageContext: videoImageContext,
        videoTexture: videoTexture};
}

function importVideo(source, index){
    var videoElement = 'video' + index;
    var videoImageElement = 'videoImage' + index;
    video[index] = document.createElement( 'video' );
    video[index].id = videoElement
    video[index].src = source;
    video[index].load(); // must call after setting/changing source
    video[index].loop = true;
    video[index].muted = true;
    video[index].pause();
    console.log(video[index]);
    var videoImage = document.getElementById( videoImageElement );
    var videoImageContext = videoImage.getContext( '2d' );
    // background color if no video[index] present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    var videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    console.log(videoTexture);
    return {
        video: video[index],
        videoImage: videoImage,
        videoImageContext: videoImageContext,
        videoTexture: videoTexture};
}

function createScreen(texture, index, position_x, position_y, position_z ){
    var movieMaterial = new THREE.MeshBasicMaterial( { 
        map: texture,
        //vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
        //fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        overdraw: true, 
        side:THREE.DoubleSide, 
        //transparent: true, 
        //opacity: 0
    } );
    // the geometry on which the movie will be displayed;
    //  movie image will be scaled to fit these dimensions.
    var W = window.innerWidth/2, H = window.innerHeight;
    var movieGeometry = new THREE.PlaneGeometry( 200, 300, 1, 1 );
    var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.transparent = true;
    //movieScreen.opacity = 1;
    movieScreen.position.set(position_x, position_y, position_z);
    return movieScreen;
}

function updateOneVideo(vid){
    if ( vid.video.readyState === vid.video.HAVE_ENOUGH_DATA ) 
    {
        vid.videoImageContext.drawImage( vid.video, 0, 0, vid.videoImage.width, vid.videoImage.height );
        if ( vid.videoTexture ){
            vid.videoTexture.needsUpdate = true;
	}
    }
    if( vid.video.readyState === vid.video.HAVE_ENOUGH_DATA ){
            vid.videoTexture.needsUpdate = true;
    }
}

function updateAllVideos(){
    for (var i = 0; i < video.length ; i++){
        if ( video[i].readyState === video[i].HAVE_ENOUGH_DATA ) 
        {
            videoImageContext[i].drawImage( video[i], 0, 0, videoImage[i].width, videoImage[i].height );
            if ( videoTexture[i] ){
                videoTexture[i].needsUpdate = true;
            }
        }
        if( video[i].readyState === video[i].HAVE_ENOUGH_DATA ){
            videoTexture[i].needsUpdate = true;
        }
    }

}

