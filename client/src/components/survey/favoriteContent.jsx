import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { actions, selector } from '../../store/modules';
import loadingWalk from '../../assets/images/loading_walk.gif';
import ImageCheckBox from '../common/ImageCheckBox';

const FavoriteContent = () => {
  const dispatch = useDispatch();
  const { loading, data: contentList } = useSelector(selector.getContentList);
  const selectionStorage = useSelector(selector.getSelectionStorage);

  const handleCheck = useCallback(
    (e) => {
      dispatch(actions.selectContent(e.target.value));
    },
    [dispatch],
  );

  return (
    <StyledFavoriteContent>
      <StyledContentWrapper>
        <legend>컨텐츠 선택 목록</legend>
        {loading ? (
          <StyledLoadingImgWrapper>
            <img src={loadingWalk} alt="loading" />
          </StyledLoadingImgWrapper>
        ) : (
          contentList?.map(([code, title, director, url]) => (
            <ImageCheckBox
              key={code}
              id={code}
              name={title}
              width="12vw"
              height="30vh"
              url={url}
              value={code}
              defaultChecked={code in selectionStorage}
              onClick={handleCheck}
              info={director}
            />
          ))
        )}
      </StyledContentWrapper>
    </StyledFavoriteContent>
  );
};

const StyledFavoriteContent = styled.div`
  width: 100vw;
`;

const StyledContentWrapper = styled.fieldset`
  position: relative;
  height: 65vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  padding: 0 15vw;
  /* margin: auto; */
  border: none;
  font-size: 0;

  :hover {
    opacity: 1;
  }
  @media screen and (max-width: 780px) {
  }

  & > legend {
    font-size: 0;
  }
`;

const StyledLoadingImgWrapper = styled.div`
  padding: 0;
  line-height: 100vh;
  z-index: 50;
`;

// const StyledContent = styled.label`;
//   width: 10vw;
//   height: 30vh;
//   animation: 2s ease-in-out normal smulsmul;
//   @keyframes smulsmul {
//     // 임시
//     from {
//       opacity: 0;
//     }
//     to {
//       opacity: 0.8;
//     }
//   }
//   & > input {
//     -webkit-appearance: none;
//     -moz-appearance: none;
//     appearance: none;
//     width: 0;
//     height: 0;
//     margin: 0;
//     padding: 0;
//   }
// `;

export default FavoriteContent;

// {
/* <StyledContent htmlFor="title">
  <input
    id="title"
    type="checkbox"
    value={code}
    // defaultChecked={true}
  />
  <img src={url} director={director} alt={title} value={code} />
</StyledContent>; */
// }

// const StyledContentWrapper = styled.fieldset`
//   border: none;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   justify-content: space-around;
//   align-content: space-around;
//   /* padding: 0 15vw; */
//   list-style: none;
//   text-align: center;
//   margin: auto;
//   /* width: 100%; */
//   & > li {
//     /* display: table-cell;
//      vertical-align: middle; */
//     width: 18%;
//     /* height: 20%; */
//     margin: 20px 0;
//     opacity: 0.8;
//     cursor: pointer;
//     > img {
//       width: 100%;
//       height: 100%;
//     }
//     :hover {
//       opacity: 1;
//     }
//   }
//   @media screen and (max-width: 780px) {
//     flex-direction: column;
//   }
// `;
// // TODO: 제대로 안돼~
// const StyledLoadingImgWrapper = styled.li`
//   padding: 0;
//   line-height: 100vh;
//   z-index: 50;
// `;
// // const StyledContent = styled.label`
// //   width: 10vw;
// //   height: 30vh;
// //   animation: 2s ease-in-out normal smulsmul;
// //   @keyframes smulsmul {
// //     // 임시
// //     from {
// //       opacity: 0;
// //     }
// //     to {
// //       opacity: 0.8;
// //     }
// //   }
// //   & > input {
// //     -webkit-appearance: none;
// //     -moz-appearance: none;
// //     appearance: none;
// //     width: 0;
// //     height: 0;
// //     margin: 0;
// //     padding: 0;
// //   }
// // `;
