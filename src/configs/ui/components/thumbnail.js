import { createThumbnail } from "react-native-create-thumbnail";

export const fetchThumbnail = async (item) => {
    try {
        if (item.endsWith('.jpg') || item.endsWith('.png') || item.endsWith('.jpeg') || item.endsWith('.gif') || item.endsWith('.svg') || item.endsWith('.webp')) {
            return item
        } else if (item.endsWith('.mp4')) {
            const response = await createThumbnail({
                url: item,
                timeStamp: 10,
            });
            return response.path
        }
    } catch (err) {
        console.log(err);
        return 'https://i.imgur.com/eZLxXda.png'
    }
};