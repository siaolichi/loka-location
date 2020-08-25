import {TweenMax, Power2} from 'gsap';

export const staggerIn = (nodes) => {
    TweenMax.staggerFromTo(
        nodes,
        0.75,
        {
            marginRight: '100px',
            opacity: 0,
        },
        {
            marginRight: '25px',
            opacity: 1,
        },
        0.1
    );
};
export const staggerOut = (nodes, callback) => {
    TweenMax.staggerFromTo(
        nodes,
        0.75,
        {
            marginRight: '25px',
            opacity: 1,
        },
        {
            marginRight: '100px',
            opacity: 0,
        },
        -0.2,
        callback
    );
};
export const fadeIn = (nodes, callback) => {
    TweenMax.staggerFromTo(
        nodes,
        0.5,
        {
            opacity: 0,
        },
        {
            opacity: 1,
        },
        -0.05,
        callback
    );
};
export const fadeOut = (nodes, callback) => {
    TweenMax.staggerFromTo(
        nodes,
        0.5,
        {
            marginRight: '25px',
            opacity: 1,
        },
        {
            marginRight: '100px',
            opacity: 0,
        },
        -0.05,
        callback
    );
};
