import { useLocation } from "preact-iso";
import { JSX } from "preact/jsx-runtime";
import image from '../assets/img/paste.png'
export function WithTitle(props: {
  inside_card: () => JSX.Element
}) {
  const location = useLocation()
  return (
    <div className={'container'}>
      <header>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
          onClick={() => {
            location.route('/')
          }}
        >
          <img src={image} alt={'SCPBin'} style={{
            display: 'inline-block',
            width: '50px',
            aspectRatio: '1/1',
          }} />
          <h1 style={{
            display: 'inline-block',
            marginLeft: '10px',
          }}
          >SCPBin</h1>
        </div>
        <p style={{
          marginTop: '0',
        }}>Self-contained Pastebin. No database or backend is used. Nothing is stored.</p>
      </header>
      <main class={'card'} style={{
        marginTop: '30px',
      }}>
        <props.inside_card />
      </main>
      <footer class="footer">
        <p class="copyright">Made by <a href="https://www.naj.one">Thirafi Najwan</a>. Contribute on <a href="https://www.github.com/thirafi/scpbin">GitHub</a>.</p>
      </footer>
    </div>
  )
}