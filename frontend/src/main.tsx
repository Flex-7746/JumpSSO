import { createRoot } from 'react-dom/client'

import setRootSize from '@/utils/setRootSize'

import '@/lib/i18n'
import '@/lib/dayjs'

import App from '@/App'

async function render(el: HTMLElement = document.getElementById('root')!) {
  await setRootSize()

  const root = createRoot(el)

  root.render(<App />)
}

render()
