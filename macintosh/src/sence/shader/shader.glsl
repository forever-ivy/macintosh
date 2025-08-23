// A simple but physically based fog rendering, 
// with god rays and volumetric lighting.
// Move the mouse to rotate the camera.
// It's reminds me dune

// quality settings
#define AA 1 // antialiasing, set it to 2 if you have a fast computer
#define NUM_STEPS 32 // marching steps, higher -> better quality
#define DITHERING // dithering on the distance

// lighing settings
#define LIGHT_POS vec3(1.5)*rot(vec3(.5*iTime)) // position of the light
#define LIGHT_COLOR (3.*vec3(1,.65,.35)) // color of the light
#define VOLUME_ABSORBTION 1. // light absorbtion trough volume
#define VOLUME_DENSITY .6 // density of the volume
#define VOLUMETRIC_LIGHTING // enable god rays
#define SHADOWS_QUALITY 1.5 // quality of the shadows, higher -> lower quality but faster

#define PI 3.141592

// ACES tonemapping
vec3 ACES(vec3 x) { 
    float a = 2.51;
    float b =  .03;
    float c = 2.43;
    float d =  .59;
    float e =  .14;
    return (x*(a*x+b))/(x*(c*x+d)+e);
}

// 2d rotation function
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

// 3d rotation function
mat3 rot(vec3 a){
    float c = cos(a.x), s = sin(a.x);
    mat3 rx = mat3(1,0,0,0,c,-s,0,s,c);
    c = cos(a.y), s = sin(a.y);
    mat3 ry = mat3(c,0,-s,0,1,0,s,0,c);
    c = cos(a.z), s = sin(a.z);
    mat3 rz = mat3(c,-s,0,s,c,0,0,0,1);
    
    return rz * rx * ry;
}

// float random number
float hash(float n) {return fract(sin(n)*43758.5453123);}

// noise function by iq
float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.-2.*f);

    float n = p.x + p.y*157. + 113.*p.z;

    return mix(mix(mix(hash(n+  0.), hash(n+  1.),f.x),
                   mix(hash(n+157.), hash(n+158.),f.x),f.y),
               mix(mix(hash(n+113.), hash(n+114.),f.x),
                   mix(hash(n+270.), hash(n+271.),f.x),f.y),f.z);
}

// fractal noise
float fbm(vec3 p) {
    float f = 0.;
    f += .5*noise(p);
    f += .25*noise(2.*p);
    f += .125*noise(4.*p);
    f += .0625*noise(8.*p);
    return f;
}

// scene sdf (fractal)
// inspired by the mandelbox of loicvdb
// https://www.shadertoy.com/view/3t3GWH
float map(vec3 p) {
    mat3 r = rot(vec3(1.57)); // rotation
   
    p *= 6.;
    vec3 q = p;
    float m = 1.;
    
	for (int i=0; i<3; i++) {
    	p = clamp(p,-1.,1.) * 2. - p;
        float h = clamp(.25/dot(p, p), .25, 1.);
    	p *= h;
        m *= h;
        if(i<2) p *= r;
    	p = p*9. + q;
        m = m*9.+1.;
	}
    q = abs(p);
	return (max(q.x,max(q.y,q.z))-3.) / (m*6.);
}

// raymarching function
float intersect(vec3 ro, vec3 rd) {
    float t = 0.; // distance travelled
    for (int i=0; i<128 && t<8.; i++) {
        vec3 p = ro + rd*t; // current point
        
        float h = map(p); // distance to the scene
        if (h<.001) break; // we hit the surface
        
        t += h; // march
    }
    // return distance
    return t;
}

// normal estimation
vec3 calcNormal(vec3 p) {
    float h = map(p);
    const vec2 e = vec2(.0001,0); // epsilon
    
    return normalize(h - vec3(map(p-e.xyy),
                              map(p-e.yxy),
                              map(p-e.yyx)));
}

// shadow function
float shadow(vec3 ro, vec3 rd, float tmax) {
    for (float t=0.; t<tmax;) {
        vec3 p = ro + rd*t;
        float h = map(p)*SHADOWS_QUALITY;
        if (h<.001) return 0.;
        t += h;
    }
    return 1.;
}

// light function
// return the direction and the length of the light vector
vec4 getLight(vec3 ce, vec3 p) {
    vec3 lig = ce - p; // light vector
    float l = length(lig); // length of the light vector
    lig = normalize(lig); // normalize it
    return vec4(lig,l);
}

