import { useLocation } from "preact-iso";
import { WithTitle } from "../components/withTitle";

export function realFunction() {
    const location = useLocation()
    return (
        <>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }} >
            <h1>Page Not Found</h1>
        </div>
        <button type="button" className="pure-button pure-button-primary" onClick={() => {
            location.route('/')
        }}
        style={{
            marginTop: '20px',
        }}
        >Back to Home</button>
        </>
    )
}

export function NotFound() {
    return (
        <WithTitle inside_card={realFunction} />   
    )
}