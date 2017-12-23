// @flow

import glamorous from 'glamorous';
import propStyles from 'prop-styles';
import { lighten, darken } from 'polished';

const gradient = color => `linear-gradient(${color}, ${darken(0.05, color)})`;

const hoverColor = backgroundColor => {
  return {
    background: gradient(backgroundColor),
    ':hover': {
      background: gradient(lighten(0.05, backgroundColor))
    }
  };
};

function variant(color) {
  return {
    ...hoverColor(color),
    borderColor: darken(0.08, color)
  };
}

const Button = glamorous.button(
  {
    fontSize: 'inherit',
    border: 0,
    outline: 0,
    cursor: 'pointer',
    padding: '0 10px',
    display: 'block',
    borderRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
    color: '#fff',
    ...variant('#3D9970'),
    ':active': {
      transform: 'translateY(1px)'
    }
  },
  propStyles({
    dark: variant('#3D9970'),
    light: variant('#FF4136'),
    neutral: variant('#ddd')
  })
);

export default Button;
