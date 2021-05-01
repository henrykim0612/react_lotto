import React, {Component} from 'react'
import Ball from './Ball'

function getWinNumbers() {
  console.log('Generated');
  const candidate = Array(45).fill().map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length -1];
  const winNumbers = shuffle.splice(0, 6).sort((p, c) => p - c); // 오름차순
  return [...winNumbers, bonusNumber];
}

class Lotto extends Component {
  state = {
    winNumbers: getWinNumbers(),
    winBalls: [],
    bonus: null,
    redo: false,
  }
  timeouts = [];

  showNumbers = () => {
    const {winNumbers} = this.state;
    for (let i = 0; i < winNumbers.length; i++) {
      this.timeouts[i] = setTimeout( () => {
        this.setState((prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]]
          };
        });
      }, (i + 1) * 1000);
    }

    this.timeouts[6] = setTimeout( () => {
      this.setState({
        bonus: winNumbers[6],
        redo: true,
      });
    }, 7000);
  }

  componentDidMount() {
    this.showNumbers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.winBalls.length === 0) { // 이 조건문이 없으면 수정될때마다 계속 실행되므로 조건문이 중요함
      this.showNumbers();
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    })
  }

  onClickRedo = () => {
    this.setState({
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    });
    this.timeouts = [];
  }

  render() {
    const {winBalls, bonus, redo} = this.state;
    return (
      <>
        <div>당첨숫자</div>
        <div id="결과창">
          {winBalls.map((v) => <Ball key={v} number={v} />)}
        </div>
        <div>Bonus!</div>
        {bonus && <Ball number={bonus} />}
        {redo && <button onClick={this.onClickRedo}>한번 더!</button>}

      </>
    )
  }
}

export default Lotto