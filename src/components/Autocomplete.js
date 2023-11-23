import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TransitionItem = ({result, selectName, ...props}) => {
  console.log(props)
  let nodeRef = useRef(null);
  return (
    <CSSTransition
        nodeRef={nodeRef}
        key={result}
        classNames="result"
        timeout={{ enter: 500, exit: 300 }}
        {...props}
      >
        <li ref={nodeRef} className="nameLi" onClick={selectName}>
          {result}
        </li>
    </CSSTransition>
  )
}

const Autocomplete = ({names}) => {
  const [ inputVal, setInputVal ] = useState('');
  const [ showList, setShowList ] = useState(false);
  let inputRef = useRef();

  const handleInput = e => {
    setInputVal(prev => e.target.value);
  }

  const selectName = e => {
    e.stopPropagation();
    setInputVal(prev => e.target.innerHTML);
    setShowList(prev => false);
  }

  useEffect(() => {
    const handleOutsideClick = () => {
      // Leave dropdown visible as long as input is focused
      if (document.activeElement === inputRef.current) return;
      else setShowList(prev => false);
    }

    if (showList) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      console.log("Cleaning up event listener from Autocomplete!");
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [showList]);

  const matches = () => {
    const inputLength = inputVal.length;
    const matches = [];

    if (inputLength === 0) return names;

    names.forEach(name => {
      const nameSegment = name.slice(0, inputLength);
      if (nameSegment.toLowerCase() === inputVal.toLowerCase()) {
        matches.push(name);
      }
    });

    if (matches.length === 0) matches.push('No matches');

    return matches;
  }

  const results = matches().map((result) => {
    return (
      <TransitionItem
        key={result}
        result = {result}
        selectName = {selectName}
      />
    )
  });

  return (
      <section className="autocomplete-section">
        <h1>Autocomplete</h1>
        <div className="auto">
          <input
            placeholder="Search..."
            ref={inputRef}
            onChange={handleInput}
            value={inputVal}
            onFocus={() => setShowList(prev => true)}
          />
          {showList && (
            <ul className="auto-dropdown">
              <TransitionGroup>
                {results}
              </TransitionGroup>
            </ul>
          )}
        </div>
      </section>
    );
};




export default Autocomplete;
