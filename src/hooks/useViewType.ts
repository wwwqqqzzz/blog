import { useCallback, useEffect, useMemo, useState } from 'react'

export type ViewType = 'grid' | 'timeline'

export function useViewType() {
  const [viewType, setViewType] = useState<ViewType>('timeline')

  useEffect(() => {
    // 从本地存储获取视图类型
    const savedViewType = localStorage.getItem('viewType') as ViewType

    // 如果保存的是'list'或无效值，默认使用'timeline'
    if (savedViewType === 'list' || !['grid', 'timeline'].includes(savedViewType)) {
      setViewType('timeline')
      localStorage.setItem('viewType', 'timeline')
    }
    else {
      setViewType(savedViewType)
    }
  }, [])

  const toggleViewType = useCallback((newViewType: ViewType) => {
    setViewType(newViewType)
    localStorage.setItem('viewType', newViewType)
  }, [])

  return {
    viewType,
    toggleViewType,
  }
}
