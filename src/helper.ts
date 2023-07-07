import { ColumnProps, ImageProps, UserProps } from '@/store'

export function generateFitUrl (data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

// column: ColumnProps, width: number, height: number) {
// if (column.avatar) {
//   column.avatar.fitUrl = column.avatar.url + ''
// } else {
//   column.avatar = {
//     fitUrl: require('./assets/logo.png')
//   }
// }
// }
// 当图片不存在时，添加默认图片
export function addColumnAvatar (data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpeg' : '@/assets/logo.png')
    }
  }
}
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}
// 把数据变成一系列的数组的方法
export const objToArr = <T>(obj: {[key:string]: T }) => {
  return Object.keys(obj).map(key => obj[key])
}
// 测试数据
interface TestProps {
  _id: string;
  name: string
}
const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
// 把数组变成对象
export const arrToObj = <T extends { _id?: string}>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as {[key: string]: T})
}
const result = arrToObj(testData)
// console.log(result)

const testData2: {[key: string]: TestProps} = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}
const result2 = objToArr(testData2)
// console.log(result2)
