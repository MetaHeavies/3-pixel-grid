// ─── Built-in Animation Presets ───
// Each preset defines: name, delays (9 values, one per cell), duration (ms)

var PRESETS = [
  { name: 'wave-lr',       delays: [0, 120, 240, 0, 120, 240, 0, 120, 240],           duration: 200 },
  { name: 'wave-rl',       delays: [240, 120, 0, 240, 120, 0, 240, 120, 0],           duration: 200 },
  { name: 'wave-tb',       delays: [0, 0, 0, 120, 120, 120, 240, 240, 240],           duration: 200 },
  { name: 'wave-bt',       delays: [240, 240, 240, 120, 120, 120, 0, 0, 0],           duration: 200 },
  { name: 'spiral-cw',     delays: [0, 80, 160, 560, 640, 240, 480, 400, 320],        duration: 180 },
  { name: 'corners-first', delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],             duration: 200 },
  { name: 'center-out',    delays: [240, 120, 240, 120, 0, 120, 240, 120, 240],       duration: 200 },
  { name: 'diagonal-tl',   delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],       duration: 180 },
  { name: 'snake',         delays: [0, 80, 160, 400, 320, 240, 480, 560, 640],        duration: 160 },
  { name: 'cross',         delays: [300, 0, 300, 0, 0, 0, 300, 0, 300],               duration: 250 },
  { name: 'checkerboard',  delays: [0, 250, 0, 250, 0, 250, 0, 250, 0],               duration: 220 },
  { name: 'rain',          delays: [0, 180, 60, 120, 300, 240, 360, 80, 420],         duration: 170 },
  { name: 'pinwheel',      delays: [0, 160, 480, 320, 640, 160, 480, 320, 0],         duration: 150 },
  { name: 'orbit',         delays: [0, 80, 160, 480, 640, 240, 400, 320, 560],        duration: 120 },
  { name: 'converge',      delays: [0, 160, 80, 240, 320, 240, 80, 160, 0],           duration: 260 },
  { name: 'zigzag',        delays: [0, 160, 320, 400, 240, 80, 480, 560, 640],        duration: 140 },

  // ─── Multi-Color Presets ───
  { name: 'aurora',      delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],       duration: 220, colors: ['cyan', 'cyan', 'teal', 'teal', 'blue', 'blue', 'purple', 'purple', 'magenta'] },
  { name: 'ember',       delays: [0, 80, 160, 560, 640, 240, 480, 400, 320],        duration: 180, colors: ['yellow', 'orange', 'orange', 'orange', 'red', 'red', 'red', 'magenta', 'magenta'] },
  { name: 'prism',       delays: [0, 80, 160, 240, 320, 400, 480, 560, 640],        duration: 160, colors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta', 'pink'] },
  { name: 'neon-cross',  delays: [300, 0, 300, 0, 0, 0, 300, 0, 300],               duration: 250, colors: ['magenta', 'cyan', 'magenta', 'cyan', 'white', 'cyan', 'magenta', 'cyan', 'magenta'] },
  { name: 'tide',        delays: [0, 0, 0, 120, 120, 120, 240, 240, 240],           duration: 200, colors: ['teal', 'cyan', 'teal', 'blue', 'teal', 'blue', 'purple', 'blue', 'purple'] },
  { name: 'sunset',      delays: [240, 240, 240, 120, 120, 120, 0, 0, 0],           duration: 200, colors: ['purple', 'blue', 'purple', 'magenta', 'red', 'magenta', 'orange', 'yellow', 'orange'] },
  { name: 'toxic',       delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],             duration: 200, colors: ['lime', 'green', 'lime', 'green', 'yellow', 'green', 'lime', 'green', 'lime'] },
  { name: 'frost',       delays: [240, 120, 240, 120, 0, 120, 240, 120, 240],       duration: 200, colors: ['blue', 'cyan', 'blue', 'cyan', 'white', 'cyan', 'blue', 'cyan', 'blue'] }
];
