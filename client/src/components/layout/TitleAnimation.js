import React, { useEffect, useRef } from 'react';
import { TweenMax } from 'gsap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

import '../../style/Animation.scss';
const TitleAnimation = ({ login }) => {
  const bubble = useRef(null);

  useEffect(() => {
    TweenMax.to(bubble.current, 1, {
      y: -50,
      opacity: 1,
      duration: 1,
      delay: 2
    });
  }, []);

  const onClick = async e => {
    e.preventDefault();
    login({ email: 'testUser@gmail.com', password: '12345678' });
  };

  return (
    <div className='landing-inner fade-in'>
      <div className='bubble-container' onClick={onClick}>
        <div className='bubble' ref={bubble}>
          Try it here!
        </div>
      </div>
      <div className='title-animation'>
        <h1 className='block-effect' style={{ '--td': '1.2s' }}>
          <div
            className='block-reveal'
            style={{ '--bc': '#fff', '--d': '.1s', fontSize: '64px' }}
          >
            LOKA
          </div>
          <div
            className='block-reveal'
            style={{ '--bc': '#fff', '--d': '.5s', fontSize: '32px' }}
          >
            Share your Maps
          </div>
        </h1>
      </div>
    </div>
  );
};
TitleAnimation.propType = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};
// const mapStateToProp = state => ({
//   isAuthenticated: state.auth.isAuthenticated
// });
export default connect(null, { login })(TitleAnimation);
