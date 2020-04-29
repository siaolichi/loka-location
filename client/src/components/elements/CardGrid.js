import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons
} from '@material/react-card';
import { addGroupToProfile, removeGroupToProfile } from '../../actions/profile';
import CardModal from './CardModal';

const CardGrid = ({
  addGroupToProfile,
  removeGroupToProfile,
  type,
  choices
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editInfo, seteditInfo] = useState({
    name: '',
    description: '',
    address: ''
  });
  const cardStyle = {
    width: '300px',
    height: '400px',
    margin: '10px'
  };
  const openModal = i => {
    if (type === 'selected') {
      setIsOpen(true);
      seteditInfo(i);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const addGroup = choice => {
    addGroupToProfile(choice);
  };
  const removeGroup = choice => {
    removeGroupToProfile(choice);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        margin: 'auto'
      }}
    >
      {isOpen ? (
        <CardModal
          choice={choices[editInfo]}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      ) : (
        ''
      )}
      {choices.map((choice, i) => (
        <Card key={i} style={{ ...cardStyle, width: '300px', margin: '25px' }}>
          <CardPrimaryContent
            onClick={e => {
              openModal(i);
            }}
          >
            <div style={{ height: '4rem' }}>
              <h3>{choice.name}</h3>
            </div>
            <CardMedia square imageUrl={require('../../img/flavor.jpg')} />
            <p>{choice.description}</p>
          </CardPrimaryContent>
          <CardActions>
            {type === 'others' && (
              <CardActionButtons>
                <button
                  onClick={() => {
                    addGroup(choice.name);
                  }}
                >
                  Add
                </button>
              </CardActionButtons>
            )}
            {type === 'selected' && (
              <CardActionButtons>
                <button
                  onClick={() => {
                    removeGroup(choice.name);
                  }}
                >
                  Remove
                </button>
              </CardActionButtons>
            )}
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

CardGrid.propTypes = {
  addGroupToProfile: PropTypes.func.isRequired,
  removeGroupToProfile: PropTypes.func.isRequired
};

export default connect(null, {
  addGroupToProfile,
  removeGroupToProfile
})(CardGrid);
