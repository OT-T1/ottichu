import React, { useCallback, useState, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import SearchBar from '../common/searchBar';

const AutoComplete = ({
  name,
  label,
  text,
  loading,
  options,
  onChange,
  onSelect,
  // onBlur,
  colorType,
}) => {
  const optionsRef = useRef();
  const [keyword, setKeyword] = useState('');
  const [onHighlight, setOnHighlight] = useState(-1);
  const first = 0;
  const last = useMemo(() => options?.length - 1, [options]);

  // 키보드 이동 시 focus되는 아이템으로 인덱스 전환
  const navigate = useCallback(
    (keyCode) => {
      if (keyCode === 'ArrowUp') {
        return onHighlight <= first ? last : onHighlight - 1;
      }
      return onHighlight === last ? first : onHighlight + 1;
    },
    [onHighlight, first, last],
  );

  const isNameValid = useCallback(
    (value) =>
      value && options.filter((option) => value === option).length !== 0,
    [options],
  );

  // Search Bar handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!options || options.length === 0 || loading) {
        return;
      }
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        // console.log(keyword);
        // optionsRef.current.scrollTo({ top: 16, behavior: 'smooth' });
        const target = navigate(e.code);
        setOnHighlight(target);
        setKeyword(options[target]);
        return;
      }
      if (e.code === 'Enter') {
        if (typeof onSelect === 'function' && isNameValid(e.target.value)) {
          onSelect({ type: e.target.name, name: e.target.value });
          setKeyword('');
        }
      }
      // console.log('대상', e.target.value);
      // console.log(options);
    },
    [loading, options, onSelect, navigate, isNameValid],
  );

  const handleChange = useCallback(
    (e) => {
      // console.log('sdfsf', keyword, e.target.value);
      setKeyword(e.target.value);
      setOnHighlight(-1);
      if (typeof onChange === 'function' && e.target.value) {
        onChange({ type: e.target.name, name: e.target.value });
      }
    },
    [onChange],
  );

  // OptionList handler
  const handleMouseOver = useCallback(
    (e) => setOnHighlight(Number(e.target.dataset.index)),
    [],
  );

  const handleClick = useCallback(
    (e) => {
      // console.log('sdfsdf', e);
      if (optionsRef.current === e.target) {
        return;
      }
      onSelect({ type: e.target.dataset.type, name: e.target.innerText });
      setKeyword('');
    },
    [onSelect],
  );

  // const handleOuterClick = useCallback((e) => {
  //   console.log('estset', e);
  // }, []);

  // const handleBlur = useCallback(
  //   (e) => {
  //     if (typeof onBlur === 'function') {
  //       onBlur(e.target.name);
  //     }
  //   },
  //   [onBlur],
  // );

  return (
    <AutoCompleteWrapper htmlFor={`search--${name}`}>
      <span>{label}</span>
      <SearchItem>
        <SearchBar
          name={name}
          loading={loading}
          placeholder={text}
          value={keyword}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          autoComplete="off"
          colorType={colorType}
          // onBlur={handleBlur}
        />
        {options && (
          <ValidOptionList
            ref={optionsRef}
            type={name}
            loading={loading}
            onHighlight={onHighlight}
            options={options}
            onMouseOver={handleMouseOver}
            onMouseLeave={() => setOnHighlight(-1)}
            onClick={handleClick}
          />
        )}
      </SearchItem>
    </AutoCompleteWrapper>
  );
};

const ValidOptionList = React.forwardRef(
  (
    { type, loading, onHighlight, options, onMouseOver, onMouseLeave, onClick },
    ref,
  ) => (
    <OptionsWrapper
      ref={ref}
      id={`${type}-option--list`}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      listCnt={options.length}
    >
      {loading ? (
        <StyledLoadingMsg>Loading...</StyledLoadingMsg>
      ) : (
        options.map((option, index) => (
          <Option
            key={`${type}-option--${option}`}
            data-index={index}
            data-type={type}
            focus={onHighlight === index}
          >
            {option}
          </Option>
        ))
      )}
    </OptionsWrapper>
  ),
);

const AutoCompleteWrapper = styled.label`
  display: flex;
  justify-content: space-between;
  & > span:first-child {
    font-size: 0;
  }
`;

const SearchItem = styled.div`
  position: relative;
  width: 100%;
`;

const OptionsWrapper = styled.ul`
  position: absolute;
  background: #322b3f;
  color: #ffffff;
  width: 100%;
  ${(props) =>
    Number(props.listCnt) > 3
      ? css`
          height: 9rem;
          overflow-y: scroll;
        `
      : css`
          height: ${`${3 * Number(props.listCnt)}rem`};
        `}
  list-style: none;
  margin: 2px 0 0 0;
  border: 1px solid black;
  border-radius: 10px;
  padding-left: 0;
  transition: all 500ms;
  z-index: 99999;

  & > svg {
    font-size: 2rem;
  }
  & > li {
    padding: 0.8rem 0;
  }
`;

/* border-bottom: 1px solid white; */
const Option = styled.li`
  ${(props) =>
    props.focus &&
    css`
      background: #ffffff39;
    `};
  :hover {
    cursor: pointer;
  }
`;

const StyledLoadingMsg = styled.li`
  width: 100%;
  min-height: 3rem;
  background: #322b3f;
  border: 1px solid black;
  border-radius: 10px;
`;

export default AutoComplete;
