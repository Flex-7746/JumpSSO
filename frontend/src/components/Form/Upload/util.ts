export const getSizeText = (val: number, text: boolean = true) => {
  const t = text ? '文件大小：' : ''

  const kb = val / 1024
  if (kb < 1024) {
    return `${t}${kb.toFixed(2)} KB`
  }

  const m = kb / 1024

  if (m < 1024) {
    return `${t}${m.toFixed(2)} M`
  }

  return `${t}${(m / 1024).toFixed(2)}T`
}
