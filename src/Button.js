import glamorous from 'glamorous';
import propStyles from 'prop-styles';
import { lighten } from 'polished';

const hoverColor = backgroundColor => ({
  backgroundColor,
  ':hover': {
    backgroundColor: lighten(0.05, backgroundColor)
  }
});

const Button = glamorous.button(
  {
    fontSize: 'inherit',
    border: 0,
    outline: 0,
    cursor: 'pointer',
    padding: '0 10px',
    display: 'block',
    borderRadius: '3px',
    color: '#fff',
    ...hoverColor('rgba(0, 203, 169, 1)')
  },
  propStyles({
    dark: hoverColor('rgba(0, 203, 169, 1)'),
    light: hoverColor('rgba(255, 48, 85, 1)'),
    neutral: hoverColor('#ddd')
  })
);

export default Button;
