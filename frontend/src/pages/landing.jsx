import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
export default function LandingPage() {


    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>Apna Video Call</h2>
                </div>
                <div className='navlist'>
                    <button className='navAction' onClick={() => router("/aljk23")}>Join as Guest</button>
                    <button className='navAction' onClick={() => router("/auth")}>Register</button>
                    <button className='navAction navActionPrimary' onClick={() => router("/auth")}>Login</button>
                </div>
            </nav>


            <div className="landingMainContainer">
                <div className='heroText'>
                    <h1><span className='heroHighlight'>Connect</span> with your loved ones in real time</h1>

                    <p>Fast, reliable meetings with chat, screen sharing, and one-click rejoin from history.</p>
                    <div className='heroButtons'>
                        <button className='heroCta' onClick={() => router("/auth")}>Get Started</button>
                        <button className='heroSecondary' onClick={() => router("/auth")}>Explore Features</button>
                    </div>
                </div>
                <div className='heroVisual'>
                    <div className='deviceFrame'>
                        <img src="/mobile.png" alt="Video call app preview" />
                    </div>
                </div>
            </div>



        </div>
    )
}