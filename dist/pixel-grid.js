(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.PixelGrid = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // ─── Built-in Animation Presets ───

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

  // Build name → preset lookup
  var ANIMATIONS = {};
  for (var a = 0; a < PRESETS.length; a++) {
    ANIMATIONS[PRESETS[a].name] = PRESETS[a];
  }

  var instances = {};
  var instanceId = 0;
  var prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clearChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  // ─── Instance Factory ───

  function createInstance(container, options) {
    var opts = options || {};
    var config = resolveAnimation(opts.animation || 'wave-lr');
    var autoplay = opts.autoplay !== undefined ? opts.autoplay : true;
    var id = ++instanceId;
    var cells = [];
    var timers = [];
    var cycleTimer = null;
    var running = false;

    // Build DOM
    clearChildren(container);
    for (var i = 0; i < 9; i++) {
      var cell = document.createElement('div');
      cell.className = 'pixel-grid__cell';
      if (config.colors && config.colors[i]) {
        cell.classList.add('pixel-grid__cell--' + config.colors[i]);
      }
      container.appendChild(cell);
      cells.push(cell);
    }

    function resolveAnimation(anim) {
      if (typeof anim === 'string') {
        return ANIMATIONS[anim] || ANIMATIONS['wave-lr'];
      }
      return anim;
    }

    function getMaxDelay() {
      return Math.max.apply(null, config.delays);
    }

    function clearTimers() {
      for (var t = 0; t < timers.length; t++) {
        clearTimeout(timers[t]);
      }
      timers = [];
      if (cycleTimer) {
        clearTimeout(cycleTimer);
        cycleTimer = null;
      }
    }

    function fadeIn(callback) {
      for (var i = 0; i < 9; i++) {
        (function(idx) {
          timers.push(setTimeout(function() {
            cells[idx].classList.add('is-on');
          }, config.delays[idx]));
        })(i);
      }
      var holdTime = getMaxDelay() + config.duration;
      cycleTimer = setTimeout(callback, holdTime);
    }

    function fadeOut(callback) {
      for (var i = 0; i < 9; i++) {
        (function(idx) {
          timers.push(setTimeout(function() {
            cells[idx].classList.remove('is-on');
          }, config.delays[idx]));
        })(i);
      }
      var endTime = getMaxDelay() + config.duration + 50;
      cycleTimer = setTimeout(callback, endTime);
    }

    function cycle() {
      if (!running) return;
      fadeIn(function() {
        if (!running) return;
        fadeOut(function() {
          if (!running) return;
          cycle();
        });
      });
    }

    function play() {
      if (running) return;
      running = true;

      if (prefersReducedMotion) {
        for (var i = 0; i < 9; i++) {
          cells[i].classList.add('is-on');
        }
        return;
      }

      cycle();
    }

    function stop() {
      running = false;
      clearTimers();
      for (var i = 0; i < 9; i++) {
        cells[i].classList.remove('is-on');
      }
    }

    function applyCellColors() {
      for (var i = 0; i < 9; i++) {
        var cls = cells[i].className.split(' ').filter(function(c) {
          return c.indexOf('pixel-grid__cell--') !== 0;
        });
        if (config.colors && config.colors[i]) {
          cls.push('pixel-grid__cell--' + config.colors[i]);
        }
        cells[i].className = cls.join(' ');
      }
    }

    function setAnimation(anim) {
      var wasRunning = running;
      stop();
      config = resolveAnimation(anim);
      applyCellColors();
      if (wasRunning) {
        play();
      }
    }

    function destroy() {
      stop();
      clearChildren(container);
      cells = [];
      delete instances[id];
    }

    var instance = {
      id: id,
      play: play,
      stop: stop,
      setAnimation: setAnimation,
      destroy: destroy,
      getConfig: function() { return config; }
    };

    instances[id] = instance;

    if (autoplay) {
      play();
    }

    return instance;
  }

  // ─── Public API ───

  return {
    create: function(container, options) {
      return createInstance(container, options);
    },

    initAll: function() {
      var elements = document.querySelectorAll('[data-pixel-grid]');
      var created = [];
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var animName = el.getAttribute('data-pixel-grid-animation') || 'wave-lr';
        created.push(createInstance(el, { animation: animName }));
      }
      return created;
    },

    getInstance: function(id) {
      return instances[id] || null;
    },

    destroyAll: function() {
      var keys = Object.keys(instances);
      for (var i = 0; i < keys.length; i++) {
        instances[keys[i]].destroy();
      }
    },

    getAnimationNames: function() {
      return Object.keys(ANIMATIONS);
    },

    getAnimation: function(name) {
      return ANIMATIONS[name] || null;
    },

    ANIMATIONS: ANIMATIONS
  };
});
