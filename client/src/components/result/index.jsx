import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import ContentsDiagram from './contentsDiagram';
import OttList from './ottList';
import PreferenceChart from './preferenceChart';
import api from '../../api';
import KeywordCloud from './keywordCloud';
import { selector } from '../../store/modules';
import loadingWalk from '../../assets/images/loading_walk.gif';

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

  if (loading)
    return (
      <StyledLoadingImgWrapper>
        <img src={loadingWalk} alt="loading" />
        <StyledLoadingMessage>로딩중</StyledLoadingMessage>
      </StyledLoadingImgWrapper>
    );
  if (error) return <div>에러발생</div>;
  if (!result || !wordData) return null;

  return (
    <PageWrapper>
      <TitleWrapper>
        <img src="/images/ribbon-banner.png" alt="" />
        <StyledTitle>OTT 추천 결과</StyledTitle>
      </TitleWrapper>
      <StyledVisualSection>
        <PreferenceChart categories={result.category} />
        <KeywordCloud data={wordData} />
      </StyledVisualSection>
      <OttList result={result} />
      <ContentsDiagram data={result.diagram} />
    </PageWrapper>
  );
};

const StyledLoadingImgWrapper = styled.div`
  background: #0f0c1d;
  text-align: center;
  padding: 0;
  line-height: 100vh;
  z-index: 50;
`;

const StyledLoadingMessage = styled.p`
  color: white;
`;

const PageWrapper = styled.div`
  background: #0f0c1d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #eceff4;
  font-family: 'Pretendard';
`;

const TitleWrapper = styled.div`
  margin-top: 2em;
  position: relative;

  img {
    width: 20vw;
    height: auto;
  }
`;

const StyledTitle = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  text-align: center;
  width: 8em;
  height: 3em;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  color: black;
`;

const StyledVisualSection = styled.section`
  width: 80%;
  display: flex;
  justify-content: space-evenly;
`;

export default ResultPage;
