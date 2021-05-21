//默认uesrInfo为空
const detailInfo = (detailInfo = {}, action) => {
  switch (action.type) {
    case "SAVE_DETAIL":
      return {
        //写入修改信息
        detailInfo: action.detailInfo
      };
    default:
      return detailInfo;
  }
};

export default detailInfo;
