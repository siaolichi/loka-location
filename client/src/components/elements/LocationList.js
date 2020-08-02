import React, {Fragment, useRef} from 'react';
import Transition from 'react-transition-group/Transition';
import {connect} from 'react-redux';

import LocationCard from './LocationCard';
import InfoWindow from '../elements/InfoWindow';
import {editInfowindowContent, staggerIn, staggerOut} from '../../utils';

import './LocationList.scss';

const LocationList = ({group, map, infowindow, animIn, isAuthenticated}) => {
    const infoWindowRef = useRef(null);
    const onCardClick = (location) => {
        const infowindowContent = infoWindowRef.current;
        infowindow.setContent(infowindowContent);
        editInfowindowContent(infowindowContent, location);

        const marker = new window.google.maps.Marker({
            position: location.latLng,
            map: map,
            visible: false,
        });

        infowindow.open(map, marker);
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    };

    return (
        <Transition
            in={animIn}
            mountOnEnter={true}
            unmountOnExit={true}
            addEndListener={(n, done) => {
                if (animIn) {
                    staggerIn(n.childNodes);
                } else {
                    staggerOut(n.childNodes);
                }
            }}
        >
            <div className={isAuthenticated ? 'location-list-wrapper' : 'location-list-wrapper dark'}>
                {group.locations &&
                    group.locations.map((location, index) => (
                        <LocationCard
                            location={location}
                            groupId={group._id}
                            key={index}
                            onClick={() => {
                                onCardClick(location);
                            }}
                        />
                    ))}
                <div className='location-footer'>
                    <div className='text'>this map is created by {group.user.name}</div>
                    <br />
                    <br />
                </div>
                <InfoWindow infoWindowRef={infoWindowRef} />
            </div>
        </Transition>
    );
};

const mapStateToProps = (state) => ({
    map: state.map.map,
    infowindow: state.map.infowindow,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
