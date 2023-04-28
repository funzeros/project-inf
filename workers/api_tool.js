const ENUM_CODE = {
    SUCCESS: 200,
    NOT_FOUND: 404,
    FAILD: 503
}

export const R = {
    success(data = null, msg = null) {
        return {
            code: ENUM_CODE.SUCCESS,
            data,
            msg
        }
    },
    not_found(data = null, msg = "接口不存在") {
        return {
            code: ENUM_CODE.NOT_FOUND,
            data,
            msg
        }
    },
    faild(data = null, msg = '查询失败') {
        return {
            code: ENUM_CODE.FAILD,
            data,
            msg
        }
    }
}

export const routes = new Map()


export const setupRoutes = (pool, path = '') => {
    for (const key in pool) {
        if (Object.hasOwnProperty.call(pool, key)) {
            const fn = pool[key];
            if (fn instanceof Function) {
                routes.set(`${path}/${key}`, fn)
            } else {
                setupRoutes(fn, `${path}/${key}`)
            }
        }
    }
}

self.addEventListener('message', async ({ data }) => {
    const route = routes.get(data.path)
    self.postMessage({ path: data.path, ...route ? (await route(data.data)) : R.not_found() })
})