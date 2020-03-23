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

const CardGrid = ({ type, choices, createProfile, profile }) => {
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
    console.log(profile);
    createProfile(profile);
    console.log(`Add ${choice}`);
  };
  const removeGroup = choice => {
    console.log(profile);
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
            <h3>{choice}</h3>
            <br />
            <CardMedia square imageUrl={require("../../img/flavor.jpg")} />
            <p>content</p>
          </CardPrimaryContent>

          {type === "others" && (
            <CardActions>
              <CardActionButtons>
                <button
                  onClick={() => {
                    addGroup(choice);
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
                    removeGroup(choice);
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
