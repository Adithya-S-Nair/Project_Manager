import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    const navigate = useNavigate();
    return (
        <div className="bg-gray-100 h-screen flex items-center">
            <div className="container mx-auto">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-semibold mb-6">Welcome to Project Manager</h1>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => {
                                navigate('/login')
                            }}
                            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
                            Login
                        </button>
                        <button
                            onClick={() => {
                                navigate('/register')
                            }}
                            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
