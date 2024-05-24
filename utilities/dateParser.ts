/*
    Utility to format date taken from database to normal date format
*/

export const dateParser = (date: string) => {
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

    return formattedDate;
}

export const dateConvertToNormal = (dateInput: string) => {

    // Convert the date string into a Date object
    const date = new Date(dateInput);

    // Extract year, month, and day components
    const year = date.getFullYear();
    // Add 1 to month because getMonth() returns a zero-based index
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the desired date format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;

}

// format date to YYYY-MM-DD
export function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// get dates after today to a certain date
export function getDatesAfterTodayToN(endDate: Date): string[] {
    // Get today's date
    let currentDate = new Date();
    let dates: string[] = [];

    // Loop through the dates starting from tomorrow until reaching the end date
    while (currentDate < endDate) {
        // console.log(currentDate.toLocaleDateString());
        
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);

        dates.push(formatDateToYYYYMMDD(currentDate));
    }

    // console.log(dates);
    return dates;
}
  