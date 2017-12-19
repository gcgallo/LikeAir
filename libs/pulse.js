function pulseAnimation(object){
if (object.pulse_inc == 1){
    object.pulse.material.uniforms[ "c" ].value += pulse_options.pace;
    if (object.pulse.material.uniforms[ "c" ].value > .05)
        object.pulse_inc = 0;
    }else{
    object.pulse.material.uniforms[ "c" ].value -= pulse_options.pace;
    if (object.pulse.material.uniforms[ "c" ].value < -.2)
        object.pulse_inc = 1;
    }
}

function pulseMaterial(color){
    var pulseMaterial = new THREE.ShaderMaterial(
    { 
        uniforms: 
        { 
            "c":   { type: "f", value: .1 }, // intensity variables 
            "p":   { type: "f", value: 6 },
            pulseColor: { type: "c", value: new THREE.Color(color) },
            viewVector: { type: "v3", value: camera.position }
        },

        vertexShader: document.getElementById( 'vertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    } );
    return pulseMaterial 
}



