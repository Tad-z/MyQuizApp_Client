import { createSlice } from "@reduxjs/toolkit"

/** create reducer */
export const questionReducer = createSlice({
    name: "questions",
    initialState: {
        queue: [],
        answers: [],
        trace: 0
    },
    /** reducers help to specify and dispatch an action */
    /** action changes the value of the store */
    reducers : {
        /** state is the current state */
        /** action to access the values of the user input */
        startExamAction: (state, action) => {
            return {
                ...state,
                queue : action.payload
            }
        },
        moveNextAction: (state) => {
            return {
                ...state,
                trace: state.trace + 1
            }
        },
        movePrevAction: (state) => {
            return {
                ...state,
                trace: state.trace - 1
            }
        },
        resetAllAction: () => {
            return {
                queue: [],
                answers: [],
                trace: 0
            }
        }
    }
})

export const { startExamAction, moveNextAction, movePrevAction, resetAllAction } = questionReducer.actions

export default questionReducer.reducer;