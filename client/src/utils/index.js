export * from './testUtils';
export * from './animation';
export const copyStringToClipboard = str => {
  // Create new element
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
};

export const editInfowindowContent = (infowindowContent, location) => {
  if (location.photo) {
    infowindowContent.children[0].setAttribute(
      'style',
      `background-image: url(${location.photo})`
    );
  } else {
    infowindowContent.children[0].setAttribute('style', 'display: none');
  }
  infowindowContent.getElementsByClassName('title')[0].textContent =
    location.name;
  infowindowContent.getElementsByClassName('address')[0].textContext =
    location.address;
  infowindowContent.getElementsByClassName('description')[0].textContent =
    location.description;

  if (location.url) {
    infowindowContent
      .getElementsByClassName('link')[0]
      .setAttribute('href', location.url);
  } else {
    infowindowContent
      .getElementsByClassName('link')[0]
      .setAttribute(
        'href',
        `https://www.google.com/maps/search/?api=1&query=${location.latLng.lat},${location.latLng.lng}`
      );
  }
};
