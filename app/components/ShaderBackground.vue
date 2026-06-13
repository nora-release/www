<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    vec2 mouse = uMouse * 2.0 - 1.0;
    mouse.x *= uResolution.x / uResolution.y;
    float mouseInfluence = 1.0 - smoothstep(0.0, 1.5, length(p - mouse));

    float t = uTime * 0.15;
    float n1 = fbm(p * 0.8 + t * 0.5);
    float n2 = fbm(p * 1.2 - t * 0.3 + vec2(100.0));
    float n3 = fbm(p * 0.5 + vec2(n1, n2) * 0.5 + t * 0.2);

    float noise = n1 * 0.4 + n2 * 0.3 + n3 * 0.3;
    noise += mouseInfluence * 0.15;
    noise *= 1.0 - length(p) * 0.3;

    float intensity = smoothstep(-0.5, 1.0, noise) * 0.08;
    vec3 color = vec3(intensity);
    color.r += intensity * 0.08;
    color.g -= intensity * 0.02;
    color.b -= intensity * 0.03;

    gl_FragColor = vec4(color, 1.0);
  }
`

let cleanup: (() => void) | undefined

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
  })
  if (!gl) {
    return
  }

  const compileShader = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) {
      return null
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const vertex = compileShader(gl.VERTEX_SHADER, vertexShader)
  const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentShader)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) {
    return
  }

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )

  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uTime = gl.getUniformLocation(program, 'uTime')
  const uResolution = gl.getUniformLocation(program, 'uResolution')
  const uMouse = gl.getUniformLocation(program, 'uMouse')
  const mouse = { x: 0.5, y: 0.5 }
  const targetMouse = { x: 0.5, y: 0.5 }
  const startedAt = performance.now()
  let animationFrame = 0
  let frameTimer = 0
  let running = true

  const resize = () => {
    const rect = canvas.parentElement?.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect?.width || window.innerWidth))
    const height = Math.max(1, Math.round(rect?.height || window.innerHeight))
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    gl.viewport(0, 0, width, height)
  }

  const render = (timestamp: number) => {
    if (!running) {
      return
    }

    mouse.x += (targetMouse.x - mouse.x) * 0.05
    mouse.y += (targetMouse.y - mouse.y) * 0.05

    gl.uniform1f(uTime, (timestamp - startedAt) / 1000)
    gl.uniform2f(uResolution, canvas.width, canvas.height)
    gl.uniform2f(uMouse, mouse.x, mouse.y)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    frameTimer = window.setTimeout(() => {
      animationFrame = window.requestAnimationFrame(render)
    }, 1000 / 30)
  }

  const onMouseMove = (event: MouseEvent) => {
    targetMouse.x = event.clientX / window.innerWidth
    targetMouse.y = 1 - event.clientY / window.innerHeight
  }

  const onVisibilityChange = () => {
    running = !document.hidden
    if (running) {
      animationFrame = window.requestAnimationFrame(render)
    }
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('visibilitychange', onVisibilityChange)
  animationFrame = window.requestAnimationFrame(render)

  cleanup = () => {
    running = false
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.cancelAnimationFrame(animationFrame)
    window.clearTimeout(frameTimer)
    gl.deleteProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    gl.deleteBuffer(buffer)
  }
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <canvas ref="canvasRef" class="shader-canvas" aria-hidden="true" />
</template>

<style scoped>
.shader-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
