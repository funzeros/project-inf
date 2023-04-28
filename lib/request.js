const api = new Worker('./workers/api', { type: 'module' })

/**
 * 
 * @param {Worker} worker 
 */
function Request(worker) {
    if (!(this instanceof Request)) {
        return new Request(...arguments)
    }
    this.timeout = 1000 * 10
    this.requestPool = new Map()
    const response = ({ data }) => {
        const callback = this.requestPool.get(data.path)
        callback && callback(data)
    }
    this.link = function () {
        worker.addEventListener('message', response)
    }
    this.unlink = function () {
        worker.removeEventListener('message', response)
    }
    this.link()
    /**
     * 
     * @param {String} path 
     */
    this.request = (path, data) => {
        return new Promise((resolve, reject) => {
            let timer
            const callback = (data) => {
                clearTimeout(timer)
                this.requestPool.delete(path, callback)
                if (data.code < 400) {
                    resolve(data)
                } else {
                    reject(data)
                }
            }
            timer = setTimeout(() => {
                this.requestPool.delete(path)
                reject(`请求超时，接口：${path}`)
            }, this.timeout)

            this.requestPool.set(path, callback)
            worker.postMessage({ path, data })
        })
    }
}

const r = Request(api)
export default r
