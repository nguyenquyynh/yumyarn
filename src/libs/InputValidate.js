export function removeSpecialCharacters(str) {
    const key = str.replace(/[^a-zA-Z0-9\s]/g, '');
    if (!key) {
        return ''
    }
    return key
}