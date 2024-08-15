import { WithTitle } from "../components/withTitle";
import '../assets/css/pasted.css'
import { useLocation, useRoute } from "preact-iso";
import { useRef, useState } from "preact/hooks";
import toast from "react-hot-toast";

async function deriveKey(password: string, salt: Uint8Array) {
    const encoder = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}


async function base64ToUint8Array(base64: string) {
    const binary_string = window.atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes
}

async function decryptUint8ArrayToArrayBuffer(encrypted: Uint8Array, password: string) {
    const salt = encrypted.slice(0, 16)
    const iv = encrypted.slice(16, 28)
    const key = await deriveKey(password, salt)
    return await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encrypted.slice(28)
    )
}

async function decompressArrayBufferToText(buffer: ArrayBuffer) {
    const decompressed_rs = new Blob([buffer], { type: 'application/octet-stream' }).stream().pipeThrough(new DecompressionStream('deflate-raw'))
    return new Response(decompressed_rs).text()
}

function realFunction() {
    const route = useRoute()
    const location = useLocation()
    const password_ref = useRef<HTMLInputElement>(null)
    const [unlocked, setUnlocked] = useState(false)
    const [show_error, setShowError] = useState(false)
    const [text, setText] = useState('')
    if (route.params.b64 === undefined || route.params.b64 === '') {
        location.route('/')
    }

    const onsubmit = async () => {
        // try decrypting
        let decrypted: ArrayBuffer
        try {
            decrypted = await base64ToUint8Array(
                route.params.b64.replaceAll('_', '/').replaceAll('-', '+')
            ).then((buf) => decryptUint8ArrayToArrayBuffer(buf, password_ref.current!.value))
        } catch (e) {
            console.error(e)
            toast.error('Incorrect password')
            return;
        }
        try {
            setText(await decompressArrayBufferToText(decrypted!))
            setUnlocked(true)
        } catch (e) {
            setShowError(true)
        }
    }
    return (
        <>
        { unlocked ?
            <div class="pastebin-box" readonly>
                {text}
            </div>
        : show_error ?
            <div class="info-box error">
                <h3 class="info-box-title">URL Incorrect or Corrupted</h3>
                <p class="info-box-content">
                    Your URL is either incorrect or corrupted. Please double-check the URL and try again.
                </p>
            </div>
        :
            <>
            <div class="info-box">
                <h3 class="info-box-title">Pastebin Protected</h3>
                <p class="info-box-content">
                    This paste is encrypted. Please enter the password to view the content
                </p>
            </div>
            <form class="pure-form pure-form-stacked" style={{
                marginTop: '10px',
            }}
            onSubmit={(e) => {
                e.preventDefault()
                onsubmit()
            }}
            >
                <fieldset>
                    <input type="password" placeholder="Password" style={{
                        width: '100%',
                    }}
                    ref={password_ref}
                    />
                    <button type="button" class="pure-button pure-button-primary" style={{
                        width: '100%',
                        marginTop: '10px',
                    }}
                    onClick={onsubmit}
                    >Unlock</button>
                </fieldset>
            </form>
            </> 
        }
        </>
    )
}

export function Encrypted() {
    return (<WithTitle inside_card={realFunction} />)
}