import axios from "axios";
import React, {useState, useEffect, Fragment} from "react";
import { useParams } from "react-router-dom";

const PasswordReset = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const param = useParams();
    const link = `http://localhost:5000/reset-password/${param.id}/${param.token}`

  useEffect(() => {
    const verifyUrl = async() => {
        try {
            await axios.get(link);
            setValidUrl(true)
        } catch (error) {
            setValidUrl(false)
            
        }
    }
    verifyUrl()
  }, [param, link]);

  
  const handleSubmit = async(e) => {
    console.log(handleSubmit);
    e.preventDefault();
    try {
        const { data } = await axios.post(link, { password });
        setMsg(data.message)
        window.location = "/auth"
    } catch (error) {
        console.log(error)
    }
  };

    return (
       <Fragment>
         {validUrl ? ( 
            <div>
                <form onSubmit={handleSubmit} >
                    <h1>Create new password</h1>
                    <input 
                    type="password"
                    placeholder="Enter password"
                    name="name"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">create</button>
                </form>
            </div>
         ) : (
            <h1>404 Not Found</h1>
         )}
       </Fragment>
    )
};

export default PasswordReset;