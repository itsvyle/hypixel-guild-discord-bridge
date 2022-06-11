const http = require("http")
const url = require("url")

const METRICS_CONFIG = require("../../config/metrics-config.json")
const Client = require("prom-client")

const logger = require("log4js").getLogger("prometheus")

if (METRICS_CONFIG.prometheus) {
    logger.debug("prometheus is enabled")
    logger.debug(`Listening on port ${METRICS_CONFIG.prometheus_port}`)

    http.createServer(async (req, res) => {
        const route = url.parse(req.url).pathname
        if (route === '/metrics') {
            logger.debug("Metrics scrap is called on /metrics")
            res.setHeader('Content-Type', register.contentType)
            res.end(await register.metrics())
        }
    }).listen(METRICS_CONFIG.prometheus_port)
}

const register = new Client.Registry()
register.setDefaultLabels({app: 'hypixel-guild-bridge'})
Client.collectDefaultMetrics({register})

module.exports = register