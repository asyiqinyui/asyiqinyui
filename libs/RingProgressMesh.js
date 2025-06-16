import { Mesh, PlaneBufferGeometry, ShaderMaterial, Clock } from './three/three.module.js';

const vshader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fshader = `
#define PI 3.14159265359
#define TAU 6.28318530718

uniform float uTime;
varying vec2 vUv;

// Hexagon shape
float hexagon(vec2 p, float r) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, sqrt(3.0)))), p.x) - r;
}

// Get angle around center
float getAngle(vec2 p) {
  return mod(atan(p.y, p.x) + TAU, TAU);
}

void main() {
  vec2 uv = vUv - 0.5;
  float t = uTime;

  // Make hexagon thicker by scaling UV
  uv *= 1.8;

  // Hexagon ring edge and thickness
  float outer = hexagon(uv, 0.5);
  float inner = hexagon(uv, 0.35);
  float ring = smoothstep(0.02, 0.0, abs(outer)) * (1.0 - smoothstep(0.02, 0.0, abs(inner)));

  // Neon glow using inverse edge distance
  float glow = 0.04 / (abs(outer) + 0.005) + 0.02 / (abs(inner) + 0.005);

  // Alternating segment colors
  float angle = getAngle(uv) + t * 2.0; // spin animation
  float segment = floor(angle / (TAU / 6.0)); // 6 segments
  vec3 redNeon = vec3(1.0, 0.0, 0.3);
  vec3 blueNeon = vec3(0.0, 0.6, 1.0);
  vec3 color = mod(segment, 2.0) < 1.0 ? redNeon : blueNeon;

  // Apply color with glow and ring mask
  gl_FragColor = vec4(color * (ring + glow), ring + glow);
}
`;

class RingProgressMesh extends Mesh {
  constructor(scale = 1) {
    super();

    this.clock = new Clock();

    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
      },
      vertexShader: vshader,
      fragmentShader: fshader,
      transparent: true,
    });

    this.geometry.dispose();
    this.geometry = new PlaneBufferGeometry();
    this.scale.set(scale, scale, scale);
  }

  update() {
    const elapsed = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = elapsed;
    this.rotation.z = elapsed * 1.2; // spinning the mesh
  }
}

export { RingProgressMesh };