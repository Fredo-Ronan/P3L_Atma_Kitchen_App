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