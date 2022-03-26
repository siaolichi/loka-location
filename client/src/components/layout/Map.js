/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material/react-button';
import { connect } from 'react-redux';

import { copyStringToClipboard, editInfowindowContent } from '../../utils';
import InfoWindow from '../elements/InfoWindow';
import { initMap } from '../../actions/map';

import './Map.scss';

const Map = ({ group, map, infowindow, service, initMap }) => {
	const { google } = window;
	const containerRef = useRef(null);
	const infoWindowRef = useRef(null);
	const shareBtn = useRef(null);

	const [markers] = useState([]);
	useEffect(() => {
		try {
			initMap(new google.maps.Map(containerRef.current, { zoom: 11 }));
		} catch (error) {
			console.log('error initing map');
		}
	}, [group]);

	useEffect(() => {
		if (map) initSetting();
	}, [map]);

	const initSetting = () => {
		const locations = group.locations;
		new google.maps.LatLngBounds();
		// Put share button at the bottom of the map
		map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(shareBtn.current);

		// Clear marker before new markers are set
		clearMarkers();

		// If group have already location, other wise set map center to a static number
		if (locations[0]) {
			map.setCenter(locations[0].latLng);
		} else {
			map.setCenter({ lat: 120, lng: 120 });
		}

		// Marker setup
		locations.forEach(async (location) => {
			addMarker(map, location, 'marker');
		});
	};

	const addMarker = async (map, location, type = 'marker') => {
		// Marker inital setup
		const icon = {
			url: require(`../../img/${type}.png`),
			scaledSize: new google.maps.Size(50, 50),
			origin: new google.maps.Point(0, 0)
		};
		const marker = new google.maps.Marker({
			position: location.latLng,
			icon: icon,
			map: map
		});

		// InfoWindow, defined outside so it will closed automatically after another marker is clicked
		const infowindowContent = infoWindowRef.current;
		infowindow.setContent(infowindowContent);
		infowindow.close();

		//Get Place detail when marker is clicked
		google.maps.event.addListener(marker, 'click', function () {
			if (location.placeId) {
				var request = {
					placeId: location.placeId,
					fields: ['name', 'photo', 'formatted_address']
				};

				//Get place detail through api
				service.getDetails(request, (placeDetail, status) => {
					if (placeDetail) {
						location.address = placeDetail.formatted_address;
						location.photo = placeDetail.photos[0].getUrl();

						editInfowindowContent(infowindowContent, location);
					} else if (status === 'OVER_QUERY_LIMIT') {
						console.log(`${location.name} error: ${'OVER_QUERY_LIMIT'}`);
					}
				});
			} else {
				editInfowindowContent(infowindowContent, location);
			}

			//open infoWindow after got location details
			infowindow.open(map, marker);
			map.setZoom(15);
			map.setCenter(marker.getPosition());
		});

		markers.push(marker);
	};

	const clearMarkers = () => {
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		for (let i = 0; i < markers.length; i++) {
			if (markers[i].map == null) markers.splice(i, 1);
		}
	};

	return (
		<div className='fade-in' style={{ flexGrow: 1, position: 'relative' }}>
			<div ref={containerRef} className='map-container'></div>
			<InfoWindow infoWindowRef={infoWindowRef} />
			<div style={{ display: 'none' }}>
				<div className='share-map-container' ref={shareBtn}>
					<Button
						raised
						className='button'
						onClick={() => {
							copyStringToClipboard(`https://loka-location.com/map/${group._id}`);
							alert('Link is copied to your clipboard');
						}}
					>
						<Link to={`/map/${group._id}`} style={{ color: 'white' }}>
							SHARE THIS MAP!!
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	map: state.map.map,
	infowindow: state.map.infowindow,
	service: state.map.service
});

const mapDispatchToProps = {
	initMap
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
