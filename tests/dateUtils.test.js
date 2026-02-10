import { describe, it, expect } from 'vitest';
import { clampDate, daysInMonth, isSameDay } from '../src/dateUtils';

describe('daysInMonth', () => {
  it('handles leap years', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2023, 1)).toBe(28);
  });
});

describe('clampDate', () => {
  it('clamps below min', () => {
    const min = new Date(2023, 0, 10);
    const d = new Date(2023, 0, 1);
    expect(clampDate(d, min, null)).toEqual(min);
  });
});

describe('isSameDay', () => {
  it('matches calendar day regardless of time', () => {
    expect(
      isSameDay(
        new Date(2024, 5, 10, 9),
        new Date(2024, 5, 10, 18)
      )
    ).toBe(true);
  });
});
