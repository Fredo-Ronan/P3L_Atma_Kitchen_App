/*
    Utility to format date taken from database to normal date format
*/

export const dateParser = (date: string) => {
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

    return formattedDate;
}

export function parseDateToDay(date: string):string {
    return date.split("-")[2];
}