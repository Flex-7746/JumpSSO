import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import localeData from 'dayjs/plugin/localeData'
// import LocalizedFormat from "dayjs/plugin/LocalizedFormat";

dayjs.extend(utc)
dayjs.extend(weekOfYear)
dayjs.extend(localeData)
// dayjs.extend(LocalizedFormat);

export default dayjs
