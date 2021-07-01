import React,{useState,useEffect} from 'react'
import {Button,Col, Form} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentScreen({history}) {
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    const [paymentMethod,setPaymentMethod] = useState('Razorpay')

    if(!shippingAddress.address){
        history.push('/shipping')
    }

    const SubmitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={SubmitHandler}>
                <Form.Group>
                    <Form.Label as="legend">
                        Select Method

                    </Form.Label>
                    <Col>
                    <Form.Check
                        type='radio'
                        label='Razorpay'
                        id='Razorpay'
                        name='paymentMethod'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >

                    </Form.Check>
                    </Col>

                </Form.Group>
                <Button className="my-3" type='submit' variant='primary'>Continue</Button>

            </Form>
            
        </FormContainer>
    )
}

export default PaymentScreen

