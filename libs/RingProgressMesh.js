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

uniform float uTime;
varying vec2 vUv;

float hexagon(vec2 p, float r) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, sqrt(3.0)))), p.x) - r;
}

void main() {
  vec2 uv = vUv - 0.5;
  float t = uTime * 0.5;
  
  float edge = hexagon(uv, 0.4 + 0.05 * sin(t * 2.0));
  float glow = 0.02 / abs(edge);

  vec3 redNeon = vec3(1.0, 0.0, 0.2);
  vec3 blueNeon = vec3(0.0, 0.5, 1.0);
  vec3 neonColor = mix(redNeon, blueNeon, 0.5 + 0.5 * sin(t * 4.0));

  vec3 color = neonColor * glow;

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
