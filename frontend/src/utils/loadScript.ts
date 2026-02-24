const loaded = new Map<string, any>()

export default async function loadScript(url: string, globalName?: string) {
  if (!loaded.get(url)) {
    await new Promise((resovle, reject) => {
      const script = document.createElement('script')
      script.onload = resovle
      script.onerror = reject
      script.src = url
      document.head.appendChild(script)
    })

    loaded.set(url, globalName ? window[globalName as any] : true)
  }

  return loaded.get(url)
}
