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
    { name: 'converge',      delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],             duration: 260 },
    { name: 'zigzag',        delays: [0, 160, 320, 400, 240, 80, 480, 560, 640],        duration: 140 }
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

    function setAnimation(anim) {
      var wasRunning = running;
      stop();
      config = resolveAnimation(anim);
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
