/**
 * SPA静态服务器 + API代理
 * 用于部署前端静态资源和代理API请求到后端
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 配置
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, '../../ruoyi-ui/dist');
const BACKEND_URL = process.env.VITE_API_BASE_URL || 'http://localhost:9091';

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
};

// 获取文件MIME类型
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

// 处理静态文件请求
function serveStatic(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 文件不存在，返回index.html (SPA fallback)
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
      return;
    }
    
    const mimeType = getMimeType(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

// 代理API请求到后端
function proxyRequest(req, res, targetUrl) {
  const parsedUrl = url.parse(req.url);
  const targetParsed = url.parse(targetUrl);
  
  const options = {
    hostname: targetParsed.hostname,
    port: targetParsed.port || (targetParsed.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.path,
    method: req.method,
    headers: { ...req.headers },
  };
  
  // 移除主机头，避免代理冲突
  delete options.headers.host;
  
  const protocol = targetParsed.protocol === 'https:' ? https : http;
  
  const proxyReq = protocol.request(options, (proxyRes) => {
    // 处理重定向
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      res.writeHead(proxyRes.statusCode, { 'Location': proxyRes.headers.location });
      res.end();
      return;
    }
    
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (err) => {
    console.error('代理请求错误:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: 502, msg: '后端服务不可用' }));
  });
  
  req.pipe(proxyReq);
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`${new Date().toISOString()} ${req.method} ${pathname}`);
  
  // API代理 - /prod-api 和 /dev-api 前缀
  if (pathname.startsWith('/prod-api') || pathname.startsWith('/dev-api')) {
    // 移除前缀，转发到后端
    const apiPath = pathname.replace(/^\/(prod|dev)-api/, '');
    const targetPath = apiPath + (parsedUrl.search || '');
    const targetUrl = `${BACKEND_URL}${targetPath}`;
    proxyRequest(req, res, targetUrl);
    return;
  }
  
  // 静态资源
  let filePath = path.join(DIST_DIR, pathname);
  
  // 安全检查：防止路径遍历
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  // 如果是目录，尝试找index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  serveStatic(req, res, filePath);
});

// 启动服务器
server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('=========================================');
  console.log('  户外俱乐部SaaS管理平台');
  console.log('=========================================');
  console.log(`  前端地址: http://localhost:${PORT}`);
  console.log(`  后端API:  ${BACKEND_URL}`);
  console.log('');
  console.log(`  静态目录: ${DIST_DIR}`);
  console.log('=========================================');
  console.log('');
});

// 错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用`);
  } else {
    console.error('服务器错误:', err);
  }
  process.exit(1);
});
