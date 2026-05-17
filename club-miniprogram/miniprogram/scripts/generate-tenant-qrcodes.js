const fs = require('fs');
const path = require('path');
const https = require('https');

function parseArgs(argv) {
  const args = {
    config: path.resolve(process.cwd(), 'scripts/tenants.json'),
    outDir: path.resolve(process.cwd(), 'scripts/qrcodes'),
    page: 'pages/index/index',
    envVersion: 'release',
    checkPath: true
  };
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];
    if (current === '--config' && next) {
      args.config = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (current === '--out' && next) {
      args.outDir = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (current === '--page' && next) {
      args.page = next;
      i += 1;
      continue;
    }
    if (current === '--env' && next) {
      args.envVersion = next;
      i += 1;
      continue;
    }
    if (current === '--no-check-path') {
      args.checkPath = false;
    }
  }
  return args;
}

function safeName(text) {
  return String(text || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 60);
}

function requestJson(method, url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = body ? Buffer.from(JSON.stringify(body), 'utf8') : null;
    const req = https.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': payload.length
            }
          : {}
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            const json = JSON.parse(raw);
            resolve({ statusCode: res.statusCode, headers: res.headers, data: json });
          } catch (err) {
            reject(new Error(`JSON解析失败: ${raw.slice(0, 300)}`));
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function requestBinary(method, url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = body ? Buffer.from(JSON.stringify(body), 'utf8') : null;
    const req = https.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': payload.length
            }
          : {}
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: Buffer.concat(chunks)
          });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getAccessToken(appid, secret) {
  const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`;
  const result = await requestJson('GET', tokenUrl);
  if (!result.data || !result.data.access_token) {
    throw new Error(`获取access_token失败: ${JSON.stringify(result.data)}`);
  }
  return result.data.access_token;
}

function parseConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`未找到配置文件: ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.tenants;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('配置文件格式错误，需为数组或 { "tenants": [...] }');
  }
  return list.map((item) => ({
    tenantId: String(item.tenantId || '').trim(),
    name: String(item.name || item.tenantId || '').trim(),
    scene: item.scene ? String(item.scene).trim() : ''
  }));
}

async function generateOne(accessToken, options, tenant) {
  const scene = tenant.scene || `tenantId=${tenant.tenantId}`;
  const apiUrl = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${encodeURIComponent(accessToken)}`;
  const body = {
    scene,
    page: options.page,
    check_path: options.checkPath,
    env_version: options.envVersion
  };
  const response = await requestBinary('POST', apiUrl, body);
  const contentType = String(response.headers['content-type'] || '');
  if (contentType.includes('application/json')) {
    const text = response.data.toString('utf8');
    let json = {};
    try {
      json = JSON.parse(text);
    } catch (err) {
      throw new Error(`租户 ${tenant.tenantId} 返回JSON解析失败: ${text}`);
    }
    throw new Error(`租户 ${tenant.tenantId} 生成失败: ${JSON.stringify(json)}`);
  }
  const fileName = `${safeName(tenant.name)}_${safeName(tenant.tenantId)}.png`;
  const filePath = path.join(options.outDir, fileName);
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

async function main() {
  const options = parseArgs(process.argv);
  const appid = process.env.WX_APPID;
  const secret = process.env.WX_APPSECRET;
  if (!appid || !secret) {
    throw new Error('请先设置环境变量 WX_APPID 与 WX_APPSECRET');
  }
  const tenants = parseConfig(options.config);
  const invalid = tenants.filter((item) => !item.tenantId);
  if (invalid.length > 0) {
    throw new Error('存在空 tenantId，请修正配置文件');
  }
  fs.mkdirSync(options.outDir, { recursive: true });
  const accessToken = await getAccessToken(appid, secret);
  console.log(`共 ${tenants.length} 个租户，开始生成小程序码...`);
  for (const tenant of tenants) {
    const filePath = await generateOne(accessToken, options, tenant);
    console.log(`已生成: ${filePath}`);
  }
  console.log('全部完成');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

