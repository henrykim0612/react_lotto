import React, {memo} from 'react'

// Hooks 아님 state 가 궅이 필요없기 때문에 함수형 컴포넌트임.
const Ball = memo(({number}) => {
  let background;
  if (number <= 10) {
    background = 'red';
  } else if ((10 < number) && (number <= 20)) {
    background = 'orange';
  } else if ((20 < number) && (number <= 30)) {
    background = 'yellow';
  } else if ((30 < number) && (number <= 40)) {
    background = 'blue';
  } else {
    background = 'green';
  }

  return (
    <>
      <div className="ball" style={{background}}>{number}</div>
    </>
  )
});

export default Ball