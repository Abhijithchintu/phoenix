import "./login.css"

function Login() {
    return (
        <div className="login">
            <div className="login-card">
                <form>
                    <div className="input-container">
                        <label>Username</label>
                        <input type="text" name="user_name" required />

                    </div>
                    <div className="input-container">
                        <label>Password</label>
                        <input type="password" name="password" required />

                    </div>
                    <div className="button-container">
                        <input type="submit" value={"Login"} formMethod={"post"} formAction={"http://localhost:3001/login"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;