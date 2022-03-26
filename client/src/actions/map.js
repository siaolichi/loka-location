import { ADD_MAP } from './types';

export const initMap = (map) => async (dispatch) => {
	try {
		await dispatch({
			type: ADD_MAP,
			payload: {
				map,
				service: new window.google.maps.places.PlacesService(map),
				infowindow: new window.google.maps.InfoWindow()
			}
		});
	} catch (error) {
		console.log('init map occuring an error', error);
	}
};
