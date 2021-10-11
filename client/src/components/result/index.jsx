import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ContentsDiagram from './contentsDiagram';
import OttList from './ottList';
import PreferenceChart from './preferenceChart';

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setError(null);
        setResult(null);
        setLoading(true);

        const response = await axios.get('http://localhost:5000/api/result');
        console.log(`데이터: ${response.data} 💩`);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) return <div>Loading..</div>;
  if (error) return <div>에러발생</div>;
  if (!result) return null;

  return (
    <StyledDiv>
      <StyledTitle>분석 결과</StyledTitle>
      <StyledVisualSection>
        <PreferenceChart categories={result.category} />
        <div>
          <h3>워드클라우드 받아올 것 💬</h3>
          <img src={result.word_cloud} alt="" width={300} height={250} />
        </div>
      </StyledVisualSection>
      <OttList result={result} />
      <ContentsDiagram />
      추천컨텐츠 <br />
      가격표
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  background: #0f0c1d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StyledVisualSection = styled.section`
  border: 1px solid red;
  width: 80%;
  display: flex;
  justify-content: space-evenly;
`;

const StyledTitle = styled.span`
  background: linear-gradient(90deg, #ac6aec 0%, #bb7ff5 100%);
  text-align: center;
  border-radius: 10px;
  width: 240px;
  height: 62px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 62px;
  color: #ffffff;
`;

// const StyledBtn = styled.button`
//   background: linear-gradient(90deg, #ac6aec 0%, #bb7ff5 100%);
//   border-radius: 10px;
//   width: 200px;
//   height: 70px;
//   font-family: Inter;
//   font-style: normal;
//   font-weight: 600;
//   font-size: 20px;
//   line-height: 70px;
//   color: #ffffff;
// `;

export default ResultPage;
