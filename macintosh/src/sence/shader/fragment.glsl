precision highp float;

// 从vertex shader传入的UV坐标
varying vec2 vUv;

// 统一变量（uniforms）
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform vec4 iMouse;
uniform sampler2D iChannel0;

// 常量定义
const float PI = 3.1415926;
const float roughness = 0.2;
const float intensity = 1.5;
const float light_width = 0.5;
const float light_height = 0.5;
const vec3 diff_col = vec3(1.);
const vec3 spec_col = vec3(1.);
const vec3 light_col = vec3(1.0) * intensity;
const vec3 light_pos = vec3(0., 0.3, 0.);
const vec3 light_normal = vec3(0., 0., 1.);
const float LUTSIZE = 8.0;
const float MATRIX_PARAM_OFFSET = 8.0;

// 全局变量
vec3 occ_pos = vec3(0.0, 0, 0.1);
float occ_width = 0.3;
float occ_height = 0.3;
float object_id = 0.;

// 对象ID定义
#define LIGHT 0.
#define SCENE 1.
#define OCCLUDER 2.
#define PROJECTED 3.

// 遮挡物投影和光源相交计算
bool occluderProjectAndIntersectLight(vec3 pos, out vec3 points[4]) {
    vec3 occMin = vec3(occ_pos.x - occ_width, occ_pos.y - occ_height, occ_pos.z);
    vec3 occMax = vec3(occ_pos.x + occ_width, occ_pos.y + occ_height, occ_pos.z);
    
    vec3 dir = normalize(occMin - pos);
    float t = length(occMin - pos);
    float ratio = (light_pos.z - pos.z)/(occ_pos.z - pos.z);
    occMin = pos + dir * ratio * t;
    
    dir = normalize(occMax - pos);
    t = length(occMax - pos);
    occMax = pos + dir * ratio * t;
    
    // 与光源相交
    vec2 lightMin = vec2(light_pos.x - light_width, light_pos.y - light_height);
    vec2 lightMax = vec2(light_pos.x + light_width, light_pos.y + light_height);
    
    float minx_intersect = max(occMin.x, lightMin.x);
    float maxx_intersect = min(occMax.x, lightMax.x);
    float miny_intersect = max(occMin.y, lightMin.y);
    float maxy_intersect = min(occMax.y, lightMax.y);
    
    if (minx_intersect <= maxx_intersect && miny_intersect <= maxy_intersect) {
        points[1] = vec3(minx_intersect, miny_intersect, light_pos.z);
        points[0] = vec3(maxx_intersect, miny_intersect, light_pos.z);
        points[3] = vec3(maxx_intersect, maxy_intersect, light_pos.z);
        points[2] = vec3(minx_intersect, maxy_intersect, light_pos.z);
        return true;
    } else {
        return false;
    }
}

