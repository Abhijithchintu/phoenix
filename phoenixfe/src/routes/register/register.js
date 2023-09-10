import "./register.css"

function Register() {
    return (
        <div className="register">
            <div className="register-card">
                <form>
                    <div className="input-container">
                        <label>Name</label>
                        <input type="text" name="name" required />
                    </div>
                    <div className="input-container">
                        <label>Username</label>
                        <input type="text" name="user_name" required />
                    </div>
                    <div className="input-container">
                        <label>Mobile</label>
                        <input type="text" name="mobile" required />
                    </div>
                    <select name="gender" id="gender">
                        <option value="0">male</option>
                        <option value="1">female</option>
                        <option value="2">other</option>
                    </select>
                    <div className="input-container">
                        <label>DOB</label>
                        <input type="text" name="dob" required />
                    </div>
                    <div className="input-container">
                        <label>Password</label>
                        <input type="password" name="password" required />
                    </div>
                    <div className="button-container">
                        <input type="submit" value={"Register"} formMethod={"post"} formAction={"http://localhost:3001/register"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;