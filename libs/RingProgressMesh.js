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

float hexagon(vec2 p, float r) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, sqrt(3.0)))), p.x) - r;
}

// Function to compute angle around center
float angle(vec2 p) {
  return atan(p.y, p.x);
}

void main() {
  vec2 uv = vUv - 0.5;
  float radius = 0.35;
  float edge = hexagon(uv, radius);
  float thickness = 0.03;
  float glow = smoothstep(thickness, 0.0, abs(edge)); // sharper, thicker outline

  // Calculate angle from center
  float ang = mod(angle(uv) + TAU, TAU); // 0 to 2*PI
  float speed = 0.5;
  float movingAng = mod(ang - uTime * speed, TAU);

  // Alternate red and blue every 1/6th of the circle
  float segment = floor((movingAng / TAU) * 6.0);
  vec3 color = (mod(segment, 2.0) < 1.0) ? vec3(0.0, 0.5, 1.0) : vec3(1.0, 0.0, 0.2); // blue or red

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
      transparent: true
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
