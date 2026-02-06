import React, { useRef, useEffect, useCallback } from 'react';

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

interface FluidCanvasProps {
  className?: string;
  colors?: string[];
  intensity?: number;
  curl?: number;
  pressure?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
}

const FluidCanvas: React.FC<FluidCanvasProps> = ({
  className = '',
  colors = ['#ff0000', '#ff3333', '#cc0000', '#ff6666', '#990000'],
  intensity = 0.5,
  curl = 30,
  pressure = 0.8,
  densityDissipation = 0.97,
  velocityDissipation = 0.98,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<Pointer>({
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 1, g: 0, b: 0 },
  });
  const splatStackRef = useRef<{ x: number; y: number; dx: number; dy: number; color: { r: number; g: number; b: number } }[]>([]);
  const animationRef = useRef<number>();
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programsRef = useRef<any>({});
  const fboRef = useRef<any>({});

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 0, b: 0 };
  };

  const getRandomColor = useCallback(() => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return hexToRgb(color);
  }, [colors]);

  const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) => {
    const program = gl.createProgram();
    if (!program) return null;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  };

  const createFBO = (gl: WebGLRenderingContext, w: number, h: number, internalFormat: number, format: number, type: number, filter: number) => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      attach: (id: number) => {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  };

  const createDoubleFBO = (gl: WebGLRenderingContext, w: number, h: number, internalFormat: number, format: number, type: number, filter: number) => {
    let fbo1 = createFBO(gl, w, h, internalFormat, format, type, filter);
    let fbo2 = createFBO(gl, w, h, internalFormat, format, type, filter);

    return {
      width: w,
      height: h,
      texelSizeX: 1.0 / w,
      texelSizeY: 1.0 / h,
      get read() { return fbo1; },
      set read(value) { fbo1 = value; },
      get write() { return fbo2; },
      set write(value) { fbo2 = value; },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) return;
    glRef.current = gl;

    // Enable extensions
    gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_float_linear');

    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a * 0.95);
      }
    `;

    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec3 result = dissipation * texture2D(uSource, coord).xyz;
        float decay = 1.0 + dt * 0.1;
        gl_FragColor = vec4(result / decay, 1.0);
      }
    `;

    const divergenceShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const clearShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `;

    // Create programs
    const programs: any = {};
    programs.display = createProgram(gl, baseVertexShader, displayShader);
    programs.splat = createProgram(gl, baseVertexShader, splatShader);
    programs.advection = createProgram(gl, baseVertexShader, advectionShader);
    programs.divergence = createProgram(gl, baseVertexShader, divergenceShader);
    programs.curl = createProgram(gl, baseVertexShader, curlShader);
    programs.vorticity = createProgram(gl, baseVertexShader, vorticityShader);
    programs.pressure = createProgram(gl, baseVertexShader, pressureShader);
    programs.gradientSubtract = createProgram(gl, baseVertexShader, gradientSubtractShader);
    programs.clear = createProgram(gl, baseVertexShader, clearShader);

    programsRef.current = programs;

    // Create vertex buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Initialize FBOs
    const resizeCanvas = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const simRes = 128;
      const dyeRes = 512;
      const simWidth = simRes;
      const simHeight = Math.round(simRes * height / width);
      const dyeWidth = dyeRes;
      const dyeHeight = Math.round(dyeRes * height / width);

      const texType = gl.FLOAT;

      fboRef.current.dye = createDoubleFBO(gl, dyeWidth, dyeHeight, gl.RGBA, gl.RGBA, texType, gl.LINEAR);
      fboRef.current.velocity = createDoubleFBO(gl, simWidth, simHeight, gl.RGBA, gl.RGBA, texType, gl.LINEAR);
      fboRef.current.divergence = createFBO(gl, simWidth, simHeight, gl.RGBA, gl.RGBA, texType, gl.NEAREST);
      fboRef.current.curl = createFBO(gl, simWidth, simHeight, gl.RGBA, gl.RGBA, texType, gl.NEAREST);
      fboRef.current.pressure = createDoubleFBO(gl, simWidth, simHeight, gl.RGBA, gl.RGBA, texType, gl.NEAREST);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    let lastTime = Date.now();
    const update = () => {
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      if (!glRef.current || !fboRef.current.dye) {
        animationRef.current = requestAnimationFrame(update);
        return;
      }

      const gl = glRef.current;
      const { dye, velocity, divergence, curl: curlFbo, pressure: pressureFbo } = fboRef.current;

      // Process splats
      while (splatStackRef.current.length > 0) {
        const splat = splatStackRef.current.pop()!;
        
        // Splat velocity
        gl.useProgram(programs.splat);
        gl.uniform1i(gl.getUniformLocation(programs.splat, 'uTarget'), velocity.read.attach(0));
        gl.uniform1f(gl.getUniformLocation(programs.splat, 'aspectRatio'), canvas.width / canvas.height);
        gl.uniform2f(gl.getUniformLocation(programs.splat, 'point'), splat.x, splat.y);
        gl.uniform3f(gl.getUniformLocation(programs.splat, 'color'), splat.dx * intensity * 10, splat.dy * intensity * 10, 0);
        gl.uniform1f(gl.getUniformLocation(programs.splat, 'radius'), 0.0004);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, velocity.width, velocity.height);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        velocity.swap();

        // Splat dye
        gl.uniform1i(gl.getUniformLocation(programs.splat, 'uTarget'), dye.read.attach(0));
        gl.uniform3f(gl.getUniformLocation(programs.splat, 'color'), splat.color.r * 0.5, splat.color.g * 0.5, splat.color.b * 0.5);
        gl.uniform1f(gl.getUniformLocation(programs.splat, 'radius'), 0.005);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
        gl.viewport(0, 0, dye.width, dye.height);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        dye.swap();
      }

      // Curl
      gl.useProgram(programs.curl);
      gl.uniform2f(gl.getUniformLocation(programs.curl, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.curl, 'uVelocity'), velocity.read.attach(0));
      gl.bindFramebuffer(gl.FRAMEBUFFER, curlFbo.fbo);
      gl.viewport(0, 0, curlFbo.width, curlFbo.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      // Vorticity
      gl.useProgram(programs.vorticity);
      gl.uniform2f(gl.getUniformLocation(programs.vorticity, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.vorticity, 'uVelocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.vorticity, 'uCurl'), curlFbo.attach(1));
      gl.uniform1f(gl.getUniformLocation(programs.vorticity, 'curl'), curl);
      gl.uniform1f(gl.getUniformLocation(programs.vorticity, 'dt'), dt);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.viewport(0, 0, velocity.width, velocity.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      // Divergence
      gl.useProgram(programs.divergence);
      gl.uniform2f(gl.getUniformLocation(programs.divergence, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.divergence, 'uVelocity'), velocity.read.attach(0));
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.viewport(0, 0, divergence.width, divergence.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      // Clear pressure
      gl.useProgram(programs.clear);
      gl.uniform1i(gl.getUniformLocation(programs.clear, 'uTexture'), pressureFbo.read.attach(0));
      gl.uniform1f(gl.getUniformLocation(programs.clear, 'value'), pressure);
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressureFbo.write.fbo);
      gl.viewport(0, 0, pressureFbo.width, pressureFbo.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      pressureFbo.swap();

      // Pressure iterations
      gl.useProgram(programs.pressure);
      gl.uniform2f(gl.getUniformLocation(programs.pressure, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.pressure, 'uDivergence'), divergence.attach(0));
      for (let i = 0; i < 20; i++) {
        gl.uniform1i(gl.getUniformLocation(programs.pressure, 'uPressure'), pressureFbo.read.attach(1));
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressureFbo.write.fbo);
        gl.viewport(0, 0, pressureFbo.width, pressureFbo.height);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        pressureFbo.swap();
      }

      // Gradient subtract
      gl.useProgram(programs.gradientSubtract);
      gl.uniform2f(gl.getUniformLocation(programs.gradientSubtract, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.gradientSubtract, 'uPressure'), pressureFbo.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.gradientSubtract, 'uVelocity'), velocity.read.attach(1));
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.viewport(0, 0, velocity.width, velocity.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      // Advect velocity
      gl.useProgram(programs.advection);
      gl.uniform2f(gl.getUniformLocation(programs.advection, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uVelocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uSource'), velocity.read.attach(0));
      gl.uniform1f(gl.getUniformLocation(programs.advection, 'dt'), dt);
      gl.uniform1f(gl.getUniformLocation(programs.advection, 'dissipation'), velocityDissipation);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.viewport(0, 0, velocity.width, velocity.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      // Advect dye
      gl.uniform2f(gl.getUniformLocation(programs.advection, 'texelSize'), dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uVelocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uSource'), dye.read.attach(1));
      gl.uniform1f(gl.getUniformLocation(programs.advection, 'dissipation'), densityDissipation);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
      gl.viewport(0, 0, dye.width, dye.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      dye.swap();

      // Display
      gl.useProgram(programs.display);
      gl.uniform1i(gl.getUniformLocation(programs.display, 'uTexture'), dye.read.attach(0));
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      animationRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, curl, pressure, densityDissipation, velocityDissipation]);

  // Mouse handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPointerPosition = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getPointerPosition(e);
      pointerRef.current.down = true;
      pointerRef.current.moved = false;
      pointerRef.current.texcoordX = pos.x;
      pointerRef.current.texcoordY = pos.y;
      pointerRef.current.prevTexcoordX = pos.x;
      pointerRef.current.prevTexcoordY = pos.y;
      pointerRef.current.color = getRandomColor();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getPointerPosition(e);
      
      if (pointerRef.current.down) {
        pointerRef.current.prevTexcoordX = pointerRef.current.texcoordX;
        pointerRef.current.prevTexcoordY = pointerRef.current.texcoordY;
        pointerRef.current.texcoordX = pos.x;
        pointerRef.current.texcoordY = pos.y;
        pointerRef.current.deltaX = pos.x - pointerRef.current.prevTexcoordX;
        pointerRef.current.deltaY = pos.y - pointerRef.current.prevTexcoordY;
        pointerRef.current.moved = Math.abs(pointerRef.current.deltaX) > 0 || Math.abs(pointerRef.current.deltaY) > 0;

        if (pointerRef.current.moved) {
          splatStackRef.current.push({
            x: pointerRef.current.texcoordX,
            y: pointerRef.current.texcoordY,
            dx: pointerRef.current.deltaX,
            dy: pointerRef.current.deltaY,
            color: pointerRef.current.color,
          });

          // Occasionally change color for variety
          if (Math.random() < 0.15) {
            pointerRef.current.color = getRandomColor();
          }
        }
      }
    };

    const handleMouseUp = () => {
      pointerRef.current.down = false;
    };

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getPointerPosition(touch);
      pointerRef.current.down = true;
      pointerRef.current.moved = false;
      pointerRef.current.texcoordX = pos.x;
      pointerRef.current.texcoordY = pos.y;
      pointerRef.current.prevTexcoordX = pos.x;
      pointerRef.current.prevTexcoordY = pos.y;
      pointerRef.current.color = getRandomColor();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getPointerPosition(touch);
      
      pointerRef.current.prevTexcoordX = pointerRef.current.texcoordX;
      pointerRef.current.prevTexcoordY = pointerRef.current.texcoordY;
      pointerRef.current.texcoordX = pos.x;
      pointerRef.current.texcoordY = pos.y;
      pointerRef.current.deltaX = pos.x - pointerRef.current.prevTexcoordX;
      pointerRef.current.deltaY = pos.y - pointerRef.current.prevTexcoordY;
      pointerRef.current.moved = true;

      splatStackRef.current.push({
        x: pointerRef.current.texcoordX,
        y: pointerRef.current.texcoordY,
        dx: pointerRef.current.deltaX,
        dy: pointerRef.current.deltaY,
        color: pointerRef.current.color,
      });

      if (Math.random() < 0.15) {
        pointerRef.current.color = getRandomColor();
      }
    };

    const handleTouchEnd = () => {
      pointerRef.current.down = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [getRandomColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};

export default FluidCanvas;
