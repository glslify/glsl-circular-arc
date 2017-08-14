#pragma glslify: export(mask)

float mask (vec2 size, vec2 pos, vec2 radius) {
  float dz = 10.0/min(size.x,size.y);
  float r = length(pos);
  float d = smoothstep(radius.y-dz,radius.y,r)
    + smoothstep(radius.x+dz,radius.x,r);
  return (1.0-d) * step(radius.x,r) * step(r,radius.y);
}
