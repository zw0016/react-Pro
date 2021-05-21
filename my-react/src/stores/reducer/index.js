//合并多个reducer
import { combineReducers } from "redux";
import UserMsg from "./userInfo";
import detailInfo from "./detailInfo";
const reducer = combineReducers({
  UserMsg,
  detailInfo
});

export default reducer;
