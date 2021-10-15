import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import ContentsDiagram from './contentsDiagram';
import OttList from './ottList';
import PreferenceChart from './preferenceChart';
import api from '../../api';
import KeywordCloud from './keywordCloud';
import { selector } from '../../store/modules';

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector(selector.getUser);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setError(null);
        setResult(null);
        setLoading(true);
        const apiResult = await api.getResults({ user_code: user });
        setResult(apiResult);
        const apiData = await api.getWordCloudData({ user_code: user });
        setWordData(apiData);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchResults();
  }, [user]);

  if (loading) return <div>Loading..</div>;
  if (error) return <div>에러발생</div>;
  if (!result || !wordData) return null;

  return (
    <PageWrapper>
      <StyledTitle>분석 결과</StyledTitle>
      <StyledVisualSection>
        <PreferenceChart categories={result.category} />
        <KeywordCloud data={wordData} />
      </StyledVisualSection>
      <OttList result={result} />
      <ContentsDiagram />
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
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
  width: 8em;
  height: 3em;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 1.2em;
  line-height: 3em;
  color: #ffffff;
`;

export default ResultPage;
