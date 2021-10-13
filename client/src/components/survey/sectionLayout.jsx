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

// 임시 스타일링
const StyledSection = styled.fieldset`
  text-align: center;
  border: none;
  margin: 0;
  padding: 0;
  color: white;
`;

// 임시 section에 적용이 안됨 ㅠ
const StyledLegend = styled.legend`
  font-size: 0;
`;
