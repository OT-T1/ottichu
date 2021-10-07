import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    <div>
      <h2>Result Page</h2>
      <PreferenceChart categories={result.category} />
      <h3>워드클라우드 받아올 것 💬</h3>
      <img src={result.word_cloud} alt="" width={300} height={250} />
      <OttList expectedData={result} />
      <ContentsDiagram />
      추천컨텐츠 <br />
      가격표
    </div>
  );
};

export default ResultPage;
