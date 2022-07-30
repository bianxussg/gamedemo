/**
 * movebox 工具类
 */

import _ from "lodash";

export const clearActive = (list, curSeat) => {
  let cloneData = _.cloneDeep(list);
  // debugger;
  if (curSeat) {
    const { indexX, indexY } = curSeat;
    cloneData[indexX][indexY].active = false;
    return cloneData;
  }
  return cloneData;
};

export const inArea = (startSeat, endSeat, list) => {
  if (
    startSeat.indexX < list.length &&
    startSeat.indexY < list[0].length &&
    endSeat.indexX < list.length &&
    endSeat.indexY < list[0].length &&
    startSeat.indexX >= 0 &&
    startSeat.indexY >= 0 &&
    endSeat.indexX >= 0 &&
    endSeat.indexY >= 0
  ) {
    return true;
  } else {
    return false;
  }
};

export const swapSeat = (startSeat, endSeat, list) => {
  if (
    !(
      startSeat.indexX === endSeat.indexX && startSeat.indexY === endSeat.indexY
    )
  ) {
    const deltaX = Math.abs(startSeat.indexX - endSeat.indexX);
    const deltaY = Math.abs(startSeat.indexY - endSeat.indexY);
    if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
      const cloneData = _.cloneDeep(list);

      [
        cloneData[startSeat.indexX][startSeat.indexY],
        cloneData[endSeat.indexX][endSeat.indexY],
      ] = [
        cloneData[endSeat.indexX][endSeat.indexY],
        cloneData[startSeat.indexX][startSeat.indexY],
      ];
      return _.cloneDeep(cloneData);
    }
  }
};

export const wait = async (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
};

export const dropItem = (list) => {
  if (list && list instanceof Array) {
    let cloneData = _.cloneDeep(list);

    for (let j = 0; j < cloneData[0].length; j++) {
      let targetX = cloneData.length - 1;
      for (let i = cloneData.length - 1; i > 0; i--) {
        if (cloneData[i][j].value !== 0) {
          if (cloneData[i][j].value !== cloneData[targetX][j].value) {
            // hasDrop = true;
            [cloneData[i][j], cloneData[targetX][j]] = [
              cloneData[targetX][j],
              cloneData[i][j],
            ];
          }
          targetX--;
        }
      }
    }
    return cloneData;
  } else {
    console.log(list);
  }
};

export const removeItem = (proplist, cb) => {
  if (proplist && proplist instanceof Array) {
    let list = _.cloneDeep(proplist);
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
      if (cb) {
        return cb(list);
      }
    } else {
      return list;
    }
  } else {
    // console.log("proplist", proplist);
  }
};
