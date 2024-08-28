export function unixTimestampToTimeStringConverter(UNIX_timestamp: number): string {
  const dateObj = new Date(UNIX_timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = dateObj.getFullYear();
  const month = months[dateObj.getMonth()];
  const date = dateObj.getDate();
  const hour = dateObj.getHours();
  const min = dateObj.getMinutes().toString().padStart(2, '0');
  const time = `${date} ${month} ${year} ${hour}:${min}`;
  return time;
}

export function timeStringToUnixTimestamp(timeString: string): number {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const [date, month, year, time] = timeString.split(' ');
  const [hour, min] = time.split(':').map(Number);

  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) throw new Error('Invalid month');

  const dateObj = new Date(
    parseInt(year), 
    monthIndex, 
    parseInt(date), 
    hour, 
    min,
  );

  return Math.floor(dateObj.getTime());
}