// import { SearchOutlined } from 'antd/lib/icon';
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Button, message, notification } from "antd";
import "./index.less";
import fakeData from "./fakeData";
import {
  dropItem,
  removeItem,
  wait,
  swapSeat,
  clearActive,
  inArea,
} from "./moveBoxUtil";

const CUBE_WIDTH = 50;
const CUBE_HEIGHT = 50;

const Board = ({}) => {
  const [renderList, setRenderList] = useState();

  const curSeat = useRef();
  const [curLevel, setCurLevel] = useState(5);
  const [step, setStep] = useState(0);
  const [showNum, setShowNum] = useState(false);

  useEffect(() => {
    init();
    if (curLevel > 0) {
      message.success("过关");
    }
  }, [curLevel]);

  const init = () => {
    if (!fakeData[curLevel]) {
      message.success(`恭喜，目前就${curLevel + 1}关哈`);
      return;
    }
    setShowNum(false);
    curSeat.current = null;
    setStep(fakeData[curLevel].step);
    let i = 0;

    const list = fakeData[curLevel].list.map((itemX, x) => {
      return itemX.map((item, y) => {
        return { id: i++, value: item, active: false };
      });
    });

    action(list);
  };

  const judgeVictory = (list) => {
    if (list && list instanceof Array) {
      const obj = list.find((itemX) => {
        return itemX.find((item) => {
          return item.value !== 0;
        });
      });
      if (obj) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const action = async (list) => {
    setRenderList(list);
    await wait(200);
    const dropList = dropItem(list);
    await wait(200);
    setRenderList(dropList);
    await wait(200);
    const removeList = removeItem(dropList, (list) => {
      action(list);
    });
    await wait(200);
    const flag = judgeVictory(removeList);
    if (flag) {
      setCurLevel(curLevel + 1);
    }
  };

  const handelClickItem = (indexX, indexY) => {
    const data = clearActive(renderList, curSeat.current);
    if (curSeat.current) {
      // 交换位置
      if (inArea(curSeat.current, { indexX, indexY }, data)) {
        const cloneData = swapSeat(curSeat.current, { indexX, indexY }, data);
        if (cloneData) {
          setStep(step - 1);
          action(cloneData);
        } else {
          setRenderList(data);
        }
        curSeat.current = null;
      }
    } else {
      // 高亮
      if (data[indexX][indexY].value && step) {
        curSeat.current = { indexX, indexY };
        data[indexX][indexY].active = true;
        setRenderList(data);
      }
    }
  };

  const mockAction = (list) => {
    const dropList = dropItem(list);
    const removeList = removeItem(dropList, (resList) => {
      return mockAction(resList);
    });
    return removeList;
  };

  const getAnswer = () => {
    const dir = [
      { indexX: 0, indexY: 1 },
      { indexX: 0, indexY: -1 },
      { indexX: 1, indexY: 0 },
    ];
    let isWin = false;
    let tempStep = step;
    let answerList1 = [];
    const _solve = (list, tempStep, answerList) => {
      tempStep--;
      const cloneData = _.cloneDeep(list);

      for (let i = 0; i < cloneData.length; i++) {
        if (isWin) {
          break;
        }
        for (let j = 0; j < cloneData[i].length; j++) {
          if (isWin) {
            break;
          }

          if (cloneData[i][j].value) {
            for (let k = 0; k < dir.length; k++) {
              if (step === tempStep + 1) {
                answerList = [];
              }
              if (
                inArea(
                  { indexX: i, indexY: j },
                  { indexX: i + dir[k].indexX, indexY: j + dir[k].indexY },
                  cloneData
                )
              ) {
                const tempData = swapSeat(
                  { indexX: i, indexY: j },
                  { indexX: i + dir[k].indexX, indexY: j + dir[k].indexY },
                  cloneData
                );
                // if (answerList.length === 2) {
                //   answerList.pop();
                // }
                answerList.push([
                  { indexX: i, indexY: j },
                  { indexX: i + dir[k].indexX, indexY: j + dir[k].indexY },
                ]);
                const resList = mockAction(tempData);

                if (judgeVictory(resList)) {
                  console.log("resList", resList);
                  // debugger;
                  notification.open({
                    message: "答案",
                    duration: null,
                    description: answerList.map((item, index) => {
                      const { indexX, indexY } = item[0];
                      const { indexX: indexX1, indexY: indexY1 } = item[1];
                      return (
                        <div key={index}>
                          第{index + 1}步 ：
                          {`(${indexX}, ${indexY}) ->(${indexX1}, ${indexY1})`}
                        </div>
                      );
                    }),
                  });
                  isWin = true;
                  setShowNum(true);
                  break;
                } else {
                  // answerList.pop11();
                  if (tempStep > 0) {
                    _solve(tempData, tempStep, answerList);
                  }
                  //  else if (k === 2 && tempStep === 0) {
                  //   answerList = [];
                  // } else {
                  //   answerList.pop();
                  // }
                }
              } else {
                // 3个方向遍历完 且无剩余步数
                // if (k === 2 && tempStep === 0) {
                //   answerList = [];
                // }
              }
            }
          }
        }
      }
    };

    _solve(renderList, tempStep, answerList1);
  };

  return (
    <div className="boardContain">
      <div className="headerRow">
        <span className="des">第{curLevel + 1}关</span>
        <span className="des1">剩余步数{step}</span>
        <Button onClick={() => init()}>重置</Button>
        <Button onClick={() => getAnswer()}>提示</Button>
        <Button onClick={() => setShowNum(false)}>关闭标记</Button>
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
                    color: "#fff",
                    textAlign: "center",
                  }}
                  className={`item item${value} ${active && "activeItem"}`}
                  key={id}
                  // id={`item${id}`}
                >
                  {showNum && `(${indexX},${indexY})`}
                </span>
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
