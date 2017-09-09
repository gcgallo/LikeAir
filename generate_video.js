var progress = document.getElementById( 'progress' );
var generating = false;
var time = 0;
var capturer = new CCapture( { format: 'webm' , framerate: 30 } );

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

