var regl = require('regl')()
var mesh = require('../')()
var size = [0,0]

var menu = regl({
  frag: `
    precision highp float;
    varying vec2 vpos;
    uniform vec2 size, radius;
    void main () {
      float dz = 10.0/min(size.x,size.y);
      float r = length(vpos);
      if (r < radius.x || r > radius.y) discard;
      float d = smoothstep(radius.y-dz,radius.y,r)
        + smoothstep(radius.x+dz,radius.x,r);
      gl_FragColor = vec4(vec3(1.0-d),(1.0-d));
    }
  `,
  vert: `
    precision highp float;
    attribute vec2 position;
    uniform vec2 size, theta;
    varying vec2 vpos;
    void main () {
      vec2 aspect = vec2(
        min(size.x,size.y)/size.x,
        min(size.x,size.y)/size.y
      );
      float tau = ${Math.PI*2};
      float th = min(theta.y,max(theta.x,position.x));
      vpos = vec2(cos(th),sin(th)) * 2.0 * position.y;
      float x = max(abs(vpos.x),abs(vpos.y))-0.001;
      vpos.x = vpos.x / x;
      vpos.y = vpos.y / x;
      gl_Position = vec4(vpos*0.5*aspect,0,1);
    }
  `,
  blend: {
    enable: true,
    func: { src: 'src alpha', dst: 'one minus src alpha' }
  },
  uniforms: {
    size: function (context) {
      size[0] = context.viewportWidth
      size[1] = context.viewportHeight
      return size
    },
    theta: regl.prop('theta'),
    radius: regl.prop('radius')
  },
  attributes: {
    position: mesh.positions
  },
  elements: mesh.cells
})

regl.frame(frame)
//frame()
//window.addEventListener('resize', frame)

function frame (context) {
  //regl.poll()
  regl.clear({ color: [0,0,0,1], depth: true })
  var t = context.time
  menu([
    { theta: [0,(Math.sin(t)*0.5+0.5)*2*Math.PI], radius: [0.25,0.5] },
    { theta: [1*(Math.sin(t)*0.5+0.5)*4,(Math.sin(t)*0.5+0.5)*2*Math.PI], radius: [0.5,0.75] },
    { theta: [2,(Math.sin(t)*0.5+0.5)*2*Math.PI], radius: [0.75,1] },
  ])
}
