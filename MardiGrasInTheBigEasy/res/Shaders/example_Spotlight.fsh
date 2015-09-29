varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

uniform vec2 position0;
uniform vec2 position1;
uniform vec2 position2;
uniform float lightSize;

void main()
{
    float darkness = 0.7;
    gl_FragColor = vec4(vec3(gl_FragColor.xyz), darkness);
    vec2 centerPos0 = gl_FragCoord.xy - vec2(position0.x, position0.y);
    //calculate light density
    float z0 = sqrt(lightSize*lightSize - centerPos0.x*centerPos0.x - centerPos0.y*centerPos0.y);
    z0 /= lightSize;
    if (length(centerPos0) < lightSize) {
        gl_FragColor.a = darkness - z0;
    }

    vec2 centerPos1 = gl_FragCoord.xy - vec2(position1.x, position1.y);
        //calculate light density
        float z1 = sqrt(lightSize*lightSize - centerPos1.x*centerPos1.x - centerPos1.y*centerPos1.y);
        z1 /= lightSize;
        if (length(centerPos1) < lightSize) {
            gl_FragColor.a = darkness - z1;
        }

        vec2 centerPos2 = gl_FragCoord.xy - vec2(position2.x, position2.y);
            //calculate light density
            float z2 = sqrt(lightSize*lightSize - centerPos2.x*centerPos2.x - centerPos2.y*centerPos2.y);
            z2 /= lightSize;
            if (length(centerPos2) < lightSize) {
                gl_FragColor.a = darkness - z2;
            }

}