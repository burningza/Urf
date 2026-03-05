export const postProcessShader = `\
uniform urf_post_processUniforms {
  float bloom;
  int mode;
  float time;
};

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

vec4 urf_post_process_filterColor(vec4 color, vec2 texSize, vec2 texCoord) {
    if (mode == 1) color = crtEffect(color, texCoord);
    if (mode == 2) color = nvgEffect(color, texCoord);
    if (mode == 3) color = flirEffect(color, texCoord);
    
    return color * (1.0 + bloom);
}

vec4 urf_post_process_filterColor_ext(vec4 color, vec2 texSize, vec2 texCoord) {
    return urf_post_process_filterColor(color, texSize, texCoord);
}
`;
