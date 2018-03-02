var img
var h = 50, s = 50, b = 50, a = 50;
var capture; 
var video_1;

function setup(){
    //money.setVolume(0.5);
    //money.play();

    createCanvas(1080, 720);
    colorMode(HSB, 100);

    capture = createCapture(VIDEO);
    capture.size(1200, 600);
    //capture.hide();

    //video_1 = createVideo('assets/sample2.webm')
    //video_1.hide();
    //video_1.loop();
}

function draw(){
    //clear();
    background(255);
    //console.log(knob.one.value);
    h = knob.one.value*100;
    s = knob.two.value*100;
    b = knob.thr.value*100;
    a = knob.fur.value*100;
    tint(h, s, b, a);
    //image(video_1, 0, 0);
    image(capture, 0, 0, 1080, 720); 
    //background(img);
    /*h+=5;
    if(h >= 100){
       h = 0; 
    }*/
}

