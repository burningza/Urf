export const postProcessShader = `
#define SHADER_NAME post-process-shader

uniform float bloom;
uniform int mode;
uniform float time;

vec4 crtEffect(vec4 color, vec2 uv) {
    float scanline = sin(uv.y * 800.0 + time * 5.0) * 0.1;
    color.rgb -= scanline;
    return color;
}

vec4 nvgEffect(vec4 color, vec2 uv) {
    float green = (color.r + color.g + color.b) / 3.0;
    return vec4(0.0, green * 1.5, 0.0, color.a);
}

vec4 flirEffect(vec4 color, vec2 uv) {
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 heat = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), luminance);
    return vec4(heat, color.a);
}

vec4 urf_post_process_sampleColor(sampler2D texSrc, vec2 texSize, vec2 coordinate) {
    vec4 color = texture(texSrc, coordinate);
    
    if (mode == 1) color = crtEffect(color, coordinate);
    if (mode == 2) color = nvgEffect(color, coordinate);
    if (mode == 3) color = flirEffect(color, coordinate);
    
    return color * (1.0 + bloom);
}
`;
