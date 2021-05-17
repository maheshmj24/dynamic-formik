import EventDetails from './eventDetails';
import './homepage.tsx';

const SuccessPage = () => {
    return (
        <>
            <div className="split left">
                <EventDetails/>
            </div>
            <div className="split right">
                <h1>Successfully registered.</h1>
                <br/>
                <h6>You will receive a confirmation email shortly.</h6>
                <h6>Further instructions on how to attend the event will be communicated
                    closer to the event.
                </h6>
            </div>
        </>
    )
}

export default SuccessPage;