/**
 * API Helper functions for fetching data from external APIs
 * Provides fallback for local development and implements caching
 */

// 导入开发环境代理
import { devProxy } from './dev-proxy'

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Base URL for API calls
const getApiBaseUrl = () => {
  // 在开发和生产环境中都使用相对URL
  if (isDevelopment) {
    console.log('开发环境: 使用真实API数据')
  }
  // 返回空字符串以使用相对URL
  return ''
}

// 是否使用模拟数据（现在始终为false，因为我们想使用真实API）
const useMockData = false

// 默认位置配置
const DEFAULT_LOCATION = {
  city: '南京',
  region: '江苏省',
  country: '中国',
  latitude: 32.0584,
  longitude: 118.7965,
}

/**
 * Cache configuration
 */
const CACHE_KEYS = {
  WEATHER: 'cached_weather_data',
  LOCATION: 'cached_location_data',
}

const CACHE_EXPIRY = {
  WEATHER: 30 * 60 * 1000, // 30 minutes in milliseconds
  LOCATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
}

/**
 * Generic cache interface
 */
interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Check if cached data is still valid
 */
function isCacheValid<T>(cachedData: CachedData<T> | null, expiryTime: number): boolean {
  if (!cachedData) return false

  const now = Date.now()
  const isExpired = now - cachedData.timestamp > expiryTime

  return !isExpired
}

/**
 * Safely get data from cache with null check
 */
function safeGetCachedData<T>(cachedData: CachedData<T> | null): T | null {
  return cachedData ? cachedData.data : null
}

/**
 * Get data from cache
 */
function getFromCache<T>(key: string): CachedData<T> | null {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') return null

    const cachedItem = localStorage.getItem(key)
    if (!cachedItem) return null

    return JSON.parse(cachedItem) as CachedData<T>
  }
  catch (error) {
    // If there's any error reading from cache, return null
    return null
  }
}

/**
 * Save data to cache
 */
function saveToCache<T>(key: string, data: T): void {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const cacheItem: CachedData<T> = {
      data,
      timestamp: Date.now(),
    }

    localStorage.setItem(key, JSON.stringify(cacheItem))
  }
  catch (error) {
    // Silently fail if we can't save to cache
    console.warn('Failed to save data to cache:', error)
  }
}

/**
 * Weather data interface
 */
interface WeatherData {
  code: string
  now: {
    temp: string
    text: string
    icon: string
    windDir?: string
    windScale?: string
    humidity?: string
  }
}

/**
 * 通过代理从和风天气API获取天气数据
 * @param location 位置代码，默认为101190101（南京）
 */
