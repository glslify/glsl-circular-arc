var regl = require('regl')()
var mesh = require('../')()
var size = [0,0]

var menu = regl({
  frag: `
    precision highp float;
    varying vec2 vpos;
    uniform vec2 size;
    void main () {
      float dz = 10.0/min(size.x,size.y);
      float r = length(vpos);
      float d = smoothstep(1.0-dz,1.0,r)
        + smoothstep(0.5+dz,0.5,r);
      gl_FragColor = vec4(vec3(1.0-d),(1.0-d)*0.5+0.5);
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
      float t = position.x;
      float th = min(theta.y,max(theta.x,t));
      //vpos = min(vec2(1),max(vec2(-1),vec2(cos(th),sin(th))*2.0))
      //  * position.y;
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
    theta: regl.prop('theta')
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
  menu({ theta: [0.2,0.2+(Math.sin(context.time)*0.5+0.5)*4] })
}
