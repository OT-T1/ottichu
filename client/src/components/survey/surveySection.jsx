import React from 'react';

// TODO: title font size 0
const SurveySection = ({ title, contents }) => (
  <fieldset className="section">
    <legend>{title}</legend>
    {contents}
  </fieldset>
);

export default SurveySection;
