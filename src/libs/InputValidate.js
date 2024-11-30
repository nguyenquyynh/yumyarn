export function removeSpecialCharacters(str) {
    const key = str.replace(/[^a-zA-Z0-9\s]/g, '');
    if (!key) {
        return ''
    }
    return key
}

export function validateHashtag(key) {
    return key?.trim()
        .toLowerCase()
        ?.replace(/[^a-z0-9]/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}