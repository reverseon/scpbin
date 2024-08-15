import { useLocation, useRoute } from "preact-iso";
import { WithTitle } from "../components/withTitle";
import '../assets/css/pasted.css'
import { useEffect, useState } from "preact/hooks";


async function base64ToBlob(base64: string) {
    const binary_string = window.atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    return new Blob([bytes], { type: 'application/octet-stream' })
}

async function decompressBlobToText(blob: Blob) {
    const decompressed_rs = blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))
    return new Response(decompressed_rs).text()
}

async function process_base64(base64: string) {
    base64 = base64.replaceAll('_', '/').replaceAll('-', '+')
    return await base64ToBlob(base64).then(decompressBlobToText)
}

function realFunction() {
    const route = useRoute()
    const location = useLocation()
    const [show_error, setShowError] = useState(false)
    const [show_loading, setShowLoading] = useState(true)
    const [text, setText] = useState('')
    if (route.params.b64 === undefined || route.params.b64 === '') {
        location.route('/') 
    }
    useEffect(() => {
        process_base64(route.params.b64).then((data) => {
            setText(data)
            setShowLoading(false)
        }).catch(() => {
            setShowError(true)
            setShowLoading(false)
        })
    }, [route.params.b64])
    return (
        <>
        {
            show_loading ? 
            <h5>Loading...</h5>
            : show_error ?
            <div class="info-box error">
                <h3 class="info-box-title">URL Incorrect or Corrupted</h3>
                <p class="info-box-content">
                    Your URL is either incorrect or corrupted. Please double-check the URL and try again.
                </p>
            </div>
            : <div class="pastebin-box" readonly>
                {text}
            </div>
        }
        </>
    )
}

export function Plain() {
    return (
        <WithTitle inside_card={realFunction} />
    )
}