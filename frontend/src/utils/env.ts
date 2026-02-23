const UA = navigator.userAgent

export const W = document.documentElement.clientWidth || window.innerWidth || window.screen.width
export const H = document.documentElement.clientHeight || window.innerHeight || window.screen.height

export const IS_DD = /DingTalk/i.test(UA)
export const IS_FS = /Lark/i.test(UA)
export const IS_QW = /wxwork/i.test(UA)

export const IS_IOS = /iphone|ipod|ipad/i.test(UA)
export const IS_ANDROID = /android/i.test(UA)
export const IS_MOBILE = /mobile/i.test(UA) || W < 768
