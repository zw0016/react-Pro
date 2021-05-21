//默认uesrInfo为空
const UserMsg = (userInfo = {}, action) => {
  switch (action.type) {
    case "SAVE_USERMSG":
      return {
        //写入user信息
        userInfo: action.userInfo
      };
    case "CLEAR_USERMSG": {
      return {
        //退出登陆
        userInfo: {}
      };
    }
    default:
      return userInfo;
  }
};

export default UserMsg;
