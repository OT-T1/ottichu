import React from 'react';
import styled from 'styled-components';

// TODO: title font size 0
const SectionLayout = ({ title, state, fullpageApi, contents }) => (
  <StyledSection className="section">
    <StyledLegend>{title}</StyledLegend>
    {React.cloneElement(contents, { state, fullpageApi })}
  </StyledSection>
);

export default SectionLayout;

const StyledSection = styled.fieldset`
  text-align: center;
  border: none;
  margin: 0;
  padding: 0;
  color: white;
`;

const StyledLegend = styled.legend`
  font-size: 0;
`;
