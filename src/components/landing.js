import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const navigate = useNavigate();
    const goToLogIn = () =>{
        navigate('/logIn');
    };

    return(
        <div>
            <h1>
                Landing

                <button onClick={goToLogIn}>Log In</button>
            </h1>
        </div>
    )
}