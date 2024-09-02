export function getDate(date){
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth()+1<10)?`0${date.getUTCMonth()+1}`: date.getUTCMonth()+1;
    const day = (date.getUTCDate()<10)?`0${date.getUTCDate()}`: date.getUTCDate();
    return `${day}-${month}-${year}`
     
}