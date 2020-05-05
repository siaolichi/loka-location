import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';

import { createProfile } from '../../actions/profile';
import './CreateProfile.scss';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-button/dist/button.css';

const CreateProfile = ({ setEditProfile, createProfile, initProfile }) => {
  const [formData, setFormData] = useState(
    initProfile === null
      ? {
          name: initProfile.user.name,
          email: initProfile.user.email,
          bio: '',
          website: '',
          location: '',
          facebook: '',
          twitter: '',
          instagram: ''
        }
      : initProfile.social
      ? {
          name: initProfile.user.name,
          email: initProfile.user.email,
          bio: initProfile.bio,
          website: initProfile.website,
          location: initProfile.location,
          facebook: initProfile.social.facebook,
          twitter: initProfile.social.twitter,
          instagram: initProfile.social.instagram
        }
      : {
          name: initProfile.user.name,
          email: initProfile.user.email,
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
    <div id='create-profile' className='fade-in'>
      <div className='form-group'>
        <TextField label='Name' className='profile-form' outlined disabled>
          <Input
            disabled
            value={formData.name}
            onChange={e => {
              setFormData({ ...formData, name: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label='Email' className='profile-form' outlined disabled>
          <Input
            disabled
            value={formData.email}
            onChange={e => {
              setFormData({ ...formData, email: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label='Website' outlined className='profile-form'>
          <Input
            value={formData.website}
            onChange={e => {
              setFormData({ ...formData, website: e.currentTarget.value });
            }}
          />
        </TextField>
        <TextField label='Address' outlined className='profile-form'>
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
          label='Introduction'
          className='profile-form-textarea'
          outlined
        >
          <Input
            value={formData.bio}
            onChange={e => {
              setFormData({ ...formData, bio: e.currentTarget.value });
            }}
          />
        </TextField>
        <Button outlined style={{ margin: '20px' }} onClick={onSubmit}>
          <b>Submit</b>
        </Button>
        <Button
          outlined
          style={{ margin: '20px' }}
          onClick={e => {
            setEditProfile(false);
          }}
        >
          <b>Canceled</b>
        </Button>
      </div>
    </div>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(CreateProfile);
