import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons
} from "@material/react-card";
import { createProfile } from "../../actions/profile";

const CardGrid = ({ type, choices, createProfile, profile: {profile } }) => {
  const cardStyle = {
    width: "300px",
    height: "400px",
    margin: "10px"
  };
  const containerStyle = {
    display: "flex"
  };
  const addGroup = choice => {
    if (profile.groups) profile.groups.push(choice);
    else profile.groups = [choice];
    createProfile(profile);
    console.log(`Add ${choice}`);
  };
  const removeGroup = choice => {
    let index = profile.groups.indexOf(choice);
    if (index > -1) {
      profile.groups.splice(index, 1);
    }
    createProfile(profile);
    console.log(`Remove ${choice}`);
  };
  return (
    <div style={containerStyle}>
      {choices.map((choice, i) => (
        <Card style={cardStyle} key={i}>
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
