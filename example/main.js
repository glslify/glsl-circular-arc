var glsl = require('glslify')
var regl = require('regl')()
var mesh = require('../')()

var menu = regl({
  frag: glsl`
    precision highp float;
    #pragma glslify: mask = require('../mask')
    varying vec2 vpos;
    uniform vec2 size, radius;
    void main () {
      float m = mask(size, vpos, radius);
      if (m < 0.01) discard;
      gl_FragColor = vec4(vec3(1,0,1),m);
    }
  `,
  vert: glsl`
    precision highp float;
    #pragma glslify: plot = require('../plot')
    attribute vec2 position;
    uniform vec2 size, theta;
    varying vec2 vpos;
    void main () {
      vpos = plot(position, theta);
      vec2 aspect = vec2(1,size.x/size.y);
      gl_Position = vec4(vpos*aspect*0.5,0,1);
    }
  `,
  blend: {
    enable: true,
    func: { src: 'src alpha', dst: 'one minus src alpha' }
  },
  uniforms: {
    size: function (context) {
      return [context.viewportWidth,context.viewportHeight]
    },
    theta: regl.prop('theta'),
    radius: regl.prop('radius')
  },
  attributes: {
    position: mesh.positions
  },
  elements: mesh.cells
})

regl.frame(function frame (context) {
  regl.clear({ color: [0,0,0,1], depth: true })
  var t = context.time
  menu([
    { theta: [0,(Math.sin(t)*0.5+0.5)*2*Math.PI], radius: [0.25,0.5] },
    { theta: [1*(Math.sin(t)*0.5+0.5)*4,(Math.sin(t)*0.5+0.5)*2*Math.PI], radius: [0.5,0.75] },
    { theta: [2,(Math.sin(t)*0.5+0.5)*2*Math.PI], radius: [0.75,1] },
  ])
})
