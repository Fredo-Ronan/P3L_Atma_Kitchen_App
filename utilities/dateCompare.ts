/*
    FUNCTION TO COMPARE DATES
*/

export function isDateEarlier(dateTarget: string){
    const givenDate = new Date(dateTarget);
    const today = new Date();

    const givenDateOnly = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return givenDateOnly < todayDateOnly;
}