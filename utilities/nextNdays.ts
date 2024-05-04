/*
  UTILITIES ABOUT CREATING NEXT DAYS AND CALCULATE DAYS
*/

export function getNext7Days() {
  const today = new Date();
  const dates = [];
  const numberOfDays = 7;

  for (let i = 0; i < numberOfDays; i++) {
    const nextDate = new Date(today); // Copy the start date
    nextDate.setDate(today.getDate() + i); // Add 'i' days to the current date
    dates.push(nextDate);
  }

  return dates;
}

export function getNextNDays(numOfNextDays: number){
  const today = new Date();
  const dates = [];

  for (let i = 0; i < numOfNextDays; i++) {
    const nextDate = new Date(today); // Copy the start date
    nextDate.setDate(today.getDate() + i); // Add 'i' days to the current date
    dates.push(nextDate);
  }

  return dates;
}

export function calculateDays(fromDate: Date, toDate: Date): number{
  const fromDateOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

  // calculate the differents in miliseconds
  const diffMilis = toDateOnly.getTime() - fromDateOnly.getTime();

  // calculate day differences
  const milisPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor(diffMilis / milisPerDay);

  return daysDiff;
}