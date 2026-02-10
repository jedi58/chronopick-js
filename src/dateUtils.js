export function clampDate(date, min, max) {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
