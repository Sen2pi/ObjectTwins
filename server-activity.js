import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import { createActivityInstance } from './src/core/factory/ActivityFactory.js'
import AnalyticsStore from './src/store/AnalyticsStore.js'

const store = AnalyticsStore.getInstance()

const send = (res, status, body, headers) => {
  res.writeHead(status, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' }, headers || {}))
  res.end(body)
}

const sendJSON = (res, status, data) => send(res, status, JSON.stringify(data), { 'Content-Type': 'application/json; charset=utf-8' })

const readJSONFileOr = (fileName, fallback) => {
  try {
    const p = path.join(__dirname, fileName)
    const c = fs.readFileSync(p, 'utf8')
    return JSON.parse(c)
  } catch (_) {
    return fallback
  }
}

const routes = {
  '/config': (req, res) => {
    try {
      const p = path.join(__dirname, 'config.html')
      const c = fs.readFileSync(p, 'utf8')
      send(res, 200, c, { 'Content-Type': 'text/html; charset=utf-8' })
    } catch (_) {
      send(res, 200, '<html><body><h1>Configuração</h1><input name="activityKind" value="Modelagem3D"/><input name="s1" value="Setting 1"/><input name="s2" value="Setting 2"/><input name="s3" value="Setting 3"/></body></html>', { 'Content-Type': 'text/html; charset=utf-8' })
    }
  },
  '/json_params': (req, res) => {
    const data = readJSONFileOr('json_params_url.json', [
      { name: 'activityKind' },
      { name: 's1' },
      { name: 's2' },
      { name: 's3' }
    ])
    sendJSON(res, 200, data)
  },
  '/analytics_list': (req, res) => {
    const data = readJSONFileOr('analytics_list_url.json', [
      { name: 'Acedeu à atividade', type: 'boolean' },
      { name: 'Download documento 1', type: 'boolean' },
      { name: 'Evolução pela atividade (%)', type: 'string' },
      { name: 'Student activity profile', type: 'url' },
      { name: 'Actitivy Heat Map', type: 'url' }
    ])
    sendJSON(res, 200, data)
  },
  '/deploy': (req, res) => {
    const q = url.parse(req.url, true).query
    const activityID = String(q.activityID || q.id || '')
    const type = String(q.activityKind || 'Modelagem3D')
    const config = { s1: q.s1 || 'Setting 1', s2: q.s2 || 'Setting 2', s3: q.s3 || 'Setting 3' }
    if (!activityID) return send(res, 400, 'Missing activityID')
    const instance = createActivityInstance(activityID, type, config)
    store.registerActivityInstance(instance)
    store.seedStudents(activityID, [1001, 1002])
    const base = `http://localhost:8080/user?activityID=${encodeURIComponent(activityID)}`
    send(res, 200, base)
  },
  '/analytics': async (req, res) => {
    console.log('analytics request', req.method, req.url)
    if (req.method === 'GET') {
      const q = url.parse(req.url, true).query
      const activityID = String(q.activityID || '')
      if (!activityID) return sendJSON(res, 400, { error: 'Missing activityID' })
      const analytics = store.getAnalytics(activityID)
      return sendJSON(res, 200, analytics)
    }
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const ct = String(req.headers['content-type'] || '').toLowerCase()
      let data = {}
      if (ct.includes('application/json')) {
        try { data = JSON.parse(body || '{}') } catch { data = {} }
      } else if (ct.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body || '')
        data = Object.fromEntries(params.entries())
      } else {
        try { data = JSON.parse(body || '{}') } catch {
          const params = new URLSearchParams(body || '')
          data = Object.fromEntries(params.entries())
        }
      }
      const q = url.parse(req.url, true).query
      const activityID = String(data.activityID || q.activityID || '')
      if (!activityID) return sendJSON(res, 400, { error: 'Missing activityID' })
      const analytics = store.getAnalytics(activityID)
      sendJSON(res, 200, analytics)
    })
  },
  '/user': (req, res) => {
    const q = url.parse(req.url, true).query
    const activityID = String(q.activityID || '')
    send(res, 200, `ObjectTwins Activity: ${activityID}`)
  }
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url)
  if (req.method === 'OPTIONS') return send(res, 204, '')
  const handler = routes[parsed.pathname]
  if (handler) return handler(req, res)
  send(res, 404, 'Not Found')
})

const port = process.env.PORT || 8080
server.listen(port)

