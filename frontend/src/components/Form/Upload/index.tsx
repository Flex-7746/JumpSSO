import { memo, useEffect, useRef, useState, type JSX } from 'react'
import { Button, Upload, Image } from 'antd'
import { DeleteFilled, DragOutlined } from '@ant-design/icons'
import Sortable from 'sortablejs'

import api from '@/api'

import { getSizeText } from './util'

import './index.less'

interface PropsModel {
  value?: string
  onChange?: (val: string) => void
  onChangeFile?: (val: any[]) => void
  onFileDelete?: (i: number) => void
  readonly?: boolean
  maxCount?: number
  type?: 'image' | 'video' | 'file'
  dir?: string
  accept?: string
  size?: number
  wh?: string
  sortable?: boolean
  info?: { name: string; size: number }[]
  addText?: string
  addShow?: () => JSX.Element
  imgShow?: (opt: { path: string; size: string; del: () => void }) => JSX.Element
}

const ERROR = 'ERROR:'

const Component = (props: PropsModel) => {
  const [maxW, maxH = maxW] = (props.wh || '99999').split(',')
  const type = props.type || 'image'
  const accept = type === 'file' ? props.accept || '*' : `${type}/*`
  const maxSize = props.size || 3
  const maxCount = props.maxCount || 1
  const boxRef = useRef(null)
  const [sortable, setSortable] = useState<any>()

  const [fileList, setFileList] = useState<any[]>([])
  const [valueList, setValueList] = useState<string[]>([])

  // 单个上传
  const customRequestHandle = async (options: any) => {
    const { onSuccess, onError, file } = options

    if (file.size > maxSize * 1024 * 1024) {
      onError(`文件大小不能超过${maxSize}MB`)
      return
    }

    if (type !== 'file') {
      if (await (type === 'video' ? checkVideoDimensions : checkImageDimensions)(file)) {
        onError(`文件尺寸不能超过${maxW} * ${maxH}像素`)
        return
      }
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      props.dir && formData.append('dir', props.dir)

      const value = await api.post<{ fullPath: string }>('/assets/upload', formData)

      onSuccess({ url: value.fullPath }, file)
    } catch (error: any) {
      const currMsg =
        error && typeof error == 'object' ? error.statusText || error.message || JSON.stringify(error) : error || '发生错误，请稍后重试！'
      onError(currMsg)
    }
  }

  /**
   * 检查资源大小
   */
  const checkImageDimensions = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      const img = new window.Image()

      reader.onload = function (e: any) {
        img.onload = function () {
          const width = img.width
          const height = img.height
          resolve(width > Number(maxW) || height > Number(maxH))
        }
        img.src = e.target.result
      }

      reader.readAsDataURL(file)
    })
  }
  const checkVideoDimensions = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      const video = document.createElement('video')

      reader.onload = function (e: any) {
        video.onloadedmetadata = function () {
          const width = video.videoWidth
          const height = video.videoHeight
          resolve(width > Number(maxW) || height > Number(maxH))
        }
        video.src = e.target.result
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * 资源排序
   */
  const startSortable = () => {
    if (boxRef.current) {
      sortable && sortable.destroy()

      setSortable(
        new Sortable(boxRef.current, {
          animation: 150,
          handle: '.sortable-handle',
          onEnd: (v: any) => {
            const i = v.oldIndex!
            const j = v.newIndex!

            if (i === j) {
              return
            }

            const newVal = [...valueList]
            const [item] = newVal.splice(i, 1)
            newVal.splice(j, 0, item)

            props.onChange?.(newVal.join(','))
          },
        }),
      )
    }
  }

  /**
   * 获取文字信息
   */
  const getName = (i: number) => {
    const name = props.info?.[i]?.name
    return name ? name : `文件${i + 1}`
  }
  const getSize = (i: number) => {
    const val = props.info?.[i]?.size
    return typeof val !== 'undefined' ? getSizeText(val) : ''
  }

  /**
   * 获取展示 UI
   */
  const getListItem = (i: string, index: number) => {
    const del = () => {
      const newVal = [...valueList]
      newVal.splice(index, 1)
      props.onChange?.(newVal.join(','))
      props.onFileDelete?.(index)
    }

    if (type === 'image') {
      if (props.imgShow) {
        return <div key={index}>{props.imgShow({ path: i, size: getSize(index), del })}</div>
      }
    }

    return (
      <div key={`${index}_${i}`} className="item">
        {getFileItem(i, index)}

        <div className="fx-1"></div>

        {getSize(index)}

        {props.sortable ? <Button className="sortable-handle" type="primary" shape="circle" size="small" icon={<DragOutlined />} /> : <></>}

        <Button type="primary" danger shape="circle" size="small" icon={<DeleteFilled />} onClick={del} />
      </div>
    )
  }
  const getFileItem = (i: string, index: number) => {
    if (i.includes(ERROR)) {
      return <div className="err">{i.replace(ERROR, '上传失败：')}</div>
    }

    if (type === 'file') {
      return <div style={{ lineHeight: '32px' }}>{getName(index)}</div>
    }

    if (type === 'video') {
      return (
        <video
          src={i}
          style={{ width: '32px', height: '32px', cursor: 'pointer' }}
          onClick={(e) => {
            const el = e.target as HTMLVideoElement
            el.play()
            el.requestFullscreen()

            const close = () => {
              if (!document.fullscreenElement) {
                el.removeEventListener('fullscreenchange', close)
                el.pause()
                el.currentTime = 0
              }
            }

            el.addEventListener('fullscreenchange', close)
          }}
        ></video>
      )
    }

    if (type === 'image') {
      return <Image src={i} height={32} />
    }

    return <></>
  }

  useEffect(() => {
    if (props.value) {
      setValueList((props.value.split(',') || []).filter((i) => !!i))
    } else {
      setValueList([])
    }
  }, [props.value])

  useEffect(() => {
    props.sortable && startSortable()
  }, [valueList])

  return (
    <div className="g-form-upload">
      {valueList.length < maxCount ? (
        <Upload
          className="upload"
          maxCount={maxCount - valueList.length}
          multiple={maxCount > 1}
          customRequest={customRequestHandle}
          showUploadList={false}
          accept={accept}
          fileList={fileList}
          onChange={(e) => {
            setFileList(e.fileList)

            if (e.fileList.some((i) => !['error', 'done'].includes(i.status || ''))) {
              return
            }

            props.onChange?.(
              [
                ...valueList,
                ...e.fileList.map((i) => {
                  if (i.status === 'error') {
                    return `${ERROR}${i.error}`
                  } else if (i.status === 'done') {
                    return i.response.url
                  }
                }),
              ].join(','),
            )

            props.onChangeFile?.(e.fileList)

            setFileList([])
          }}
        >
          {props.addShow ? props.addShow() : <Button>点击上传</Button>}
        </Upload>
      ) : (
        <></>
      )}

      {valueList.length ? (
        <div id="sortable-box" className="box" ref={boxRef}>
          {valueList.map((i, index) => getListItem(i, index))}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(Component)
