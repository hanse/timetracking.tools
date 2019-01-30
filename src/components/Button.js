// @flow

import glamorous from 'glamorous';
import propStyles from 'prop-styles';
import { lighten, darken } from 'polished';

const gradient = color => `linear-gradient(${color}, ${darken(0.05, color)})`;

const hoverColor = backgroundColor => {
  return {
    background: backgroundColor,
    ':hover': {
      background: gradient(lighten(0.05, backgroundColor))
    }
  };
};

function makeVariant(backgroundColor: string, textColor: string) {
  return {
    ...hoverColor(backgroundColor),
    borderColor: darken(0.08, backgroundColor),
    color: textColor
  };
}

const VARIANTS = {
  red: ['#d1130c', '#FFF'],
  green: ['#3D9970', '#FFF'],
  teal: ['#39CCCC', '#001f3f'],
  silver: ['#1B1D25', '#ddd'],
  plain: ['#ffff', '#6666']
};

const Button = glamorous.button(
  {
    border: 0,
    cursor: 'pointer',
    padding: '0 10px',
    display: 'block',
    borderRadius: 4,
    fontSize: 'inherit',
    fontWeight: 400,
    color: '#fff',
    ...makeVariant(...VARIANTS.silver),
    ':active': {
      transform: 'translateY(1px)'
    }
  },
  propStyles(
    Object.keys(VARIANTS).reduce((styles, variant) => {
      styles[variant] = makeVariant(...VARIANTS[variant]);
      return styles;
    }, {})
  )
);

export default Button;
