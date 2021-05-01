import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import Ball from './Ball';

const getWinNumbers = () => {
  console.log('getWinNumbers');
  const candidate = Array(45).fill().map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.splice(0, 6).sort((a, b) => a - b); // Asc
  return [...winNumbers, bonusNumber];
}

const Lotto = () => {

  const cacheNumbers = useMemo(() => getWinNumbers(), []); // 배열 인자가 없으면 한번만 실행됨, 있다면 그 조건일때마다 실행
  // 왜 cacheNumbers 를 사용했는가? useEffect 가 동작하면서 Lotto 함수를 다시 실행하게 되는데 그러면서 getWinNumbers()를
  // 계속 호출하기 때문에 성능저하가 생긴다(Class 는 괜찮은데 Hooks 는 함수형 타입이기 때문에 이런 문제가 생김)
  // 그래서 useMemo를 사용해서 캐시값처럼 가지고 있게 한다.
  const [winNumbers, setWinNumbers] = useState(cacheNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  const showNumbers = () => {
    console.log('showNumbers');
    for (let i = 0; i < winNumbers.length; i++) {
      timeouts.current[i] = setTimeout( () => {
        setWinBalls((prevWinBalls) => [...prevWinBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout( () => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
  };

  // 예를 들어서 componentDidMount 만 필요한경우
  useEffect( () => {
    // 컴포넌트가 처음 호출될때 비동기로 데이터를 가져옴
  }, []);

  // componentUpdate 만 호출하고 싶을때. componentDidMount(x)
  // useEffect 는 기본적으로 한번은 실행이 되므로 패턴같은 문법이 있음
  const mounted = useRef(false);
  useEffect( () => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // 비동기 데이터를 호출하여 리렌더링
    }
  }, [/*바뀌는값*/]);


  useEffect(() => {
    console.log('useEffect');
    showNumbers();
    return () => {
      // componentWillUnmount
      timeouts.current.forEach((v) => clearTimeout(v));
    }
  }, [timeouts.current]); // 빈 배열이면 componentDidMount 와 동일. 배열에 요소가 있으면 componentDidMount, componentDidUpdate 둘 다 수행.

  // 만약 아래 주석처럼 onClick으로 자식 컴포넌트에게 전달하는 함수인 경우에는 useCallback 을 붙여주자.
  // 함수가 바뀐게 없는데 계속 렌더링 할 필요 없으므로.
  const onClickRedo = useCallback(() => {
    console.log('onclick');
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

  return (
    <>
      <div>당첨숫자</div>
      <div id="결과창">
        {/*{winBalls.map((v) => <Ball key={v} number={v} onClick={onClickRedo()}/>)}*/}
        {winBalls.map((v) => <Ball key={v} number={v} />)}
      </div>
      <div>Bonus!</div>
      {bonus && <Ball number={bonus} />}
      {redo && <button onClick={onClickRedo}>한번 더!</button>}
    </>
  )
}

export default Lotto;