(() => {
  // SideRays (React Bits) ported to vanilla WebGL — same GLSL shader, no React/ogl.
  // Renders an animated light-ray overlay clipped inside the hero figure.
  const fig = document.querySelector(".case-hero__media");
  if (!fig) return;

  const props = {
    speed: 2.5,
    rayColor1: "#EAB308",
    rayColor2: "#96c8ff",
    intensity: 1.2,
    spread: 2,
    origin: "top-right",
    tilt: 0,
    saturation: 1.4,
    blend: 0.75,
    falloff: 1.6,
    opacity: 0.7,
  };

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
      ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
      : [1, 1, 1];
  };
  const originToFlip = (o) =>
    o === "top-left" ? [1, 0] : o === "bottom-right" ? [0, 1] : o === "bottom-left" ? [1, 1] : [0, 0];

  const canvas = document.createElement("canvas");
  canvas.className = "hero-rays";
  canvas.setAttribute("aria-hidden", "true");

  let gl = null;
  try {
    gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
  } catch (e) {
    gl = null;
  }
  if (!gl) return;

  fig.appendChild(canvas);

  const vert = `attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const frag = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("hero-rays shader:", gl.getShaderInfoLog(s));
    }
    return s;
  };

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vert));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.remove();
    return;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const loc = (n) => gl.getUniformLocation(program, n);
  const u = {
    iTime: loc("iTime"),
    iResolution: loc("iResolution"),
  };

  // Static uniforms — set once from props.
  const [flipX, flipY] = originToFlip(props.origin);
  gl.uniform1f(loc("iSpeed"), props.speed);
  gl.uniform3fv(loc("iRayColor1"), hexToRgb(props.rayColor1));
  gl.uniform3fv(loc("iRayColor2"), hexToRgb(props.rayColor2));
  gl.uniform1f(loc("iIntensity"), props.intensity);
  gl.uniform1f(loc("iSpread"), props.spread);
  gl.uniform1f(loc("iFlipX"), flipX);
  gl.uniform1f(loc("iFlipY"), flipY);
  gl.uniform1f(loc("iTilt"), props.tilt);
  gl.uniform1f(loc("iSaturation"), props.saturation);
  gl.uniform1f(loc("iBlend"), props.blend);
  gl.uniform1f(loc("iFalloff"), props.falloff);
  gl.uniform1f(loc("iOpacity"), props.opacity);

  gl.clearColor(0, 0, 0, 0);

  const draw = (timeMs) => {
    gl.uniform1f(u.iTime, timeMs * 0.001);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = fig.clientWidth;
    const h = fig.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.iResolution, canvas.width, canvas.height);
    if (prefersReduced) draw(1600); // keep a static frame in sync on resize
  };

  resize();
  window.addEventListener("resize", resize);

  if (prefersReduced) {
    draw(1600); // one static frame, no animation
    return;
  }

  let rafId = null;
  let running = false;
  const loop = (t) => {
    if (!running) return;
    draw(t);
    rafId = requestAnimationFrame(loop);
  };
  const start = () => {
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(loop);
    }
  };
  const stop = () => {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  // Only animate while the hero is on screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? start() : stop()),
      { threshold: 0 }
    ).observe(fig);
  } else {
    start();
  }
})();
