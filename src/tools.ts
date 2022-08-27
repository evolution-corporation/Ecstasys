export function createArrayLength(len: number): null[] {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(null);
  }
  return arr;
}

export class DatePlus extends Date {
  setMonthPlus(monthIndex: number): DatePlus {
    this.setMonth(monthIndex);
    return this;
  }

  setDatePlus(date: number): DatePlus {
    this.setDate(date);
    return this;
  }

  setFullYeaPlus(year: number): DatePlus {
    this.setFullYear(year);
    return this;
  }

  getCountDayInCurrentMonth(): number {
    const modificationCurrentDate = new Date(this.getTime());
    modificationCurrentDate.setMonth(this.getMonth() + 1, 0);
    return modificationCurrentDate.getDate();
  }

  editMonth(monthIndex: number): DatePlus {
    const modificationCurrentDate = new DatePlus(this.getTime());
    modificationCurrentDate.setMonth(monthIndex);
    return modificationCurrentDate;
  }

  editDate(date: number): DatePlus {
    const modificationCurrentDate = new DatePlus(this.getTime());
    modificationCurrentDate.setDate(date);
    return modificationCurrentDate;
  }

  editFullYear(fullYear: number): DatePlus {
    const modificationCurrentDate = new DatePlus(this.getTime());
    modificationCurrentDate.setFullYear(fullYear);
    return modificationCurrentDate;
  }
}
