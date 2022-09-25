import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = async(e) => {
       e.preventDefault();
       try {
          const link = `http://localhost:5000/forgot-password`;
          const { data } = await axios.post(link, {email});
          setMsg(data.message)
       } catch (error) {
        console.log(error)
       }
    };
return (
     <div>
        <form onSubmit={handleSubmit} >
            <h1>Reset password</h1>
            <p>Enter your email address</p>
            <input name="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            {msg}
            <button type="submit" >Reset password</button>
        </form>
     </div>
    )
};

export default ForgotPassword;