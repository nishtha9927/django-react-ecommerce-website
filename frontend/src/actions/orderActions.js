import axios from 'axios'
import { ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_RESET,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVERED_RESET,
    ORDER_DELIVERED_REQUEST,
    ORDER_DELIVERED_SUCCESS,
    ORDER_DELIVERED_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL, } from '../constants/orderConstants'

import { CART_CLEAR_ITEMS } from '../constants/cartConstants'

export const createOrder = (order) => async (dispatch,getState) => {
    try{
        dispatch({
            type:ORDER_CREATE_REQUEST
        })
        const {
            userLogin : {userInfo}
        } = getState()
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post('/api/orders/add/',
        order,
        config
        )

        dispatch({
            type:ORDER_CREATE_SUCCESS,
            payload:data,
        })

        dispatch({
            type:CART_CLEAR_ITEMS,
            payload:data,
        })

        localStorage.removeItem('cartItems')

        dispatch({
            type:ORDER_CREATE_RESET,
            payload:data,
        })

        


    }catch(error){
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response.status && error.response.data.detail
            ? error.response.data.detail:
            error.response.status
        })
    }
}

export const getOrderDetails = (id) => async (dispatch,getState) => {
    try{
        dispatch({
            type:ORDER_DETAILS_REQUEST
        })
        const {
            userLogin : {userInfo}
        } = getState()
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/${id}/`,
        config
        )

        dispatch({
            type:ORDER_DETAILS_SUCCESS,
            payload:data,
        })


        


    }catch(error){
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response.status && error.response.data.detail
            ? error.response.data.detail:
            error.response.status

        })
    }
}

export const payOrder = (id) => async (dispatch,getState) => {
    try{
        dispatch({
            type:ORDER_PAY_REQUEST
        })
        const {
            userLogin : {userInfo}
        } = getState()
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/${id}/paid/`,
        config
        )

        dispatch({
            type:ORDER_PAY_SUCCESS,
            payload:data
        })


        


    }catch(error){
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response.status && error.response.data.detail
            ? error.response.data.detail:
            error.response.status

        })
    }
}

export const deliverOrder = (order) => async (dispatch,getState) => {
    try{
        dispatch({
            type:ORDER_DELIVERED_REQUEST
        })
        const {
            userLogin : {userInfo}
        } = getState()
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.put(`/api/orders/${order._id}/delivered/`,
        {},
        config
        )

        dispatch({
            type:ORDER_DELIVERED_SUCCESS,
            payload:data
        })


        


    }catch(error){
        dispatch({
            type: ORDER_DELIVERED_FAIL,
            payload: error.response.status && error.response.data.detail
            ? error.response.data.detail:
            error.response.status

        })
    }
}

export const listMyOrders = () => async (dispatch,getState) => {
    try{
        dispatch({
            type:ORDER_LIST_MY_REQUEST
        })
        const {
            userLogin : {userInfo}
        } = getState()
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/myorders/`,
        config
        )

        dispatch({
            type:ORDER_LIST_MY_SUCCESS,
            payload:data,
        })


        


    }catch(error){
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail:
            error.response

        })
    }
}


export const listOrders = () => async (dispatch,getState) => {
    try{
        dispatch({
            type:ORDER_LIST_REQUEST
        })
        const {
            userLogin : {userInfo}
        } = getState()
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/`,
        config
        )

        dispatch({
            type:ORDER_LIST_SUCCESS,
            payload:data,
        })


        


    }catch(error){
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail:
            error.response

        })
    }
}


