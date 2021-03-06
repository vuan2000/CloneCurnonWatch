import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import '../../assets/admin/vendors/bootstrap/dist/css/bootstrap.min.css'
// import '../../assets/admin/vendors/font-awesome/css/font-awesome.min.css'
// import '../../assets/admin/vendors/nprogress/nprogress.css'
// import '../../assets/admin/vendors/animate.css/animate.min.css'
// import '../../assets/admin/build/css/custom.min.css'

import '../../assets/admin/vendors/bootstrap/dist/css/bootstrap.min.css'
import '../../assets/admin/vendors/font-awesome/css/font-awesome.min.css'
import '../../assets/admin/vendors/nprogress/nprogress.css'
import '../../assets/admin/vendors/iCheck/skins/flat/green.css'
import '../../assets/admin/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css'
import '../../assets/admin/vendors/jqvmap/dist/jqvmap.min.css'
import '../../assets/admin/vendors/bootstrap-daterangepicker/daterangepicker.css'
import '../../assets/admin/build/css/custom.min.css'
import '../../assets/admin/build/css/style.css'

export default function LoginAdmin() {
    console.log('quay lai')
    let history = useHistory()
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")

    let setParams = (event) => {
        if (event.target.name === 'username') {
            setUsername(event.target.value)
        }
        if (event.target.name === 'password') {
            setPassword(event.target.value)
        }
    }

    let login = async (e) => {
        e.preventDefault()
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        try {
            let response = await fetch("http://localhost:8080/api/login", requestOptions)
            if(response.ok) {
                let result = await response.json()
                console.log(result)
                localStorage.setItem("accessToken" ,result.accessToken)
                history.replace("/admin")
            }
            if(response.status == 400){
                alert('T??i kho???n ho???c m???t kh???u sai')
            }
            if(response.status == 401){
                alert('T??i kho???n c???a b???n kh??ng c?? quy???n truy c???p')
            }
            if(response.status == 402){
                alert('T??i kho???n v?? m???t kh???u ph???i ??t nh???t 6 k?? t???')
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            <div className="login-admin">
                <div>
                    <a className="hiddenanchor" id="signup"></a>
                    <a className="hiddenanchor" id="signin"></a>

                    <div className="login_wrapper">
                        <div className="animate form login_form">
                            <section className="login_content">
                                <form>
                                    <h1>????ng nh???p</h1>
                                    <div>
                                        <input type="text" name="username" className="form-control" placeholder="T??i kho???n" required="" onChange={setParams} />
                                    </div>
                                    <div>
                                        <input type="password" name="password" className="form-control" placeholder="M???t kh???u" required="" onChange={setParams} />
                                    </div>
                                    <div>
                                        <a className="btn btn-default submit" onClick={login}>????ng nh???p</a>
                                        {/* <a className="reset_pass" href="#">Lost your password?</a> */}
                                    </div>

                                    <div className="clearfix"></div>

                                    <div className="separator">

                                        <div className="clearfix"></div>
                                        <br />

                                        <div>
                                            <h1><i className="fa fa-paw"></i> TimeZone!</h1>
                                            <p>Copyright Anfeed</p>
                                        </div>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}