export default class APIService {
  constructor(url) {
    this.url = url;
    this.token = null;
    this.isAdmin = false;
  }

  async login(username, password) {
    const resp = await this.req('POST', '/token', {
      contentType: 'application/x-www-form-urlencoded',
      body: `username=${username}&password=${password}`,
      noAuth: true,
    });

    this.token = resp.access_token;
    const decoded = parseJwt(this.token);
    console.log(decoded);
    this.isAdmin = !!decoded.admin;
    return resp;
  }

  async info() {
    return await this.req('GET', '/info');
  }

  async fetchPosts(upto, limit) {
    let posts = await this.req('GET', '/posts', {
      query: {
        upto,
        limit,
      }
    });
    for (let post of posts) {
      post.created_at = new Date(Date.parse(post.created_at));
    }
    return posts;
  }

  async upload(file) {
    const formData = new FormData();
    formData.append('media', file);
    const resp = await this.req('POST', '/upload', {
      defaultContentType: true,
      body: formData,
    });
    return resp.path;
  }

  async createPost(path, caption, createdAt) {
    const data = {path, caption};
    if (createdAt) data.created_at = createdAt;
    const resp = await this.req('POST', '/posts', {
      data,
    });
    return resp.post_id;
  }

  async req(method, endpoint, cfg) {
    cfg = cfg || {};
    const headers = {
      'Accept': 'application/json',
    }
    if (!cfg.defaultContentType) {
      headers['Content-Type'] = cfg.contentType || 'application/json';
    }
    if (!cfg.noAuth) {
      if (!this.token) {
        throw 'Attempting to access private endpoint unauthenticated.';
      }
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const qsParams = [];
    for (const param in cfg.query || {}) {
      let val = cfg.query[param];
      if (val === null || typeof(val) === 'undefined') {
        continue;
      }
      if (val instanceof Date) {
        val = val.toISOString().substring(0, 19) + 'Z';
      }
      qsParams.push(`${param}=${val}`);
    }
    const qs = qsParams.length > 0 ? '?' + qsParams.join('&') : '';

    const resp = await fetch(`${this.url}${endpoint}${qs}`, {
      method,
      headers,
      body: cfg.body || cfg.data && JSON.stringify(cfg.data),
    });

    if (resp.status >= 400) {
      const error = await resp.text();
      // TODO proper exception
      throw error || resp.statusText;
    }

    return await resp.json();
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(
    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));

  return JSON.parse(jsonPayload);
};
