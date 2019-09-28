import React from 'react';
import { darken } from 'polished';
import { HTMLProps } from 'react';

function makeVariant(backgroundColor: string, textColor: string) {
  return {
    backgroundColor,
    borderColor: darken(0.08, backgroundColor),
    color: textColor
  };
}

const VARIANTS: { [key: string]: [string, string] } = {
  red: ['#d1130c', '#FFF'],
  green: ['#3D9970', '#FFF'],
  teal: ['#39CCCC', '#001f3f'],
  silver: ['#1B1D25', '#ddd'],
  plain: ['#ffff', '#6666']
};

type Props = HTMLProps<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
};

function Button({ variant = 'silver', ...props }: Props) {
  return (
    <button
      {...props}
      type={props.type as any}
      style={{
        border: 0,
        cursor: 'pointer',
        padding: '0 10px',
        display: 'block',
        borderRadius: 4,
        fontSize: 'inherit',
        fontWeight: 400,
        color: '#fff',
        ...makeVariant(...VARIANTS[variant]),
        ...props.style
      }}
    />
  );
}

export default Button;
