export function removeSpecialCharacters(str) {
    const key = str.replace(/[^a-zA-Z0-9\s]/g, '');
    console.log(key.trim().length);
    
    if (!key) {
        return ''
    }
    return key
}