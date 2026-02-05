# 3px-grid

A tiny 3x3 animated pixel grid indicator driven by simple delay arrays. Zero dependencies, under 3KB.

## Credits

The pixel grid loading concept was originally created by [SuCodee](https://www.youtube.com/@SuCodee) for Swift projects.

I first came across it through [Kevin Grajeda](https://www.kvin.me/) via [this post on X](https://x.com/k_grajeda/status/2017358045957759121), which inspired this web implementation.

## Installation

### npm (via GitHub)

```
npm install MetaHeavies/3-pixel-grid
```

### Manual

Copy `dist/pixel-grid.js` and `dist/pixel-grid.css` (or `dist/pixel-grid.full.css` for color variants) into your project.
 
## Quick Start

```html
<link rel="stylesheet" href="pixel-grid.css">

<div class="pixel-grid" id="my-grid"></div>

<script src="pixel-grid.js"></script>
<script>
  PixelGrid.create(document.getElementById('my-grid'), {
    animation: 'wave-lr'
  });
</script>
```

## Usage

### Declarative (data attributes)

```html
<div class="pixel-grid" data-pixel-grid data-pixel-grid-animation="spiral-cw"></div>

<script>
  PixelGrid.initAll();
</script>
```

### Programmatic

```js
var grid = PixelGrid.create(element, {
  animation: 'wave-lr',  // preset name or custom object
  autoplay: true          // default: true
});

grid.play();
grid.stop();
grid.setAnimation('snake');
grid.destroy();
```

### Custom Animations

Pass an object instead of a preset name:

```js
PixelGrid.create(element, {
  animation: {
    name: 'my-pattern',
    delays: [0, 100, 200, 300, 400, 300, 200, 100, 0],
    duration: 200
  }
});
```

**Animation format:**
- `name` (string) — identifier
- `delays` (array of 9 numbers) — stagger delay in ms for each cell (left-to-right, top-to-bottom)
- `duration` (number) — hold time in ms before fade-out begins

## API

### `PixelGrid.create(container, options)`

Creates a new pixel grid instance inside the given DOM element.

**Options:**
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `animation` | string or object | `'wave-lr'` | Preset name or custom animation object |
| `autoplay` | boolean | `true` | Start animating immediately |

**Returns:** Instance object with `play()`, `stop()`, `setAnimation(anim)`, `destroy()`, `getConfig()`.

### `PixelGrid.initAll()`

Finds all elements with `[data-pixel-grid]` and creates instances. Returns an array of instances.

### `PixelGrid.getInstance(id)`

Returns an instance by its numeric ID.

### `PixelGrid.destroyAll()`

Destroys all active instances.

### `PixelGrid.getAnimationNames()`

Returns an array of all built-in preset names.

### `PixelGrid.getAnimation(name)`

Returns a preset object by name, or `null`.

### `PixelGrid.ANIMATIONS`

Direct access to the preset lookup object.

## Built-in Presets

| Name | Description |
|------|-------------|
| `wave-lr` | Wave sweeping left to right |
| `wave-rl` | Wave sweeping right to left |
| `wave-tb` | Wave sweeping top to bottom |
| `wave-bt` | Wave sweeping bottom to top |
| `spiral-cw` | Clockwise spiral from top-left |
| `corners-first` | Corners light up first, then edges, then center |
| `center-out` | Center cell first, radiating outward |
| `diagonal-tl` | Diagonal sweep from top-left |
| `snake` | Snake path through the grid |
| `cross` | Cross/plus pattern |
| `checkerboard` | Alternating cells |
| `rain` | Random rain-like pattern |
| `pinwheel` | Rotating pinwheel |
| `orbit` | Orbiting pattern |
| `converge` | Corners and edges converge to center |
| `zigzag` | Zigzag path through cells |

## CSS

### Core (`pixel-grid.css`)

Includes the grid layout, cell states, default cyan color, and reduced-motion media query. This is all you need.

### Colors (`colors.css`)

Optional. Adds 12 color variant classes:

```html
<div class="pixel-grid pixel-grid--magenta" data-pixel-grid></div>
```

Available: `cyan`, `magenta`, `yellow`, `green`, `orange`, `blue`, `red`, `purple`, `white`, `teal`, `pink`, `lime`.

### Full (`pixel-grid.full.css`)

Core + colors combined in one file for convenience.

## Accessibility

- Respects `prefers-reduced-motion: reduce` — animations are disabled and cells show their "on" state statically
- CSS transitions are removed under reduced motion

## License

MIT