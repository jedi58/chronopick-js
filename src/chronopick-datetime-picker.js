import { clampDate, daysInMonth, isSameDay } from './dateUtils.js';

export default class ChronoPick {
  constructor(inputOrSelector, options = {}) {
    this.input =
      typeof inputOrSelector === 'string'
        ? document.querySelector(inputOrSelector)
        : inputOrSelector;

    if (!this.input) {
      throw new Error('MaterialDatePicker: invalid input element');
    }

    this.options = {
      format: options.format || 'dd/mm/yyyy',
      minDate: options.minDate || null,
      maxDate: options.maxDate || null,
      locale: options.locale || navigator.language,
      showTodayButton: options.showTodayButton ?? true,
      onChange: options.onChange || (() => {})
    };

    this.selectedDate = this.parseInputDate();
    const base = this.selectedDate || new Date();

    this.currentMonth = base.getMonth();
    this.currentYear = base.getFullYear();

    this.isAnimating = false;
    this.yearPanelVisible = false;

    this.createPicker();
    this.addEvents();
  }

  parseInputDate() {
    if (!this.input.value) return null;

    const [datePart, timePart] = this.input.value.split(' ');
    const [d, m, y] = datePart.split('/').map(Number);
    if (!d || !m || !y) return null;

    const dt = new Date(y, m - 1, d);

    if (timePart) {
      const [h, min] = timePart.split(':').map(Number);
      dt.setHours(h || 0, min || 0);
    }

    return dt;
  }

  formatDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    let out = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

    if (this.options.format.includes('H')) {
      out += ` ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    return out;
  }

  createPicker() {
    this.picker = document.createElement('div');
    this.picker.className = 'datepicker-popup';
    this.picker.setAttribute('role', 'dialog');
    this.picker.setAttribute('aria-label', 'Date picker');
    this.picker.style.display = 'none';

    if (this.options.showTodayButton) {
      const todayBtn = document.createElement('button');
      todayBtn.className = 'datepicker-today-btn';
      todayBtn.innerHTML = `<span class="material-icons">today</span> Today`;
      todayBtn.onclick = () => this.selectDate(new Date(), true);
      this.picker.appendChild(todayBtn);
    }

    this.header = document.createElement('div');
    this.header.className = 'datepicker-header';

    this.prevBtn = document.createElement('button');
    this.prevBtn.innerHTML = `<span class="material-icons">chevron_left</span>`;
    this.prevBtn.setAttribute('aria-label', 'Previous month');

    this.nextBtn = document.createElement('button');
    this.nextBtn.innerHTML = `<span class="material-icons">chevron_right</span>`;
    this.nextBtn.setAttribute('aria-label', 'Next month');

    this.monthLabel = document.createElement('button');
    this.monthLabel.className = 'datepicker-month-label';
    this.monthLabel.onclick = () => this.toggleYearPanel();

    this.header.append(this.prevBtn, this.monthLabel, this.nextBtn);
    this.picker.appendChild(this.header);

    this.calendarContainer = document.createElement('div');
    this.calendarContainer.className = 'datepicker-calendar-container';
    this.picker.appendChild(this.calendarContainer);

    this.yearPanel = document.createElement('div');
    this.yearPanel.className = 'datepicker-year-panel';
    this.yearPanel.style.display = 'none';
    this.picker.appendChild(this.yearPanel);

    if (this.options.format.includes('H')) {
      this.createTimeInputs();
    }

    document.body.appendChild(this.picker);
    this.renderCalendar();
  }

  createTimeInputs() {
    this.timeWrap = document.createElement('div');
    this.timeWrap.className = 'datepicker-time-container';

    this.hourInput = this.createTimeInput(0, 23);
    this.minuteInput = this.createTimeInput(0, 59);

    this.timeWrap.append('H:', this.hourInput, 'M:', this.minuteInput);
    this.picker.appendChild(this.timeWrap);

    const sync = () => {
      if (!this.selectedDate) this.selectedDate = new Date();
      this.selectedDate.setHours(this.hourInput.value || 0);
      this.selectedDate.setMinutes(this.minuteInput.value || 0);
      this.updateValue();
    };

    this.hourInput.oninput = sync;
    this.minuteInput.oninput = sync;
  }

  createTimeInput(min, max) {
    const i = document.createElement('input');
    i.type = 'number';
    i.min = min;
    i.max = max;
    i.value = 0;
    return i;
  }

  renderCalendar() {
    this.calendarContainer.innerHTML = '';
    this.monthLabel.textContent =
      new Intl.DateTimeFormat(this.options.locale, { month: 'long', year: 'numeric' })
        .format(new Date(this.currentYear, this.currentMonth));

    const table = document.createElement('table');
    table.className = 'datepicker-calendar';
    table.setAttribute('role', 'grid');

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    table.innerHTML =
      `<tr>${days.map(d => `<th>${d}</th>`).join('')}</tr>`;

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const totalDays = daysInMonth(this.currentYear, this.currentMonth);

    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) row.appendChild(document.createElement('td'));

    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement('td');
      const date = new Date(this.currentYear, this.currentMonth, d);
      cell.textContent = d;
      cell.tabIndex = 0;
      cell.setAttribute('role', 'gridcell');

      if (this.selectedDate && isSameDay(date, this.selectedDate)) {
        cell.classList.add('selected');
        cell.setAttribute('aria-selected', 'true');
      }

      cell.onclick = () => this.selectDate(date);
      row.appendChild(cell);

      if ((firstDay + d) % 7 === 0) {
        table.appendChild(row);
        row = document.createElement('tr');
      }
    }

    table.appendChild(row);
    this.calendarContainer.appendChild(table);
  }

  renderYearPanel() {
    this.yearPanel.innerHTML = '';
    const start = this.currentYear - 6;

    for (let y = start; y < start + 12; y++) {
      const b = document.createElement('button');
      b.textContent = y;
      if (y === this.currentYear) b.classList.add('selected');
      b.onclick = () => {
        this.currentYear = y;
        this.yearPanel.style.display = 'none';
        this.calendarContainer.style.display = 'block';
        this.renderCalendar();
      };
      this.yearPanel.appendChild(b);
    }
  }

  toggleYearPanel() {
    this.yearPanelVisible = !this.yearPanelVisible;
    if (this.yearPanelVisible) {
      this.renderYearPanel();
      this.yearPanel.style.display = 'grid';
      this.calendarContainer.style.display = 'none';
    } else {
      this.yearPanel.style.display = 'none';
      this.calendarContainer.style.display = 'block';
    }
  }

  selectDate(date, close = false) {
    this.selectedDate = clampDate(date, this.options.minDate, this.options.maxDate);
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.updateValue();
    if (close) this.hide();
  }

  updateValue() {
    if (!this.selectedDate) return;
    this.input.value = this.formatDate(this.selectedDate);
    this.options.onChange(this.input.value);
    this.renderCalendar();
  }

  addEvents() {
    const position = () => {
      const r = this.input.getBoundingClientRect();
      this.picker.style.top = `${r.bottom + window.scrollY}px`;
      this.picker.style.left = `${r.left + window.scrollX}px`;
      this.picker.style.width = `${r.width}px`;
    };

    this.input.onfocus = () => {
      position();
      this.picker.style.display = 'block';
    };

    document.addEventListener('click', (e) => {
      if (!this.picker.contains(e.target) && e.target !== this.input) {
        this.hide();
      }
    });

    this.prevBtn.onclick = () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderCalendar();
    };

    this.nextBtn.onclick = () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderCalendar();
    };
  }

  hide() {
    this.picker.style.display = 'none';
    this.input.focus();
  }
}
