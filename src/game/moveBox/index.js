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
  const [curLevel, setCurLevel] = useState(0);
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
      { indexX: 1, indexY: 0 },
      { indexX: 0, indexY: 1 },
      { indexX: 0, indexY: -1 },
    ];
    let isWin = false;
    let tempStep = step;

    let num = 0; // 遍历次数
    const _solve = (list, tempStep, answerStr) => {
      const cloneData = _.cloneDeep(list);
      tempStep--;
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
              num++;
              if (isWin) {
                break;
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

                const resList = mockAction(tempData);
                const resStr =
                  answerStr +
                  "$" +
                  `(${i},${j}) -> (${i + dir[k].indexX},${j + dir[k].indexY})`;
                if (judgeVictory(resList)) {
                  console.log("遍历次数：", num);
                  notification.open({
                    message: "答案",
                    duration: null,
                    description: resStr
                      .split("$")
                      .filter((item) => item)
                      .map((item1, index) => {
                        return (
                          <div key={index}>
                            第{index + 1}步 {item1}
                          </div>
                        );
                      }),
                  });
                  isWin = true;
                  setShowNum(true);
                  break;
                } else {
                  if (tempStep > 0) {
                    _solve(resList, tempStep, resStr);
                  }
                }
              }
            }
          }
        }
      }
    };

    _solve(renderList, tempStep, "");
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
