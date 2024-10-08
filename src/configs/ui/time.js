export function millisecondsToDate(milliseconds) {
    const date = new Date(milliseconds / 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2,
        '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
export function millisecondsToDay(milliseconds) {
    const date = milliseconds / 1000 / 3600 / 24;
    return date
}