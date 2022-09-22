import * as api from '../api/index.js';

export const claim = (claim) => async (dispatch) => {
    try {
        const { data } = await api.claim(claim);

       dispatch({type: 'CLAIM', payload: data });
       
       //after claiming
       

    } catch (error) {
        console.log(error)
    }
};