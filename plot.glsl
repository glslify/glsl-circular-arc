#pragma glslify: export(plot)

vec2 plot (vec2 position, vec2 theta) {
  float th = min(theta.y,max(theta.x,position.x));
  vec2 pos = vec2(cos(th),sin(th)) * 2.0 * position.y;
  float x = max(abs(pos.x),abs(pos.y))-0.001;
  return pos/x;
}
