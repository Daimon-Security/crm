export function covertStringToDate(dateString){
    const [day, month, year] = dateString.split('-');
    const dateObject = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    console.log("fecha anterior: ", dateObject);
    return dateObject;
}