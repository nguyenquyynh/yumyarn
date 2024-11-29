export const Upload = async (uri, type, name) => {
    const data = new FormData();
    data.append('file', { uri, type, name });
    data.append('upload_preset', 'x1r3euwt');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/dggd2eydr/upload`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
        },
        body: data,
    });
    const newData = await response.json();
    console.log(newData);

    return newData.secure_url;
}