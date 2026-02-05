# Multi-Color Animation Support

Reference spec for adding per-cell color support to the `3px-grid` / `pixel-grid` engine. All changes are backwards-compatible — single-color animations continue to work unchanged.

---

## Data Model

### Before (single color)

```js
{
  name: 'wave-lr',
  delays: [0, 120, 240, 0, 120, 240, 0, 120, 240],
  duration: 200
}
```

Color was applied externally via a CSS class on the grid container (e.g. `.pixel-grid--cyan`). The engine itself had no concept of color.

### After (multi-color, optional)

```js
{
  name: 'aurora',
  delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],
  duration: 220,
  colors: ['cyan', 'cyan', 'teal', 'teal', 'blue', 'blue', 'purple', 'purple', 'magenta']
}
```

- `colors` is **optional**. When omitted, behavior is identical to before.
- When present, it must be an array of exactly **9 strings**, one per cell (index 0 = top-left, index 8 = bottom-right, row-major order).
- Each string must be a valid color name from the palette (see below).

---

## CSS Changes

### Existing: Grid-level color classes (unchanged)

These set custom properties on the container. All cells inherit the same color.

```css
.pixel-grid--cyan {
  --pixel-off: oklch(40% 0.08 195 / 0.4);
  --pixel-on: oklch(90% 0.2 195);
  --pixel-glow: oklch(80% 0.25 195 / 0.9);
}
```

### New: Cell-level color classes

Identical values, but scoped to individual cells. Applied directly to `.pixel-grid__cell` elements.

```css
.pixel-grid__cell--cyan {
  --pixel-off: oklch(40% 0.08 195 / 0.4);
  --pixel-on: oklch(90% 0.2 195);
  --pixel-glow: oklch(80% 0.25 195 / 0.9);
}

.pixel-grid__cell--magenta {
  --pixel-off: oklch(40% 0.08 330 / 0.4);
  --pixel-on: oklch(85% 0.25 330);
  --pixel-glow: oklch(75% 0.3 330 / 0.9);
}

.pixel-grid__cell--yellow {
  --pixel-off: oklch(50% 0.08 90 / 0.4);
  --pixel-on: oklch(95% 0.2 90);
  --pixel-glow: oklch(90% 0.25 90 / 0.9);
}

.pixel-grid__cell--green {
  --pixel-off: oklch(40% 0.08 145 / 0.4);
  --pixel-on: oklch(90% 0.25 145);
  --pixel-glow: oklch(80% 0.3 145 / 0.9);
}

.pixel-grid__cell--orange {
  --pixel-off: oklch(45% 0.08 50 / 0.4);
  --pixel-on: oklch(85% 0.22 50);
  --pixel-glow: oklch(75% 0.28 50 / 0.9);
}

.pixel-grid__cell--blue {
  --pixel-off: oklch(40% 0.08 260 / 0.4);
  --pixel-on: oklch(80% 0.22 260);
  --pixel-glow: oklch(70% 0.28 260 / 0.9);
}

.pixel-grid__cell--red {
  --pixel-off: oklch(40% 0.08 25 / 0.4);
  --pixel-on: oklch(70% 0.25 25);
  --pixel-glow: oklch(60% 0.3 25 / 0.9);
}

.pixel-grid__cell--purple {
  --pixel-off: oklch(40% 0.08 300 / 0.4);
  --pixel-on: oklch(75% 0.22 300);
  --pixel-glow: oklch(65% 0.28 300 / 0.9);
}

.pixel-grid__cell--white {
  --pixel-off: oklch(50% 0 0 / 0.3);
  --pixel-on: oklch(98% 0 0);
  --pixel-glow: oklch(95% 0 0 / 0.8);
}

.pixel-grid__cell--teal {
  --pixel-off: oklch(40% 0.08 175 / 0.4);
  --pixel-on: oklch(82% 0.18 175);
  --pixel-glow: oklch(72% 0.24 175 / 0.9);
}

.pixel-grid__cell--pink {
  --pixel-off: oklch(45% 0.08 350 / 0.4);
  --pixel-on: oklch(80% 0.2 350);
  --pixel-glow: oklch(70% 0.26 350 / 0.9);
}

.pixel-grid__cell--lime {
  --pixel-off: oklch(45% 0.08 120 / 0.4);
  --pixel-on: oklch(88% 0.22 120);
  --pixel-glow: oklch(80% 0.28 120 / 0.9);
}
```

### Why cell-level classes work

The `.pixel-grid__cell` already reads from `--pixel-on`, `--pixel-off`, and `--pixel-glow` for its `background-color` and `box-shadow`. CSS custom properties inherit, so:

- **Single color:** Grid container sets the properties, all cells inherit.
- **Multi color:** Each cell sets its own properties via its own class, overriding the inherited values.

No changes needed to the cell state rules (`.pixel-grid__cell.is-on`).

---

## JS Engine Changes

### 1. Carry `colors` through the animation lookup

When building the internal `ANIMATIONS` map from the preset array, preserve the `colors` field if present:

```js
var entry = { name: src.name, delays: src.delays, duration: src.duration };
if (src.colors) { entry.colors = src.colors; }
ANIMATIONS[src.name] = entry;
```

### 2. Apply per-cell color classes during DOM build

When creating the 9 cell elements, check for `config.colors`:

```js
for (var i = 0; i < 9; i++) {
  var cell = document.createElement('div');
  cell.className = 'pixel-grid__cell';
  if (config.colors && config.colors[i]) {
    cell.classList.add('pixel-grid__cell--' + config.colors[i]);
  }
  container.appendChild(cell);
  cells.push(cell);
}
```

### 3. Reapply colors on `setAnimation()`

When switching animations at runtime, strip old cell color classes and apply new ones:

```js
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
  if (wasRunning) { play(); }
}
```

---

## Valid Color Palette

```
cyan, magenta, yellow, green, orange, blue, red, purple, white, teal, pink, lime
```

12 colors total. Each maps to both a grid-level class (`.pixel-grid--{name}`) and a cell-level class (`.pixel-grid__cell--{name}`) with identical custom property values.

---

## Multi-Color Presets Added to Gallery

| Name | Delay Pattern | Colors (per cell, L-to-R, T-to-B) |
|------|---------------|-------------------------------------|
| `aurora` | diagonal-tl | cyan, cyan, teal, teal, blue, blue, purple, purple, magenta |
| `ember` | spiral-cw | yellow, orange, orange, orange, red, red, red, magenta, magenta |
| `prism` | sequential | red, orange, yellow, green, cyan, blue, purple, magenta, pink |
| `neon-cross` | cross | magenta, cyan, magenta, cyan, white, cyan, magenta, cyan, magenta |
| `tide` | wave-tb | teal, cyan, teal, blue, teal, blue, purple, blue, purple |
| `sunset` | wave-bt | purple, blue, purple, magenta, red, magenta, orange, yellow, orange |
| `toxic` | corners-first | lime, green, lime, green, yellow, green, lime, green, lime |
| `frost` | center-out | blue, cyan, blue, cyan, white, cyan, blue, cyan, blue |

---

## Cell Index Map (3x3 grid, row-major)

```
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]
```

Index 0 = top-left, index 4 = center, index 8 = bottom-right.

---

## Backwards Compatibility

- Animations without `colors` work exactly as before.
- The `colors` field is never required.
- Grid-level color classes (`.pixel-grid--cyan`) remain fully functional.
- Cell-level classes only take effect when explicitly added to a cell element.
- No breaking changes to the public API (`PixelGrid.create()`, `setAnimation()`, etc.).