async function fetchQWeatherDirectly(location: string = '101190101'): Promise<WeatherData> {
  try {
    const baseUrl = getApiBaseUrl()

    // 如果配置为使用模拟数据
    if (useMockData) {
      console.log('使用模拟天气数据')
      // 返回模拟数据
      return {
        code: '200',
        now: {
          temp: '25',
          text: '晴朗',
          icon: '100',
          windDir: '东南风',
          windScale: '3',
          humidity: '65',
        },
      }
    }

    // 在生产环境中，使用我们的API代理
    try {
      const response = await fetch(`${baseUrl}/api/weather?location=${location}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })

      if (!response.ok) {
        throw new Error(`天气API响应状态: ${response.status}`)
      }

      return await response.json()
    }
    catch (fetchError) {
      console.warn('通过代理获取和风天气数据时出错:', fetchError)
      // 如果API调用失败，返回模拟数据
      return {
        code: '200',
        now: {
          temp: '25',
          text: '晴朗',
          icon: '100',
          windDir: '东南风',
          windScale: '3',
          humidity: '65',
        },
      }
    }
  }
  catch (error) {
    console.warn('获取天气数据时出错:', error)
    // 返回模拟数据
    return {
      code: '200',
      now: {
        temp: '25',
        text: '晴朗',
        icon: '100',
        windDir: '东南风',
        windScale: '3',
        humidity: '65',
      },
    }
  }
}

/**
 * Fetch weather data from QWeather API with caching
 * Uses real-time data in both development and production
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<WeatherData>(CACHE_KEYS.WEATHER)

    if (isCacheValid(cachedData, CACHE_EXPIRY.WEATHER)) {
      const data = safeGetCachedData(cachedData)
      if (data) return data
    }

    // Get location data first to determine the correct city
    let cityCode = '101190101' // Default to Nanjing
    try {
      const locationData = await fetchLocationData()
      if (locationData && locationData.city) {
        // Convert city name to code
        cityCode = await getCityCode(locationData.city)
      }
    }
    catch (locationError) {
      console.warn('Error getting location for weather:', locationError)
    }

    // If no valid cache, fetch new data
    let weatherData: WeatherData

    try {
      // Always use our API proxy in both development and production
      weatherData = await fetchQWeatherDirectly(cityCode)
    }
    catch (fetchError) {
      console.warn('Error fetching from primary source, trying fallback:', fetchError)

      // If direct API call fails in development, try the API proxy as fallback
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/weather?location=${cityCode}`)
        weatherData = await response.json()
      }
      catch (fallbackError) {
        console.warn('Fallback also failed, using default data:', fallbackError)

        // If all API calls fail, use fallback data
        weatherData = {
          code: '200',
          now: {
            temp: '25',
            text: '晴朗',
            icon: '100',
            windDir: '东南风',
            windScale: '3',
            humidity: '65',
          },
        }
      }
    }

    // Save the new data to cache (only if it's valid)
    if (weatherData && weatherData.code === '200' && weatherData.now) {
      saveToCache(CACHE_KEYS.WEATHER, weatherData)
    }

    return weatherData
  }
  catch (error) {
    console.warn('Error fetching weather data:', error)

    // Try to return cached data even if expired
    const cachedData = getFromCache<WeatherData>(CACHE_KEYS.WEATHER)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // If no cached data available, return fallback data
    return {
      code: '200',
      now: {
        temp: '25',
        text: '晴朗',
        icon: '100',
      },
    }
  }
}

/**
 * Location data interface
 */
interface LocationData {
  city: string
  region?: string
  country?: string
  latitude?: number
  longitude?: number
}

/**
 * Get location from browser geolocation API
 */
async function getBrowserGeolocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator || !navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get city name from coordinates
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
          )

          if (!response.ok) {
            throw new Error('Failed to get location name')
          }

          const data = await response.json()

          // Extract location information
          const city = data.address.city
            || data.address.town
            || data.address.village
            || data.address.county
            || 'Unknown'
          const region = data.address.state || data.address.region || ''
          const country = data.address.country || ''

          resolve({
            city,
            region,
            country,
            latitude,
            longitude,
          })
        }
        catch (error) {
          console.warn('Error in reverse geocoding:', error)
          resolve(null)
        }
      },
      (error) => {
        console.warn('Geolocation error:', error)
        resolve(null)
      },
      { timeout: 5000, enableHighAccuracy: false },
    )
  })
}

/**
 * Convert city name to QWeather location code via proxy
 * @param city City name
 */
