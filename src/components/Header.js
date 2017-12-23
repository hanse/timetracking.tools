// @flow

import React from 'react';
import { Div, H1 } from 'glamorous';

const Header = () => {
  return (
    <Div
      background="linear-gradient(#333, #323232)"
      borderBottom="4px solid #333"
      color="#fff"
      fontSize={24}
      padding="10px 20px"
    >
      <H1 margin={0} padding={0} fontSize={32} fontWeight={400}>
        Timetracker
      </H1>
    </Div>
  );
};

export default Header;
