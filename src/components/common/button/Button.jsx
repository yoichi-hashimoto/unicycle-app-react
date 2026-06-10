import React from 'react';
import classes from './Button.module.scss';

function Button({ children, onClick, disabled, variant,style }) {
    return (
        <button className={`
        ${classes.button}
        ${classes[variant]}
        `} onClick={onClick} style={style} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;