// 矩形距离场函数
float rect(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

// 初始化矩形光源顶点
void init_rect_points(out vec3 points[4]) {
    vec3 right = normalize(cross(light_normal, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, light_normal));
    
    vec3 ex = light_width * right;
    vec3 ey = light_height * up;

    points[0] = light_pos - ex - ey;
    points[1] = light_pos + ex - ey;
    points[2] = light_pos + ex + ey;
    points[3] = light_pos - ex + ey;
}

// 球体距离场函数
float sphere(vec3 p, float r) {
    return length(p) - r;
}

// 场景距离场映射
float map(vec3 p) {
    float d0 = rect(p - light_pos, vec3(light_width, light_height, 0.));
    float d1 = abs(p.y + 0.5);
    float d3 = rect(p - occ_pos, vec3(occ_width, occ_height, 0.));
    
    float d = d0;
    object_id = LIGHT;
    
    if(d > d1) {
        d = d1;
        object_id = SCENE;
    }
    
    if (d > d3) {
        d = d3;
        object_id = OCCLUDER;
    }
    
    return d;
}

// 计算法向量
vec3 get_normal(vec3 p) {
    const vec2 e = vec2(0.002, 0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy), 
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

// 光线行进求交
float intersect(in vec3 ro, in vec3 rd) {
    float t = 0.01;
    for(int i = 0; i < 64; i++) {
        float c = map(ro + rd * t);
        if(c < 0.005) break;
        t += c;
        if(t > 100.0) return -1.0;
    }
    return t;
}

// LTC边缘积分
float IntegrateEdge(vec3 v1, vec3 v2) {
    float cosTheta = dot(v1, v2);
    float theta = acos(cosTheta);
    float res = cross(v1, v2).z * ((theta > 0.001) ? theta/sin(theta) : 1.0);
    return res;
}

// 四边形裁剪到地平线
void ClipQuadToHorizon(inout vec3 L[5], out int n) {
    // 检测裁剪配置
    int config = 0;
    if (L[0].z > 0.0) config += 1;
    if (L[1].z > 0.0) config += 2;
    if (L[2].z > 0.0) config += 4;
    if (L[3].z > 0.0) config += 8;

    // 裁剪
    n = 0;

    if (config == 0) {
        // 全部裁剪
    }
    else if (config == 1) { // V1 clip V2 V3 V4
        n = 3;
        L[1] = -L[1].z * L[0] + L[0].z * L[1];
        L[2] = -L[3].z * L[0] + L[0].z * L[3];
    }
    else if (config == 2) { // V2 clip V1 V3 V4
        n = 3;
        L[0] = -L[0].z * L[1] + L[1].z * L[0];
        L[2] = -L[2].z * L[1] + L[1].z * L[2];
    }
    else if (config == 3) { // V1 V2 clip V3 V4
        n = 4;
        L[2] = -L[2].z * L[1] + L[1].z * L[2];
        L[3] = -L[3].z * L[0] + L[0].z * L[3];
    }
    else if (config == 4) { // V3 clip V1 V2 V4
        n = 3;
        L[0] = -L[3].z * L[2] + L[2].z * L[3];
        L[1] = -L[1].z * L[2] + L[2].z * L[1];
    }
    else if (config == 5) { // V1 V3 clip V2 V4) impossible
        n = 0;
    }
    else if (config == 6) { // V2 V3 clip V1 V4
        n = 4;
        L[0] = -L[0].z * L[1] + L[1].z * L[0];
        L[3] = -L[3].z * L[2] + L[2].z * L[3];
    }
    else if (config == 7) { // V1 V2 V3 clip V4
        n = 5;
        L[4] = -L[3].z * L[0] + L[0].z * L[3];
        L[3] = -L[3].z * L[2] + L[2].z * L[3];
    }
    else if (config == 8) { // V4 clip V1 V2 V3
        n = 3;
        L[0] = -L[0].z * L[3] + L[3].z * L[0];
        L[1] = -L[2].z * L[3] + L[3].z * L[2];
        L[2] = L[3];
    }
    else if (config == 9) { // V1 V4 clip V2 V3
        n = 4;
        L[1] = -L[1].z * L[0] + L[0].z * L[1];
        L[2] = -L[2].z * L[3] + L[3].z * L[2];
    }
    else if (config == 10) { // V2 V4 clip V1 V3) impossible
        n = 0;
    }
    else if (config == 11) { // V1 V2 V4 clip V3
        n = 5;
        L[4] = L[3];
        L[3] = -L[2].z * L[3] + L[3].z * L[2];
        L[2] = -L[2].z * L[1] + L[1].z * L[2];
    }
    else if (config == 12) { // V3 V4 clip V1 V2
        n = 4;
        L[1] = -L[1].z * L[2] + L[2].z * L[1];
        L[0] = -L[0].z * L[3] + L[3].z * L[0];
    }
    else if (config == 13) { // V1 V3 V4 clip V2
        n = 5;
        L[4] = L[3];
        L[3] = L[2];
        L[2] = -L[1].z * L[2] + L[2].z * L[1];
        L[1] = -L[1].z * L[0] + L[0].z * L[1];
    }
    else if (config == 14) { // V2 V3 V4 clip V1
        n = 5;
        L[4] = -L[0].z * L[3] + L[3].z * L[0];
        L[0] = -L[0].z * L[1] + L[1].z * L[0];
    }
    else if (config == 15) { // V1 V2 V3 V4
        n = 4;
    }
    
    if (n == 3)
        L[3] = L[0];
    if (n == 4)
        L[4] = L[0];
}

// LTC评估函数
vec3 LTC_Evaluate(vec3 N, vec3 V, vec3 P, mat3 Minv, vec3 points[4]) {
    // 构建围绕N的正交基
    vec3 T1, T2;
    T1 = normalize(V - N * dot(V, N));
    T2 = cross(N, T1);

    // 在(T1, T2, N)基中旋转区域光
    Minv = Minv * transpose(mat3(T1, T2, N));

    // 多边形（为裁剪分配5个顶点）
    vec3 L[5];
    L[0] = Minv * (points[0] - P);
    L[1] = Minv * (points[1] - P);
    L[2] = Minv * (points[2] - P);
    L[3] = Minv * (points[3] - P);

    int n = 0;
    // 积分假设在上半球
    // 所以我们需要裁剪视锥，裁剪最多会添加1条边
    ClipQuadToHorizon(L, n);
    
    if (n == 0)
        return vec3(0, 0, 0);

    // 投影到球面
    L[0] = normalize(L[0]);
    L[1] = normalize(L[1]);
    L[2] = normalize(L[2]);
    L[3] = normalize(L[3]);
    L[4] = normalize(L[4]);

    // 对每条边进行积分
    float sum = 0.0;

    sum += IntegrateEdge(L[0], L[1]);
    sum += IntegrateEdge(L[1], L[2]);
    sum += IntegrateEdge(L[2], L[3]);
    if (n >= 4)
        sum += IntegrateEdge(L[3], L[4]);
    if (n == 5)
        sum += IntegrateEdge(L[4], L[0]);

    sum = max(0.0, sum);

    vec3 Lo_i = vec3(sum, sum, sum);

    return Lo_i;
}

// 主函数
void main() {
    // 将vUv转换为fragCoord格式
    vec2 fragCoord = vUv * iResolution.xy;
    
    float time = mod(iTime, 8.) * 0.125 * 3.1415926535 * 2.;
    occ_width = light_width * (iMouse.x/iResolution.x * 2.0 + 0.4);
    occ_height = light_height * (iMouse.y/iResolution.y * 2.0 + 0.4);
    occ_pos = vec3(sin(time) * 0.5, -0.5 + occ_height, cos(time) * 0.5 + 0.5);
    
    vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * q;
    p.x *= iResolution.x/iResolution.y;
  
    vec3 lookat = vec3(0.0, -0.5 * light_height, 0.);
    vec3 ro = vec3(1.8, light_height, 2.2);
    
    vec3 forward = normalize(lookat - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, forward));
    
    vec3 rd = normalize(p.x * right + p.y * up + 2. * forward);
    
    vec3 points[4];
    
    // 设置矩形光源的四个顶点
    init_rect_points(points);

    float t = intersect(ro, rd);
    vec3 col = vec3(0.);
    
    if(t > -0.5) {
        col = vec3(1.0);
        
        if (object_id == OCCLUDER) {
            col = vec3(0.0);
        }
        if (object_id == PROJECTED) {
            col = vec3(0.5, 0., 0.);
        }
        else if(object_id == SCENE) {
            vec3 pos = ro + rd * t;

            vec3 N = get_normal(pos);
            vec3 V = -rd;

            float theta = acos(dot(N, V));
            vec2 uv = vec2(roughness, theta/(0.5*PI)) * float(LUTSIZE-1.);
            
            // 获得正确插值的偏移
            uv += vec2(0.5, 0.5);
            
            vec4 params = texture2D(iChannel0, (uv + vec2(MATRIX_PARAM_OFFSET, 0.0))/iChannelResolution[0].xy);
           
            // 逆变换矩阵
            mat3 Minv = mat3(
                vec3(1,        0,      params.y),
                vec3(0,     params.z,   0),
                vec3(params.w,   0,      params.x)
            );

            vec3 spec = LTC_Evaluate(N, V, pos, Minv, points);
            vec3 diff = LTC_Evaluate(N, V, pos, mat3(1), points);
            
            col = vec3(0);
            // 使用LTC评估遮挡阴影
            if (dot(pos - occ_pos, light_normal) > 0.0) {
                vec3 intersections[4];
                if (occluderProjectAndIntersectLight(pos, intersections)) {
                    spec -= LTC_Evaluate(N, V, pos, Minv, intersections);
                    diff -= LTC_Evaluate(N, V, pos, mat3(1), intersections);
                }
            }

            spec *= texture2D(iChannel0, uv/iChannelResolution[0].xy).x;
            col += light_col * (spec_col * spec + diff_col * diff);
            col /= 2.0 * PI;
        }
    }
    
    col = pow(clamp(col, 0.0, 1.0), vec3(0.45));
    col *= pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.1);
    
    gl_FragColor = vec4(col, 1.0);
}