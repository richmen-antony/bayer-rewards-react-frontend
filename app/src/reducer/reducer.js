import * as actionTypes from '../action/action';
const initialState={
    topbar:true,
    sidebar:true,
    footer:true,
    loginpage:false,
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case actionTypes.TOPBAR:
        return{
            ...state,
            top_bar:!state.topbar
        };
        case actionTypes.SIDEBAR:
        return{
            ...state,
            sidebar:!state.sidebar
        };
        case actionTypes.FOOTER:
        return{
            ...state,
            footer:!state.footer
        };
        case actionTypes.LOGINPAGE:
        return{
            ...state,
            loginpage:!state.loginpage
        };
        default :
        return state;
    }
}

export default reducer;