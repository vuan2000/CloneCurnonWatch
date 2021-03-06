import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useLocation } from 'react-router-dom';

Checkout.propTypes = {
    isLogin: PropTypes.bool,
    onOrder: PropTypes.func
};

Checkout.defaultProps = {
    isLogin: false,
    onOrder: null
};

function Checkout(props) {
    const history = useHistory()
    //get url page current
    const { pathname } = useLocation()
    let { isLogin ,onOrder } = props
    let [carts, setCarts] = useState([])
    let [code, setCode] = useState('')
    let [counpon, setCoupon] = useState({})
    let [isCoupon, setIsCoupon] = useState(false)
    let [isWrongCoupon, setIsWrongCoupon] = useState(false)
    let [totalPrice, setTotalPrice] = useState(0)
    let [name, setName] = useState('')
    let [email, setEmail] = useState('')
    let [phone, setPhone] = useState('')
    let [address, setAddress] = useState('')
    let [user, setUser] = useState({})

    //get use login
    useEffect(() => {
        console.log('effect user')
        async function getUser() {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('accessTokenClient'));
    
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
    
            try {
                let response = await fetch("http://localhost:4000/api/member/me", requestOptions)
                if (response.ok) {
                    let result = await response.json()
                    console.log(result)
                    setUser(result)
                }
            } catch (error) {
                console.log('error', error)
            }
        }
        
        getUser()
    } ,[isLogin])

    //get cart
    useEffect(() => {
        function getCarts() {
            let carts = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : []
            setCarts(carts)
        }
        getCarts()
    }, [])

    //get totalPrice 
    useEffect(() => {
        async function getTotalPrice() {
            let total = await carts.reduce((initValue, cartItem) => {
                return initValue + (parseInt((cartItem.price).split('.').join('')) * parseInt(cartItem.quantity))
            }, 0)
            setTotalPrice(total)
        }
        getTotalPrice()
    })


    let handleApplyCoupon = async (e) => {
        e.preventDefault()
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        try {
            let response = await fetch("http://localhost:4000/api/coupon/" + code, requestOptions);
            if (response.status == 400) {
                setIsCoupon(false)
                setCoupon({})
                setIsWrongCoupon(true)
            }
            if (response.ok) {
                let result = await response.json()
                console.log(result)
                if (result) {
                    setCoupon(result)
                    setIsCoupon(true)
                    setIsWrongCoupon(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    let setParams = (e) => {
        if (e.target.name == 'name') {
            setName(e.target.value.trim())
        }
        if (e.target.name == 'email') {
            setEmail(e.target.value.trim())
        }
        if (e.target.name == 'phone') {
            setPhone(e.target.value.trim())
        }
        if (e.target.name == 'addess') {
            setAddress(e.target.value.trim())
        }
        if (e.target.name == 'code') {
            setCode(e.target.value.trim())
        }
    }


    //order
    let order = async (e) => {
        e.preventDefault()
        if (isLogin) {
            let totalFinal = isCoupon ? totalPrice - (totalPrice * (counpon.present / 100)) : totalPrice
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('accessTokenClient'));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                cart: carts,
                counpon: isCoupon ? counpon : null,
                user: user,
                totalFinal
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            try {
                let response = await fetch("http://localhost:4000/api/member/order", requestOptions)
                console.log(response)
                if (response.ok) {
                    localStorage.removeItem('cart')
                    if(onOrder) {
                        onOrder()
                    }
                    history.push('/confirmation')
                }
            } catch (error) {
                console.log("error ", error)
            }
        } else {
            //send url page current to page /login
            history.push({
                pathname: '/login',
                state: {
                    previousUrl: pathname
                }
            })
        }
    }

    return (
        <div className="grid wide">
            <div className="checkout">
                <div className="checkout-body">
                    <div className="checkout-info">
                        <h5 className="checkout-order__heading">th??ng tin kh??ch h??ng</h5>
                        <p className="checkout-order__note">
                            Ph????ng th???c v???n chuy???n l?? <span>FREESHIP</span> v???i ????n h??ng t??? 700.000 VND.
                        </p>
                        <form onSubmit={order} className="checkout-form">
                            <div className="form-group">
                                <input className="form__input" name="name" onChange={setParams} required placeholder="H??? t??n" />
                            </div>
                            <div className="form-group">
                                <input className="form__input" name="email" onChange={setParams} required placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <input className="form__input" name="phone" onChange={setParams} required placeholder="S??? ??i???n tho???i" />
                            </div>
                            <div className="form-group">
                                <input className="form__input" name="address" onChange={setParams} required placeholder="?????a ch??? nh???n h??ng" />
                            </div>
                            <div className="checkout-pay">
                                <p className="checkout-pay-heading">ch???n ph????ng th???c thanh to??n:</p>
                                <div className="checkout-pay-select">
                                    <div className="checkout-pay-option">
                                        <div className="checkout-pay-left">
                                            <p className="checkout-pay__heading">Thanh to??n 100%</p>
                                            <p className="checkout-pay-subheading uppercase">momo/vnpay/cod/chuy???n kho???n</p>
                                        </div>
                                        <div className="checkout-pay-right">
                                            <span><i className="ti-angle-down checkout-pay-right-icon" /></span>
                                        </div>
                                    </div>
                                    <div className="checkout-pay-option">
                                        <div className="checkout-pay-left">
                                            <p className="checkout-pay__heading">Fundiin
                                                <span><i className="ti-help-alt checkout-pay-left-icon" /></span>
                                            </p>
                                            <p className="checkout-pay-subheading">Tr??? g??p k?? h???n 3 th??ng</p>
                                        </div>
                                        <div className="checkout-pay-right">
                                            <img className="checkout-pay-right-img" src="/imgClient/fundiin-p2H.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="checkout-btn">?????t h??ng</button>
                        </form>
                        <p className="checkout-note">*L??u ??: Curnon s??? li??n l???c l???i v???i b???n trong 24h ????? x??c nh???n ????n h??ng.</p>
                        <h2 className="checkout-hotline">HOTLINE: 0868889103</h2>
                    </div>
                    <div className="checkout-order">
                        <div className="checkout-order-wrap">
                            <h1 className="order-heading">
                                ????n h??ng
                                <span className="order-heading__edit">s???a</span>
                            </h1>
                            <p className="order-subheading">
                                s???n PH???M
                                <span className="order-subheading__price">gi??</span>
                            </p>
                            <div className="order-listProduct">
                                {carts.map(cartItem => {
                                    return (
                                        <div className="order-item">
                                            <div className="order-item-wrap">
                                                <div className="order-item-picture">
                                                    <img src={"http://localhost:4000/api/download/" + cartItem.image} alt="" className="order-item-img" />
                                                </div>
                                                <div className="order-item-info">
                                                    <p className="order-item-name">{cartItem.name}</p>
                                                    <p className="order-item-cate">Category: {cartItem.category.name}</p>
                                                    <p class="order-item-quantity">Qty :{cartItem.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="order-item-price">
                                                <p className="order-item-price-current">{cartItem.price}
                                                    <span className="order-item-price-current-unit">??</span>
                                                </p>
                                                {/* <p className="order-item-price-old">3.099.000
                                                    <span className="order-item-price-old-unit">??</span>
                                                </p> */}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <form onSubmit={handleApplyCoupon} className="order-coupon">
                                <div className="order-coupon-wrap">
                                    {isCoupon ? <input type="text" className="order-coupon-input" name="code" onChange={setParams} value={code} placeholder="NH???P M?? GI???M GI??" /> :
                                        <input type="text" className="order-coupon-input" name="code" onChange={setParams} placeholder="NH???P M?? GI???M GI??" />}
                                    <button type="submit" className="order-coupon-btn">s??? d???ng</button>
                                </div>
                                {isWrongCoupon ? <p className="order-coupon-message">M?? gi???m gi?? qu?? h???n ho???c kh??ng t???n t???i</p> : ''}
                            </form>
                            <div className="order-sub-total">
                                <span className="order-sub-total__text">Th??nh ti???n</span>
                                <span className="order-sub-total__price">{totalPrice}
                                    <span className="order-sub-total__unit">??</span>
                                </span>
                            </div>
                            <div className="order-coupon-detail">
                                <span className="order-coupon-detail__text">M?? gi???m gi??</span>
                                <span className="order-coupon-detail__price">{isCoupon ? '-' + (totalPrice * (counpon.present / 100)) : 0}
                                    <span className="order-coupon-detail__unit">??</span>
                                </span>
                            </div>
                            <div className="order-total">
                                <span className="order-total__text">T???ng</span>
                                <span className="order-total__price">{isCoupon ? totalPrice - (totalPrice * (counpon.present / 100)) : totalPrice}
                                    <span className="order-total__unit">??</span>
                                </span>
                            </div>
                            <p className="order-note">(gi?? ???? bao g???m vat)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;