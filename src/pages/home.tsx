import { WithTitle } from "../components/withTitle"
import '../assets/css/home.css'
import { useLocation } from "preact-iso"
import { useContext, useRef } from "preact/hooks"
import toast from "react-hot-toast"
import { URLContext } from "../app"

// unencrypted

async function compressTextToArrayBuffer(text: string) {
    const compressed_rs = new Blob([text], { type: 'text/plain' }).stream().pipeThrough(new CompressionStream('deflate-raw'))
    return new Response(compressed_rs).arrayBuffer()

}

async function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}

// encrypted

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

async function encryptArrayBufferToUint8Array(buf: ArrayBuffer, password: string) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKey(password, salt)

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
buf
    )

    const encrypted_buffer = new Uint8Array(encrypted)
    const combined = new Uint8Array(salt.length + iv.length + encrypted_buffer.length)
    combined.set(salt)
    combined.set(iv, salt.length)
    combined.set(encrypted_buffer, salt.length + iv.length)
    return combined
}

async function uint8ArrayToBase64(uint8: Uint8Array) {
    let binary = ''
    for (let i = 0; i < uint8.byteLength; i++) {
        binary += String.fromCharCode(uint8[i])
    }
    return window.btoa(binary)
}



function realFunction() {
    const {setUrl} = useContext(URLContext)
    const location = useLocation()
    const text_area_ref = useRef<HTMLTextAreaElement>(null)
    const password_input_ref = useRef<HTMLInputElement>(null)
    const process_text = async () => {
        const text = text_area_ref.current?.value
        if (text === undefined || text === null || text === '') {
            toast.error('Please enter some text first.')
            return
        } else {
            if (password_input_ref.current?.value === '') {
                const base64 = (await compressTextToArrayBuffer(text).then(arrayBufferToBase64))
                .replaceAll('/', '_').replaceAll('+', '-')
                setUrl(`${import.meta.env.VITE_BASE_URL}/p/${base64}`)
            } else {
                const password = password_input_ref.current!.value
                const base64 = (await compressTextToArrayBuffer(text).then((buf) => encryptArrayBufferToUint8Array(buf, password)).then(uint8ArrayToBase64)).replaceAll('/', '_').replaceAll('+', '-')
                setUrl(`${import.meta.env.VITE_BASE_URL}/e/${base64}`)
            }
            location.route('/success')
        }
    }
    return (
        <>
        <form class="pure-form pure-form-stacked" onSubmit={
            (e) => {
                e.preventDefault()
                try {
                    process_text()
                } catch (e) {
                    toast.error('An error occurred. Please check the console for more information.')
                }
            }
        }>
            <fieldset>
                <textarea ref={text_area_ref} className="textarea" 
                placeholder={"Enter your text here..."}
                />
                <span class="pure-form-message">Maximum 140 character is recommended for manageable URL size</span>
                <input ref={password_input_ref} type="password" placeholder="Password" style={{
                    width: '100%',
                    marginTop: '10px',
                }} />
                <span class="pure-form-message">Don't fill this field if you don't want to use password</span>

                <button type="button" 
                onClick={() => {
                    try {
                        process_text()
                    } catch (e) {
                        toast.error('An error occurred. Please check the console for more information.')
                    }
                }}
                className="pure-button pure-button-primary" style={{
                    width: '100%',
                    marginTop: '20px',
                }}>Process</button>
            </fieldset>
        </form>
        <button className="button-as-anchor" type="button" style={{
            width: '100%',
            textAlign: 'right',
            marginTop: '20px',
        }}
        onClick={() => {
            location.route('/how-it-works')
        }}>How it works?</button>
        </>
    )
}

export function Home() {
    return (
        <WithTitle inside_card={realFunction} />   
    )
}