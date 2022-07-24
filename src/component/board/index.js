// import { SearchOutlined } from 'antd/lib/icon';
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Button, message } from "antd";
import "./index.less";
import fakeData from "./fakeData";

const CUBE_WIDTH = 50;
const CUBE_HEIGHT = 50;

const Board = ({}) => {
  const [renderList, setRenderList] = useState();
  const refRenderList = useRef([]);
  const curSeat = useRef();
  const [curProgress, setCurProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    init();
    if (curProgress > 0) {
      message.success("过关");
    }
  }, [curProgress]);

  const init = () => {
    if (!fakeData[curProgress]) {
      message.success("恭喜，目前就5关哈");
      return;
    }
    curSeat.current = null;
    setStep(fakeData[curProgress].step);
    let i = 0;

    const list = fakeData[curProgress].list.map((itemX, x) => {
      return itemX.map((item, y) => {
        return { id: i++, value: item, active: false };
      });
    });
    refRenderList.current = list;
    action();
  };

  const judgeVictory = () => {
    const obj = refRenderList.current.find((itemX) => {
      return itemX.find((item) => {
        return item.value !== 0;
      });
    });
    if (!obj) {
      setTimeout(() => {
        setCurProgress(curProgress + 1);
      }, 500);
    }
  };

  const action = () => {
    setRenderList(refRenderList.current);
    setTimeout(() => {
      dropItem();
      setTimeout(() => {
        setRenderList(refRenderList.current);
        setTimeout(() => {
          setRenderList(refRenderList.current);
        }, 200);
        removeItem();
        judgeVictory();
      }, 200);
    }, 200);
  };

  const clearActive = () => {
    curSeat.current = null;
    const cloneData = _.cloneDeep(renderList);
    return cloneData.map((itemX) => {
      return itemX.map((item) => {
        return { ...item, active: false };
      });
    });
  };

  const isArea = (seat) => {
    if (
      seat.indexX < refRenderList.current[0].length &&
      seat.indexY < refRenderList.current.length
    ) {
      return true;
    }
    return false;
  };

  const dropItem = () => {
    let cloneData = _.cloneDeep(refRenderList.current);
    let hasDrop = false;
    for (let j = 0; j < cloneData[0].length; j++) {
      let targetX = cloneData.length - 1;
      for (let i = cloneData.length - 1; i > 0; i--) {
        if (cloneData[i][j].value !== 0) {
          if (cloneData[i][j].value !== cloneData[targetX][j].value) {
            hasDrop = true;
            [cloneData[i][j], cloneData[targetX][j]] = [
              cloneData[targetX][j],
              cloneData[i][j],
            ];
          }
          targetX--;
        }
      }
    }
    // console.log(cloneData);
    // setRenderList(cloneData);
    refRenderList.current = cloneData;
  };

  const removeItem = () => {
    let list = refRenderList.current;
    let hasRemove = false;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[0].length; j++) {
        // debugger;
        if (
          list[i][j].value !== 0 &&
          list[i + 1] &&
          list[i + 2] &&
          list[i][j].value === list[i + 1][j].value &&
          list[i + 1][j].value === list[i + 2][j].value
        ) {
          list[i][j].remove = true;
          list[i + 1][j].remove = true;
          list[i + 2][j].remove = true;
          hasRemove = true;
        }
        if (
          list[i][j].value !== 0 &&
          list[i][j + 1] &&
          list[i][j + 2] &&
          list[i][j].value === list[i][j + 1].value &&
          list[i][j + 1].value === list[i][j + 2].value
        ) {
          list[i][j].remove = true;
          list[i][j + 1].remove = true;
          list[i][j + 2].remove = true;
          hasRemove = true;
        }
      }
    }
    if (hasRemove) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[0].length; j++) {
          if (list[i][j].remove) {
            list[i][j].value = 0;
          }
        }
      }
      action();
    }
  };

  // useEffect(() => {
  //   renderList && dropItem();
  // }, [renderList]);

  // 手动移动 不渲染数据
  const swapSeat = (startSeat, endSeat) => {
    if (
      startSeat.indexX === endSeat.indexX &&
      startSeat.indexY === endSeat.indexY
    ) {
    } else {
      const deltaX = Math.abs(startSeat.indexX - endSeat.indexX);
      const deltaY = Math.abs(startSeat.indexY - endSeat.indexY);

      if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
        const cloneData = clearActive();
        [
          cloneData[startSeat.indexX][startSeat.indexY],
          cloneData[endSeat.indexX][endSeat.indexY],
        ] = [
          cloneData[endSeat.indexX][endSeat.indexY],
          cloneData[startSeat.indexX][startSeat.indexY],
        ];
        return cloneData;
      } else {
      }
    }
  };

  const handelClickItem = (indexX, indexY) => {
    if (curSeat.current) {
      // 交换位置
      const cloneData = swapSeat(curSeat.current, { indexX, indexY });
      if (cloneData) {
        refRenderList.current = cloneData;
        setStep(step - 1);
        action();
      } else {
        const data = clearActive();
        setRenderList(data);
      }
    } else {
      // 高亮
      const data = clearActive();
      if (data[indexX][indexY].value && step) {
        curSeat.current = { indexX, indexY };
        data[indexX][indexY].active = true;
        refRenderList.current = data;
        setRenderList(refRenderList.current);
      }
    }
  };

  const getAnswer = () => {
    const cloneData = _.cloneDeep(renderList);
  };

  return (
    <div className="boardContain">
      <div className="headerRow">
        <span className="des">第{curProgress + 1}关</span>
        <span className="des1">剩余步数{step}</span>
        <Button onClick={() => init()}>重置</Button>
        <Button onClick={() => getAnswer()}>提示</Button>
      </div>

      {renderList && (
        <div
          className="board"
          style={{
            height: renderList.length * (CUBE_HEIGHT + 10) + "px",
            width: renderList[0].length * (CUBE_WIDTH + 10) + "px",
          }}
        >
          {renderList.map((itemX, indexX) => {
            return itemX.map((item, indexY) => {
              const { id, value, active } = item;
              return (
                <span
                  onClick={() => handelClickItem(indexX, indexY)}
                  style={{
                    width: CUBE_WIDTH,
                    height: CUBE_HEIGHT,
                    top: indexX * CUBE_HEIGHT + indexX * 10 + "px",
                    left: indexY * CUBE_WIDTH + indexY * 10 + "px",
                  }}
                  className={`item item${value} ${active && "activeItem"}`}
                  key={id}
                  // id={`item${id}`}
                ></span>
              );
            });
          })}
        </div>
      )}
    </div>
  );
};
// export default Home
export default Board;
