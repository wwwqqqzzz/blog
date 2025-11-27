/**
 * 开发环境API代理
 * 用于在开发环境中模拟Vercel无服务器函数
 */

// 检查是否处于开发环境
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 每日一句接口
 */
interface DailyQuote {
  content: string;
  translation: string;
  author: string;
  picture?: string;
  source?: string;
  dateline?: string;
  fallback?: boolean;
  timestamp?: string;
}

/**
 * 从金山词霸API获取每日一句
 */
async function fetchDailyQuoteFromSource(): Promise<DailyQuote> {
  try {
    // 金山词霸每日一句 API URL
    const apiUrl = 'https://open.iciba.com/dsapi/';
    
    console.log('开发环境代理: 正在从金山词霸获取每日一句:', apiUrl);
    
    // 使用fetch获取数据
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.iciba.com/',
      },
      // 禁用缓存，确保获取最新数据
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    // 获取响应文本
    const responseText = await response.text();
    
    // 尝试解析JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse API response as JSON:', responseText.substring(0, 200));
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
    
    // 验证数据格式
    if (!data || !data.content || !data.note) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from 金山词霸 API');
    }
    
    // 返回处理后的数据
    return {
      content: data.content,
      translation: data.note,
      author: data.author || '金山词霸',
      picture: data.picture || data.fenxiang_img || data.picture2,
      source: '金山词霸',
      timestamp: new Date().toISOString(),
      dateline: data.dateline,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching daily quote:', error);
    
    // 返回后备数据
    return {
      content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
      author: 'Winston Churchill',
      picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
      source: 'API Fallback',
      timestamp: new Date().toISOString(),
      fallback: true,
      error: error.message,
    };
  }
}

/**
 * 开发环境API代理
 * @param {string} endpoint - API端点
 * @returns {Promise<any>} - API响应数据
 */
export async function devProxy(endpoint: string): Promise<any> {
  if (!isDevelopment) {
    throw new Error('开发环境代理只能在开发环境中使用');
  }
  
  console.log('开发环境代理: 处理请求:', endpoint);
  
  // 根据端点路由到相应的处理函数
  switch (endpoint) {
    default:
      throw new Error(`未知的API端点: ${endpoint}`);
  }
}
