import {ADD_CITY,REMOVE_CITY} from './action.types'

export default (state,action) =>{
    switch(action.type){
        case ADD_CITY:
            return[...state,action.payload]

        case REMOVE_CITY:
            return state.filter(city=>city.id !== action.payload)
        
        default:
            return state;
    }
}