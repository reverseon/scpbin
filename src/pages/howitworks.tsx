import { WithTitle } from "../components/withTitle"
import '../assets/css/howitworks.css'
import { useLocation } from "preact-iso"

function realFunction() {
    const location = useLocation()
    return (
        <>
        <h2>How It Works?</h2>
        <hr />
        <p>Our service employs two algorithms depending on whether password protection is required.</p>
        <h3>A. Without Password</h3>
        <ol>
            <li>We compress your text using the Raw Deflate algorithm.</li>
            <li>The compressed text is then encoded with base64.</li>
            <li>An URL is generated with the base64-encoded data as a parameter.</li>
        </ol>
        <h3>B. With Password</h3>
        <ol>
            <li>Your text is compressed using the Raw Deflate algorithm.</li>
            <li><b>The compressed text is encrypted using the AES algorithm, with your password as the encryption key.</b></li>
            <li>The encrypted text is then encoded with base64.</li>
            <li>A URL is generated with the base64-encoded data as a parameter.</li>
        </ol>
        <p>
            Important Note: This service <b>operates entirely within your browser</b> and doesn't use a backend or database (We use Compression Streams API to do the compression/decompression). Consequently:
        </p>
        <ul>
            <li>If you lose the URL, recovery is impossible.</li>
            <li>If you forget the password, the text cannot be retrieved.</li>
        </ul>
        <p>
            Please exercise caution when using this service, as there are no recovery options available.
        </p>
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

export function HowItWorks() {
    return (<WithTitle inside_card={realFunction} />)
}