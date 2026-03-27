/**
 * Image Background Remover - Cloudflare Workers Backend
 * 
 * 环境变量:
 * - REMOVE_BG_API_KEY: Remove.bg API Key
 */

const API_URL = 'https://api.remove.bg/v1.0/removebg';
const API_KEY = REMOVE_BG_API_KEY;

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ success: false, message: '仅支持 POST 请求' }, 405);
    }

    try {
      const contentType = request.headers.get('Content-Type') || '';
      
      if (!contentType.includes('application/json')) {
        return jsonResponse({ success: false, message: 'Content-Type 必须是 application/json' }, 400);
      }

      const body = await request.json();
      const { image, filename } = body;

      if (!image) {
        return jsonResponse({ success: false, message: '缺少 image 参数' }, 400);
      }

      // 构建 FormData
      const formData = new FormData();
      formData.append('image_file', new Blob([base64ToArrayBuffer(image)], { type: 'image/png' }), filename || 'image.png');
      formData.append('size', 'auto');
      formData.append('format', 'png');

      // 调用 Remove.bg API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Remove.bg API error:', errorText);
        
        let errorMessage = '处理失败';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.errors?.[0]?.title || errorJson.errors?.[0]?.detail || '处理失败';
        } catch (e) {
          errorMessage = `API 错误: ${response.status}`;
        }
        
        return jsonResponse({ success: false, message: errorMessage }, 400);
      }

      // 返回处理后的图片
      const imageBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(imageBuffer);

      return jsonResponse({
        success: true,
        image: base64,
        message: '处理成功'
      });

    } catch (error) {
      console.error('Server error:', error);
      return jsonResponse({ success: false, message: '服务器错误: ' + error.message }, 500);
    }
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
