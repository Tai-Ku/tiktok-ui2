import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import { useRef } from 'react';

import * as searchServices from '~/apiServices/searchServices';
import { useDebounce } from '~/hooks';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';

const cx = classNames.bind(styles);
function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputReference = useRef(null);
  const handleClear = () => {
    setSearchValue('');
    setSearchResult([]);
    inputReference.current.focus();
  };

  const handleHideResults = () => {
    setShowResults(false);
  };

  const debounced = useDebounce(searchValue, 500);
  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);

      const results = await searchServices.search(debounced);
      setSearchResult(results);

      setLoading(false);
    };
    fetchApi();
  }, [debounced]);

  return (
    <HeadlessTippy
      interactive
      visible={showResults && searchResult.length > 0}
      content="TIm kiem"
      render={(attrs) => (
        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
          <PopperWrapper>
            <h4 className={cx('search-title')}>Accounts</h4>
            {searchResult.map((result) => (
              <AccountItem key={result.id} data={result} />
            ))}
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideResults}
    >
      <div className={cx('search')}>
        <input
          ref={inputReference}
          value={searchValue}
          placeholder="Tìm kiếm tài khoản và video"
          spellCheck={false}
          onChange={(e) => {
            if (e.target.value.startsWith(' ')) {
              setSearchValue('');
            } else {
              setSearchValue(e.target.value);
            }
          }}
          onFocus={() => setShowResults(true)}
        />

        {/* Có nghĩa là khi có serachValue thì nó mới hiện này lên */}
        {!!searchValue && !loading && (
          <button className={cx('clear')} onClick={handleClear}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}

        {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

        <button className={cx('search-btn')}>
          <SearchIcon />
        </button>
      </div>
    </HeadlessTippy>
  );
}

export default Search;
