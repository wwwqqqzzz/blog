/**
 * API Helper functions for fetching data from external APIs
 * Provides fallback for local development and implements caching
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Base URL for API calls
const getApiBaseUrl = () => {
  // In development, use relative paths
  // In production, use the deployed Vercel functions
  return isDevelopment ? '' : ''
}

// 和风天气API配置
const QWEATHER_API_KEY = '80ce7424f8d34974af05d092792c123a'
const QWEATHER_API_BASE_URL = 'https://devapi.qweather.com/v7'

// 金山词霸API配置
const ICIBA_API_URL = 'https://open.iciba.com/dsapi/'

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
  DAILY_QUOTE: 'cached_daily_quote',
}

const CACHE_EXPIRY = {
  WEATHER: 30 * 60 * 1000, // 30 minutes in milliseconds
  LOCATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  DAILY_QUOTE: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
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
 * Directly fetch weather data from QWeather API
 * @param location Location code, default is 101190101 (Nanjing)
 */
async function fetchQWeatherDirectly(location: string = '101190101'): Promise<WeatherData> {
  try {
    const apiUrl = `${QWEATHER_API_BASE_URL}/weather/now?location=${location}&key=${QWEATHER_API_KEY}`

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    return await response.json()
  }
  catch (error) {
    console.warn('Error directly fetching QWeather data:', error)
    throw error
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
      if (isDevelopment) {
        // In development, call the QWeather API directly
        weatherData = await fetchQWeatherDirectly(cityCode)
      }
      else {
        // In production, call through our API proxy
        const response = await fetch(`${getApiBaseUrl()}/api/weather?location=${cityCode}`)
        weatherData = await response.json()
      }
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
 * Convert city name to QWeather location code
 * @param city City name
 */
async function getCityCode(city: string): Promise<string> {
  try {
    // Use QWeather geo API to get city code
    const apiUrl = `${QWEATHER_API_BASE_URL}/geo/lookup?location=${encodeURIComponent(city)}&key=${QWEATHER_API_KEY}`

    const response = await fetch(apiUrl)
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

    try {
      // Call the actual API in both development and production
      const response = await fetch(`${getApiBaseUrl()}/api/location`)
      locationData = await response.json()
    }
    catch (fetchError) {
      console.warn('Error fetching location data, using fallback:', fetchError)

      // Use fallback data if API call fails (South Nanjing)
      locationData = DEFAULT_LOCATION
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
}

/**
 * Directly fetch daily quote from 金山词霸 API using JSONP approach
 * This avoids CORS issues with direct API calls
 */
async function fetchIcibaQuoteDirectly(): Promise<DailyQuote> {
  return new Promise((resolve, reject) => {
    try {
      // Always use the API proxy in both development and production
      // This is more reliable than direct API calls which may have CORS issues
      fetch(`${getApiBaseUrl()}/api/daily-quote`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Daily quote API responded with status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          resolve({
            content: data.content,
            translation: data.translation,
            author: data.author || 'Daily English',
            picture: data.picture,
          })
        })
        .catch((error) => {
          console.warn('Error fetching daily quote data:', error)
          reject(error)
        })
    }
    catch (error) {
      console.warn('Error setting up daily quote fetch:', error)
      reject(error)
    }
  })
}

/**
 * Fetch daily quote from 金山词霸 API with caching
 * Uses real-time data in both development and production
 */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    // Check for cached data
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)

    // If cache is valid and not too old, use it
    if (isCacheValid(cachedData, CACHE_EXPIRY.DAILY_QUOTE)) {
      const data = safeGetCachedData(cachedData)
      if (data) return data
    }

    // If cache is expired or doesn't exist, force clear it
    clearApiCache(CACHE_KEYS.DAILY_QUOTE)

    // Fetch new data
    let quoteData: DailyQuote

    try {
      // Use the same approach in both development and production
      quoteData = await fetchIcibaQuoteDirectly()
    }
    catch (fetchError) {
      console.warn('Error fetching daily quote, trying fallback:', fetchError)

      // Try a different approach as fallback
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/daily-quote`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        })

        if (!response.ok) {
          throw new Error(`Fallback API responded with status: ${response.status}`)
        }

        const data = await response.json()
        quoteData = {
          content: data.content,
          translation: data.translation || data.note,
          author: data.author || 'Daily English',
          picture: data.picture,
        }
      }
      catch (fallbackError) {
        console.warn('Fallback also failed, using random quote:', fallbackError)

        // If all API calls fail, use a fallback quote
        quoteData = {
          content: 'The best way to predict the future is to invent it.',
          translation: '预测未来的最好方法就是创造未来。',
          author: 'Alan Kay',
          picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
        }
      }
    }

    // Save the new data to cache (only if it's valid)
    if (quoteData && quoteData.content && quoteData.translation) {
      saveToCache(CACHE_KEYS.DAILY_QUOTE, quoteData)
    }

    return quoteData
  }
  catch (error) {
    console.warn('Error fetching daily quote:', error)

    // Try to return cached data even if expired
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // If no cached data available, return fallback data
    return {
      content: 'The best way to predict the future is to invent it.',
      translation: '预测未来的最好方法就是创造未来。',
      author: 'Alan Kay',
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