// volume rendering
// depth is the depth buffer (distance to the fractal)
vec4 renderVolume(vec3 ro, vec3 rd, float depth) {
    float tmax = min(8.,depth); // max distance
    
    vec4 sum = vec4(0,0,0,0); // color and opacity
    
    float s = tmax / float(NUM_STEPS); // step size
    float t = 0.; // distance travelled
    #ifdef DITHERING
    // dithering
    t += s*hash(gl_FragCoord.x*8315.9213/iResolution.x+gl_FragCoord.y*2942.5192/iResolution.y);
    #endif
    
    for (int i=0; i<NUM_STEPS; i++) { // raymarching loop
        vec3 p = ro + rd*t; // current point
        float h = VOLUME_DENSITY*fbm(4.*p); // density of the fog
        
        // ligthing
        vec4 lig = getLight(LIGHT_POS, p); // light direction + length of the light vector
        
        #ifdef VOLUMETRIC_LIGHTING
        float sha = shadow(p,lig.xyz,lig.w); // shadow of the fractal (god rays)
        #else
        float sha = 1.; // no shadow
        #endif
                  
        // coloring
        vec3 col = LIGHT_COLOR*sha / (lig.w*lig.w); // inverse square law
            
        sum.rgb += h*s*exp(sum.a)*col; // add the color to the final result
        sum.a += -h*s*VOLUME_ABSORBTION; // beer's law
        
        //if (sum.a<.01) break; // optimization
        t += s; // march
    }
    
    // output
    return sum;
}

// ambient occlusion function by me
float calcAO(vec3 p, vec3 n) { // point and normal
    float res = 1.; // result
    for (int i=0; i<5; i++) { // sampling 5 times
        float h = .1*float(i)/5.;
        res *= clamp(.5+.5*map(p + n*h)/h,0.,1.);
    }    
    return res;
}

// rendering
vec3 render(vec3 ro, vec3 rd) {
    vec3 col = vec3(0); // background
    
    float t = intersect(ro, rd); // distance
    if (t<8.) { // we hit the surface
        vec3 p = ro + rd*t; // hit point
        vec3 n = calcNormal(p); // normal of the surface
                
        vec4 lig = getLight(LIGHT_POS, p); // light direction + length of the light vector
                
        float dif = clamp(dot(n, lig.xyz),0.,1.); // diffuse light
        float sha = shadow(p+n*.002, lig.xyz, lig.w*.5); // shadow
        float bac = clamp(dot(n, -lig.xyz),0.,1.); // back/bounce light
        float occ = calcAO(p, n); // ambient occlusion
        
        // light surface interaction
        float lin = 0.;
        lin += dif*sha; // direct light
        lin += .1*occ*(1.+bac); // ambient light
        lin /= lig.w*lig.w; // inverse square law
        
        col = LIGHT_COLOR*lin;
    }
    
    // fog
    vec4 res = renderVolume(ro, rd, t);
    col = col*exp(res.a) + res.rgb; // mix the color with the fog color
    
    // output
    return col;
}

// camera function
mat3 setCamera(vec3 ro, vec3 ta) {
    vec3 w = normalize(ta - ro);
    vec3 u = normalize(cross(w, vec3(0,1,0)));
    vec3 v = cross(u, w);
    return mat3(u, v, w);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 tot = vec3(0);
    
    // antialiasing loops
    for (int m=0; m<AA; m++)
    for (int n=0; n<AA; n++) {
        vec2 off = vec2(m,n)/float(AA) - .5; // AA offset
        // pixel coordinates centered at the origin
        vec2 p = (fragCoord+off - .5*iResolution.xy) / iResolution.y;
        // normalized mouse coordinates
        vec2 m = (iMouse.xy - .5*iResolution.xy) / iResolution.y;

        vec3 ro = vec3(0,m.y*3.,3); // ray origin
        ro.xz *= rot(m.x*PI+.3*iTime); // camera rotation
        vec3 ta = vec3(0); // target
        mat3 ca = setCamera(ro, ta); // camera matrix

        vec3 rd = ca * normalize(vec3(p,1.5)); // ray direction

        // render
        vec3 col = render(ro, rd);
        tot += col;
    }
    tot /= float(AA*AA);
    
    // post processing
    tot = ACES(tot); // tonemapping
    tot = pow(tot, vec3(.4545)); // gamma correction
    tot = tot*.2+.8*tot*tot*(3.-2.*tot); // contrast
    
    // vignette
    vec2 q = fragCoord/iResolution.xy;
    tot *= .5+.5*pow(16. * q.x*q.y*(1.-q.x)*(1.-q.y), .1);
    
    fragColor = vec4(tot,1.0);
}