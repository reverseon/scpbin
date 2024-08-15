import { WithTitle } from "../components/withTitle";
import '../assets/css/success.css';
import toast from "react-hot-toast";
import { useLocation } from "preact-iso";
import { URLContext } from "../app";
import { useContext } from "preact/hooks";
function realFunction() {
  const location = useLocation()
  const {url} = useContext(URLContext)
  if (url === undefined) {
    location.route('/')
  }

  return (
    <>
    <h2>Success 🎉</h2>
    {url !== undefined && url.length >= 8192 && <div class="info-box warning" style={{
      marginTop: '10px',
    }}>
      <h3 class="info-box-title">URL Length Exceeds 8192 Characters</h3>
      <p class="info-box-content">
        As of 2023, please consult this <a href="https://stackoverflow.com/a/417184" target="_blank">Stackoverflow's answer</a> for known character limits of different browsers.
      </p>
    </div>}
    <div class="url-container">
      <span class="truncated-url">
        {url}
      </span>
      <button class="pure-button pure-button-primary"
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(url!)
        toast.success('Copied to clipboard!')
      }}
      >Copy</button>
    </div>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: '20px',
    }}>
      <button type="button" className="pure-button" onClick={() => {
              location.route('/')
          }}
      >Back to Home</button>
      <button type="button" className="pure-button pure-button-primary" onClick={() => {
              location.route(url!)
          }}
      >Visit Bin</button>
    </div>
    </>
  )
}

export function Success() {
  return (
    <WithTitle inside_card={realFunction} />
  )
}