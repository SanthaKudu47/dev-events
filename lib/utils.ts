export function appendTimeToDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);

  // clone the date so we don't mutate the original
  const newDate = new Date(date);

  newDate.setHours(hours, minutes, 0, 0); // set h:m, reset seconds/ms
  return newDate;
}
