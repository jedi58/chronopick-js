# ChronoPick DateTime Picker
A vanilla JS datetime picker, with optional support for Material icons

## Features

- 📅 Date and optional time selection
- 🎨 (Optional) Material-style UI
- ♿ WCAG-friendly & keyboard accessible
- 📱 Responsive (mobile & desktop)
- 🧩 Framework-agnostic
- Dark-mode support

## Installation

```bash
npm install chronopick-js
```

or you can import it using something similar to:

```html
<link rel="stylesheet" href="chronopick-datetime-picker.css">
<link rel="stylesheet" href="chronopick-datetime-picker.dark.css">

<script type="module">
  import ChronoPick from './chronopick-datetime-picker.js';
</script>
```

## Usage

```js
new ChronoPick('#myInput', {
  format: 'dd/mm/yyyy HH:mm',
  showTodayButton: true,
  materialIcons: true,
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(2025, 11, 31),
  onChange: (value) => console.log(value)
});
```

You may also pass a DOM element instead of a selector.

### Options

| Option            | Type       | Default      | Description              |
| ----------------- | ---------- | ------------ | ------------------------ |
| `format`          | `string`   | `dd/mm/yyyy` | Output format            |
| `minDate`         | `Date`     | `null`       | Earliest selectable date |
| `maxDate`         | `Date`     | `null`       | Latest selectable date   |
| `materialIcons`   | `boolean`  | `false`      | Use Material Icons       |
| `showTodayButton` | `boolean`  | `false`      | Show “Today” button      |
| `onChange`        | `function` | `null`       | Fires on selection       |


## Keyboard Support

Arrow keys: move date selection
Enter: confirm selection
Esc: close picker
Tab: fully navigable UI

## ♿ Accessibility
- role="dialog" and role="grid"
- Screen reader friendly
- Visible focus rings
- No hover-only interactions
- Designed with WCAG AA+ in mind.
