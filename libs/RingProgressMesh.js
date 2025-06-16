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

  // Hexagon ring edge and thickness
  float edge = hexagon(uv, 0.4);
  float thickness = 0.03;
  float glow = smoothstep(thickness, 0.0, abs(edge));

  // Calculate angle and animate rotation
  float angle = getAngle(uv) + t * 1.5;
  float segment = floor(angle / (TAU / 6.0)); // 6 segments

  // Neon colors: red and blue alternating
  vec3 redNeon = vec3(1.0, 0.0, 0.2);
  vec3 blueNeon = vec3(0.0, 0.5, 1.0);
  vec3 color = mod(segment, 2.0) < 1.0 ? redNeon : blueNeon;

  gl_FragColor = vec4(color, glow);
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
    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
  }
}

export { RingProgressMesh };