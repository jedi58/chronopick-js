# ChronoPick DateTime Picker
A vanilla JS datetime picker, with optional support for Material icons

## ✨ Features

- 📅 Date and optional time selection
- 🎨 (Optional) Material-style UI
- ♿ WCAG-friendly & keyboard accessible
- 📱 Responsive (mobile & desktop)
- 🧩 Framework-agnostic

## 📦 Installation

```bash
npm install material-datepicker-lite
```

or import directly:

```js
import MaterialDatePicker from './MaterialDatePicker.js';
```

🚀 Usage
new MaterialDatePicker('#myInput', {
  format: 'dd/mm/yyyy HH:mm',
  showTodayButton: true,
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(2025, 11, 31),
  onChange: (value) => console.log(value)
});


You may also pass a DOM element instead of a selector.

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
