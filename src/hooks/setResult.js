import { postServerData } from "../helper/helper";
import * as Action from "../redux/resultReducer"

export const PushAnswer = (result) => async (dispatch) => {
    try{
        await dispatch(Action.pushResultAction(result))
    }catch(err){
        console.log(err);
    }
}

export const UpdateAnswer = (index) => async (dispatch) => {
    try{
        await dispatch(Action.updateResultAction(index));
    } catch (err) {
        console.log(err);
    }
}

/** insert user data */
export const usePostResult = (resultData) => {
    const { result, username } = resultData;
    (async () => {
        try{
            if(result == [] && !username) throw new Error("Could not get result");
            await postServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/result`, resultData, data => data)
        }catch (err) {
            console.log(err.message);
        }
    })();
}