async function getCityCode(city: string): Promise<string> {
  try {
    const baseUrl = getApiBaseUrl()

    // 如果配置为使用模拟数据
    if (useMockData) {
      console.log('使用默认城市代码:', city)
      // 默认使用南京
      return '101190101'
    }

    // Use our API proxy to get city code
    const response = await fetch(`${baseUrl}/api/geo?location=${encodeURIComponent(city)}`)

    if (!response.ok) {
      throw new Error(`Geo API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code === '200' && data.location && data.location.length > 0) {
      return data.location[0].id
    }

    throw new Error('No location found')
  }
  catch (error) {
    console.warn('Error getting city code:', error)
    // Default to Nanjing
    return '101190101' // Nanjing city code
  }
}

/**
 * Fetch location data with caching and geolocation
 * Uses real data in both development and production
 */
export async function fetchLocationData(): Promise<LocationData> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<LocationData>(CACHE_KEYS.LOCATION)

    if (isCacheValid(cachedData, CACHE_EXPIRY.LOCATION)) {
      const data = safeGetCachedData(cachedData)
      if (data) return data
    }

    // Try browser geolocation first
    const geoLocation = await getBrowserGeolocation()
    if (geoLocation) {
      // Save the geolocation data to cache
      saveToCache(CACHE_KEYS.LOCATION, geoLocation)
      return geoLocation
    }

    // If geolocation fails, try IP-based location
    let locationData: LocationData

    const baseUrl = getApiBaseUrl()

    // 如果配置为使用模拟数据
    if (useMockData) {
      console.log('使用默认位置数据')
      locationData = DEFAULT_LOCATION
    }
    else {
      try {
        // Call the actual API in production
        const response = await fetch(`${baseUrl}/api/location`)
        locationData = await response.json()
      }
      catch (fetchError) {
        console.warn('Error fetching location data, using fallback:', fetchError)

        // Use fallback data if API call fails (South Nanjing)
        locationData = DEFAULT_LOCATION
      }
    }

    // Save the new data to cache (only if it's valid)
    if (locationData && locationData.city) {
      saveToCache(CACHE_KEYS.LOCATION, locationData)
    }

    return locationData
  }
  catch (error) {
    console.warn('Error fetching location data:', error)

    // Try to return cached data even if expired
    const cachedData = getFromCache<LocationData>(CACHE_KEYS.LOCATION)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // If no cached data available, return fallback data
    return DEFAULT_LOCATION
  }
}

/**
 * Daily quote interface
 */
interface DailyQuote {
  content: string
  translation: string
  author: string
  picture?: string
  // 添加可选字段，用于调试
  source?: string
  dateline?: string
  fallback?: boolean
  timestamp?: string
}

/**
 * 从API代理获取每日一句
 * 通过使用服务器端API调用避免CORS问题
 */
async function fetchDailyQuoteFromApi(): Promise<DailyQuote> {
  try {
    const baseUrl = getApiBaseUrl()

    // 如果配置为使用模拟数据
    if (useMockData) {
      console.log('使用模拟每日一句数据')

      // 获取今天的日期以选择一句名言（确保全天显示相同的名言）
      const today = new Date()
      const startOfYear = new Date(today.getFullYear(), 0, 0)
      const diff = today.getTime() - startOfYear.getTime()
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))

      // 根据一年中的日期选择一句名言
      const staticQuotes = [
        {
          content: 'The best way to predict the future is to invent it.',
          translation: '预测未来的最好方法就是创造未来。',
          author: 'Alan Kay',
          picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
        },
        {
          content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
          translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
          author: 'Winston Churchill',
          picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
        },
        {
          content: 'Life is what happens when you\'re busy making other plans.',
          translation: '生活就是当你忙于制定其他计划时发生的事情。',
          author: 'John Lennon',
          picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-3.jpg',
        },
        {
          content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
          translation: '生活中最大的荣耀不在于永不跌倒，而在于每次跌倒后都能爬起来。',
          author: 'Nelson Mandela',
          picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-4.jpg',
        },
      ]

      // 确保我们至少有一句名言
      if (staticQuotes.length === 0) {
        staticQuotes.push({
          content: 'The best way to predict the future is to invent it.',
          translation: '预测未来的最好方法就是创造未来。',
          author: 'Alan Kay',
          picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
        })
      }

      const index = dayOfYear % staticQuotes.length

      // 创建一个后备名言，以防出现问题
      const fallbackQuote = {
        content: 'The best way to predict the future is to invent it.',
        translation: '预测未来的最好方法就是创造未来。',
        author: 'Alan Kay',
        picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
      }

      // 获取带有后备的选定名言
      const selectedQuote = staticQuotes[index] || fallbackQuote

      // 返回名言数据
      return {
        content: selectedQuote.content || fallbackQuote.content,
        translation: selectedQuote.translation || fallbackQuote.translation,
        author: selectedQuote.author || fallbackQuote.author,
        picture: selectedQuote.picture || fallbackQuote.picture,
        source: 'Development Mock',
        dateline: new Date().toISOString().split('T')[0],
      }
    }

    // 根据环境选择不同的API调用方式
    try {
      let data: any

      if (isDevelopment) {
        // 在开发环境中使用代理
        console.log('开发环境: 使用开发环境代理获取每日一句')
        data = await devProxy('/api/daily-quote')
      }
      else {
        // 在生产环境中使用服务器端API代理
        const apiUrl = `${baseUrl}/api/daily-quote`
        console.log('生产环境: 正在从服务器端API代理获取每日一句:', apiUrl)

        // 添加随机参数，避免缓存
        const urlWithCache = `${apiUrl}?_t=${Date.now()}`

        const response = await fetch(urlWithCache, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
          // 使用same-origin凭据，确保请求包含cookies
          credentials: 'same-origin',
        })

        if (!response.ok) {
          throw new Error(`每日一句API响应状态: ${response.status}`)
        }

        data = await response.json()
      }

      console.log('收到每日一句数据:', data)

      // 检查是否是真实API数据
      const isRealApiData = !data.fallback
      console.log('是否是真实API数据:', isRealApiData)

      // 返回处理后的数据
      return {
        content: data.content,
        translation: data.translation,
        author: data.author || '金山词霸',
        picture: data.picture,
        source: data.source,
        dateline: data.dateline,
      }
    }
    catch (fetchError) {
      console.warn('获取每日一句数据时出错:', fetchError)
      // 如果API调用失败，返回模拟数据
      return {
        content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
        translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
        author: 'Winston Churchill',
        picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
        source: 'API Fallback',
        dateline: new Date().toISOString().split('T')[0],
      }
    }
  }
  catch (error) {
    console.warn('设置每日一句获取时出错:', error)
    // 返回模拟数据
    return {
      content: 'The best way to predict the future is to invent it.',
      translation: '预测未来的最好方法就是创造未来。',
      author: 'Alan Kay',
      picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
      source: 'Error Fallback',
      dateline: new Date().toISOString().split('T')[0],
    }
  }
}

/**
 * 从金山词霸API获取每日一句，带缓存
 * 在开发和生产环境中都使用实时数据
 */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    // 首先检查缓存数据
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)

    // 如果缓存有效且不太旧，则使用它
    if (isCacheValid(cachedData, CACHE_EXPIRY.DAILY_QUOTE)) {
      const data = safeGetCachedData(cachedData)
      if (data) {
        console.log('使用缓存的每日一句数据:', data)
        return data
      }
    }

    // 如果没有有效缓存，则获取新数据
    let quoteData: DailyQuote
    let isRealData = false

    try {
      // 尝试从API代理获取数据
      quoteData = await fetchDailyQuoteFromApi()

      // 检查这是真实数据还是来自API的后备数据
      isRealData = !(quoteData as any).fallback

      if (isRealData) {
        console.log('成功从API获取真实每日一句:', quoteData)
      }
      else {
        console.log('API返回后备数据:', quoteData)
      }
    }
    catch (fetchError) {
      console.warn('获取每日一句时出错，尝试使用后备方案:', fetchError)

      // 使用静态数据作为后备方案
      try {
        console.log('使用静态数据作为后备方案')

        // 获取今天的日期以选择一句名言（确保全天显示相同的名言）
        const today = new Date()
        const startOfYear = new Date(today.getFullYear(), 0, 0)
        const diff = today.getTime() - startOfYear.getTime()
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))

        // 使用一组高质量的静态名言
        const staticQuotes = [
          {
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          },
          {
            content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
            translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
            author: 'Winston Churchill',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
          },
          {
            content: 'Life is what happens when you\'re busy making other plans.',
            translation: '生活就是当你忙于制定其他计划时发生的事情。',
            author: 'John Lennon',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-3.jpg',
          },
          {
            content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
            translation: '生活中最大的荣耀不在于永不跌倒，而在于每次跌倒后都能爬起来。',
            author: 'Nelson Mandela',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-4.jpg',
          },
        ]

        // 确保我们至少有一句名言
        if (staticQuotes.length === 0) {
          staticQuotes.push({
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          })
        }

        const index = dayOfYear % staticQuotes.length

        // 使用今天的名言，带有安全检查
        const selectedQuote = staticQuotes[index] || staticQuotes[0]

        // 创建一个带有默认值的新对象以满足TypeScript
        quoteData = {
          content: selectedQuote?.content || 'The best way to predict the future is to invent it.',
          translation: selectedQuote?.translation || '预测未来的最好方法就是创造未来。',
          author: selectedQuote?.author || 'Alan Kay',
          picture: selectedQuote?.picture,
          source: 'Static Fallback',
          dateline: new Date().toISOString().split('T')[0],
        }
        console.log('使用今天的静态名言:', quoteData)
      }
      catch (fallbackError) {
        console.warn('后备方案也失败了，使用随机名言:', fallbackError)

        // 如果所有API调用都失败，使用随机后备名言
        const fallbackQuotes = [
          {
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          },
          {
            content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
            translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
            author: 'Winston Churchill',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
          },
          {
            content: 'Life is what happens when you\'re busy making other plans.',
            translation: '生活就是当你忙于制定其他计划时发生的事情。',
            author: 'John Lennon',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-3.jpg',
          },
          {
            content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
            translation: '生活中最大的荣耀不在于永不跌倒，而在于每次跌倒后都能爬起来。',
            author: 'Nelson Mandela',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-4.jpg',
          },
        ]

        // 确保我们至少有一句名言
        if (fallbackQuotes.length === 0) {
          fallbackQuotes.push({
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          })
        }

        // 选择一个随机名言，带有安全检查
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
        const selectedFallbackQuote = fallbackQuotes[randomIndex] || fallbackQuotes[0]

        // 创建一个带有默认值的新对象以满足TypeScript
        quoteData = {
          content: selectedFallbackQuote?.content || 'The best way to predict the future is to invent it.',
          translation: selectedFallbackQuote?.translation || '预测未来的最好方法就是创造未来。',
          author: selectedFallbackQuote?.author || 'Alan Kay',
          picture: selectedFallbackQuote?.picture,
          source: 'Random Fallback',
          dateline: new Date().toISOString().split('T')[0],
        }
      }
    }

    // 将新数据保存到缓存中（仅当它是有效的真实数据时）
    if (quoteData && quoteData.content && quoteData.translation && isRealData) {
      console.log('将真实每日一句数据保存到缓存中')
      saveToCache(CACHE_KEYS.DAILY_QUOTE, quoteData)
    }
    else {
      console.log('不缓存数据，因为它不是真实的API数据')
    }

    return quoteData
  }
  catch (error) {
    console.warn('获取每日一句时出错:', error)

    // 尝试返回缓存数据，即使已过期
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // 如果没有可用的缓存数据，返回后备数据
    return {
      content: 'The best way to predict the future is to invent it.',
      translation: '预测未来的最好方法就是创造未来。',
      author: 'Alan Kay',
      source: 'Error Fallback',
      dateline: new Date().toISOString().split('T')[0],
    }
  }
}

/**
 * Clear specific or all API caches
 * @param cacheKey Optional specific cache to clear, if not provided all caches will be cleared
 */
export function clearApiCache(cacheKey?: string): void {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    if (cacheKey) {
      localStorage.removeItem(cacheKey)
    }
    else {
      // Clear all API caches
      Object.values(CACHE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    }
  }
  catch (error) {
    console.warn('Failed to clear API cache:', error)
  }
}
