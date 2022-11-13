import * as Action from "../redux/resultReducer"

export const PushAnswer = (result) => async (dispatch) => {
    try{
        await dispatch(Action.pushResultAction(result))
    }catch(err){
        console.log(err);
    }
}