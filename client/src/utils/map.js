export const copyStringToClipboard = (str) => {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
};

export const editInfowindowContent = (infowindowContent, location) => {
    console.log(location);
    if (location.photo) {
        infowindowContent.children[0].setAttribute('style', `background-image: url(${location.photo})`);
    } else {
        infowindowContent.children[0].setAttribute('style', 'display: none');
    }
    infowindowContent.getElementsByClassName('title')[0].textContent = location.name;
    infowindowContent.getElementsByClassName('address')[0].textContent = location.address;
    console.log(infowindowContent.getElementsByClassName('address'));
    infowindowContent.getElementsByClassName('description')[0].textContent = location.description;

    if (location.url) {
        infowindowContent.getElementsByClassName('link')[0].setAttribute('href', location.url);
    } else {
        infowindowContent
            .getElementsByClassName('link')[0]
            .setAttribute(
                'href',
                `https://www.google.com/maps/search/?api=1&query=${location.latLng.lat},${location.latLng.lng}`
            );
    }
};
const service = new window.google.maps.places.PlacesService(document.createElement('div'));
export const getGroupDetail = async (group) => {
    const result = [];
    for await (let location of group.locations) {
        //Get place detail through api
        const newLocation = await getPhoto(location);
        result.push({...location, ...newLocation});
    }
    const newGroup = {...group, locations: result};
    return newGroup;
};

const getPhoto = (location) => {
    const request = {
        placeId: location.placeId,
        fields: ['name', 'photo', 'formatted_address'],
    };
    // if (location.photo && !refresh) {
    //     return location;
    // }
    return new Promise((resolve, reject) => {
        service.getDetails(request, async (placeDetail, status) => {
            if (placeDetail) {
                const address = await placeDetail.formatted_address;
                let photo;
                if (placeDetail.photos) photo = await placeDetail.photos[0].getUrl();
                resolve({...location, address, photo});
            } else if (status === 'OVER_QUERY_LIMIT') {
                reject(status);
            }
        });
    });
};

export const imageExists = (image_url) => {
    var img = new Image();
    img.src = image_url;
    return img.height !== 0;
};
