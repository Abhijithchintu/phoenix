import "./welcome.css"

function Welcome() {
    return (
        <div className="welcome">
            <header className="App-header">
                <form action="http://localhost:3000/login">
                    <input type="submit" value="Login" />
                </form>
                <form action="http://localhost:3000/register">
                    <input type="submit" value="Register" />
                </form>
            </header>
        </div>
    );
}

export default Welcome;