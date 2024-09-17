
const languageFormat = (key) => {
    switch (key) {
        case 'vi':
            return 'Viet Nam'
            break;
        case 'cn':
            return 'China'
            break;
        case 'jp':
            return "Japan"
            break;
        case 'en':
            return "English"
            break;
        default:
            return "Language"
            break;
    }
}


export default languageFormat