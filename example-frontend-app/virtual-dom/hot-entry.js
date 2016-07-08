const html = require('choo/html')
const choo = require('choo')

const app = choo({ onStateChange: hmrSaveState })

app.router((route) => [ route('/', mainView) ])

app.model({
  state: { clicks: 0 },
  reducers: {
    increment (data, state) {
      return { clicks: state.clicks + 1 }
    }
  }
})

// start
const state = hmrStart()
const tree = app.start({ state: state })
document.body.appendChild(tree)

// main view
function mainView (state, prev, send) {
  return html`
    <main data-hmr-root="true">
      <p>[ edit me on the server, watch me be edited ]</p>
      <p>clicks: ${state.clicks}</p>
      <button onclick=${() => send('increment')}>
        increment + 1
      </button>
    </main>
  `
}

//
// These are custom helper functions that should be split off into an npm pkg
//

// start hot module reload
function hmrStart () {
  const appRoot = document.querySelector('[data-hmr-root="true"]')
  if (appRoot) appRoot.parentNode.removeChild(appRoot)
  console.log('reloaded!')
  return window.__state || {}
}

// catch all state change and append to document
function hmrSaveState (data, state, prev, caller, createSend) {
  window.__state = state
}
