import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import TextField, { Input } from "@material/react-text-field";
import Button from "@material/react-button";

import { createProfile } from "../../actions/profile";

import "@material/react-text-field/dist/text-field.css";
import "@material/react-button/dist/button.css";

const CreateProfile = ({ setEditProfile, createProfile, initProfile }) => {
  const [formData, setFormData] = useState(
    initProfile === null
      ? {
          name: "",
          bio: "",
          website: "",
          location: "",
          facebook: "",
          twitter: "",
          instagram: ""
        }
      : initProfile.social
      ? {
          name: initProfile.user.name,
          bio: initProfile.bio,
          website: initProfile.website,
          location: initProfile.location,
          facebook: initProfile.social.facebook,
          twitter: initProfile.social.twitter,
          instagram: initProfile.social.instagram
        }
      : {
          name: initProfile.user.name,
          bio: initProfile.bio,
          website: initProfile.website,
          location: initProfile.location
        }
  );
  const onSubmit = async e => {
    console.log(formData);
    await createProfile(formData, initProfile ? true : false);
    setEditProfile(false);
  };
  return (
    <div id="create-profile" className="fade-in">
      <div className="form-group">
        <TextField label="Name( *Required )" className="profile-form" outlined>
          <Input
            value={formData.name}
            onChange={e => {
              setFormData({ ...formData, name: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label="Website" outlined className="profile-form">
          <Input
            value={formData.website}
            onChange={e => {
              setFormData({ ...formData, website: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label="Address" outlined className="profile-form">
          <Input
            value={formData.location}
            onChange={e => {
              setFormData({ ...formData, location: e.currentTarget.value });
            }}
          />
        </TextField>
        {/* <TextField label="Facebook" outlined className="profile-form">
          <Input
            value={formData.facebook}
            onChange={e => {
              setFormData({ ...formData, facebook: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label="Twitter" outlined className="profile-form">
          <Input
            value={formData.twitter}
            onChange={e => {
              setFormData({ ...formData, twitter: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label="Instagram" outlined className="profile-form">
          <Input
            value={formData.instagram}
            onChange={e => {
              setFormData({ ...formData, instagram: e.currentTarget.value });
            }}
          />
        </TextField>
         */}
        <TextField
          textarea
          label="Introduction"
          className="profile-form-textarea"
          outlined
        >
          <Input
            value={formData.bio}
            onChange={e => {
              setFormData({ ...formData, bio: e.currentTarget.value });
            }}
          />
        </TextField>
        <Button
          outlined
          style={{ margin: "20px", border: "solid 1px #AAA" }}
          onClick={onSubmit}
        >
          Submit
        </Button>
        <Button
          outlined
          style={{ margin: "20px", border: "solid 1px #AAA" }}
          onClick={e => {
            setEditProfile(false);
          }}
        >
          Canceled
        </Button>
      </div>
    </div>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(CreateProfile);
