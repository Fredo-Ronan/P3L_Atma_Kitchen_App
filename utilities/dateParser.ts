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