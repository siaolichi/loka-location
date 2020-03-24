import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons
} from "@material/react-card";
import { createProfile } from "../../actions/profile";
import CardModal from "./CardModal";

const CardGrid = ({ type, choices, createProfile, profile: { profile } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editInfo, seteditInfo] = useState({
    name: "",
    description: "",
    address: ""
  });
  const cardStyle = {
    width: "300px",
    height: "400px",
    margin: "10px"
  };
  const openModal = i => {
    setIsOpen(true);
    seteditInfo(i);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const addGroup = choice => {
    if (profile.groups) profile.groups.push(choice);
    else profile.groups = [choice];
    createProfile(profile);
  };
  const removeGroup = choice => {
    let index = profile.groups.indexOf(choice);
    if (index > -1) {
      profile.groups.splice(index, 1);
    }
    createProfile(profile);
  };
  return (
    <div style={{ display: "flex" }}>
      {isOpen ? (
        <CardModal
          choice={choices[editInfo]}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      ) : (
        ""
      )}
      {choices.map((choice, i) => (
        <Card
          style={cardStyle}
          key={i}
          onClick={e => {
            openModal(i);
          }}
        >
          <CardPrimaryContent>
            <h3>{choice.name}</h3>
            <br />
            <CardMedia square imageUrl={require("../../img/flavor.jpg")} />
            <p>{choice.description}</p>
          </CardPrimaryContent>

          {type === "others" && (
            <CardActions>
              <CardActionButtons>
                <button
                  onClick={() => {
                    addGroup(choice.name);
                  }}
                >
                  Add
                </button>
              </CardActionButtons>
            </CardActions>
          )}
          {type === "selected" && (
            <CardActions>
              <CardActionButtons>
                <button
                  onClick={() => {
                    removeGroup(choice.name);
                  }}
                >
                  Remove
                </button>
              </CardActionButtons>
            </CardActions>
          )}
        </Card>
      ))}
    </div>
  );
};

CardGrid.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(CardGrid);
