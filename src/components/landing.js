import { useNavigate } from "react-router-dom";
import fakeLogo from '../images/fakeLogo.svg'; 


export const Landing = () => {
    const navigate = useNavigate();
    const goToLogIn = () =>{
        navigate('/logIn');
    };

    return(
        <div className="landingPage">
            <div className="landingPageHeader2">
                <div className="landingPageHeaderLogo">
                    <img src={fakeLogo}/>
                    <h1 className="landingPageTitle">Fin<span style={{color: '#ebcb92'}}>Vue</span></h1>
                </div>
                
                <button className="buttonPrimary" onClick={goToLogIn}>Log In</button>
            </div>
            <div className="landingPageContainer">
                <h4 className="landingPageSubTitle">Navigating Your <span style={{color: '#ebcb92'}}>Financial</span> <br></br> 
                <span style={{color: '#ebcb92'}}>Horizon</span> with Precision.</h4>
                <p className="landingPageBlurb">Financial clarity meets precision. 
                        Navigate your financial horizon with confidence using our cutting-edge tools and expert insights. 
                        From budgeting to investment strategies, empower yourself with the knowledge to make informed decisions.
                        Join FinVue and chart a course towards financial success with precision and ease.</p>
                <button className="buttonPrimary" id="logInBtnLandingMain" onClick={goToLogIn}>Log In</button>
            </div>
        </div>
    )
}