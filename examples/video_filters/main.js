var img
var h = 50;
var video_1;

function preload() {
      //soundFormats('mp3', 'ogg');
      //money = loadSound('assets/money.mp3');
}

function setup(){
    //money.setVolume(0.5);
    //money.play();

    createCanvas(1200, 600);
    colorMode(HSB, 100);
    //img = loadImage('assets/incentivized_mesh_color_no_alpha.png');

    video_1 = createVideo('assets/sample2.webm')
    video_1.hide();
    video_1.loop();
}

function draw(){
    //clear();
    console.log(knob.one.value);
    h = knob.one.value*100;
    tint(h, 100, 100, 90);
    image(video_1, 0, 0);
    //background(img);
    /*h+=5;
    if(h >= 100){
       h = 0; 
    }*/
}

