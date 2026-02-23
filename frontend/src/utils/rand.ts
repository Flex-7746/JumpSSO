export default function rand(len = 16) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

  const uuid: string[] = []

  for (let i = 0; i < len; i++) {
    uuid[i] = chars[Math.ceil(Math.random() * chars.length)] || chars[0]
  }

  return uuid.join('')
}
