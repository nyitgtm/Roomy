import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <h1>Student Login</h1>
            <form>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;