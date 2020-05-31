import React, { Fragment } from 'react';

const Spinner = (props) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '10',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width='64px' height='64px' viewBox='0 0 128 128'>
        <g>
          <circle cx='16' cy='64' r='16' fill='#ea79bb' fill-opacity='1' />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#f1a6d2'
            fill-opacity='0.67'
            transform='rotate(45,64,64)'
          />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#f6c7e2'
            fill-opacity='0.42'
            transform='rotate(90,64,64)'
          />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#fbe4f1'
            fill-opacity='0.2'
            transform='rotate(135,64,64)'
          />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#fdeff7'
            fill-opacity='0.12'
            transform='rotate(180,64,64)'
          />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#fdeff7'
            fill-opacity='0.12'
            transform='rotate(225,64,64)'
          />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#fdeff7'
            fill-opacity='0.12'
            transform='rotate(270,64,64)'
          />
          <circle
            cx='16'
            cy='64'
            r='16'
            fill='#fdeff7'
            fill-opacity='0.12'
            transform='rotate(315,64,64)'
          />
          <animateTransform
            attributeName='transform'
            type='rotate'
            values='0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64'
            calcMode='discrete'
            dur='720ms'
            repeatCount='indefinite'
          ></animateTransform>
        </g>
      </svg>
    </div>
  );
};

export default Spinner;
