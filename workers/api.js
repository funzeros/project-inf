import { db } from "./db"
import { R, setupRoutes } from "./api_tool"

setupRoutes({
    config: {
        async get({ key }) {
            try {
                const data = await db.system_config.get({ key })
                return R.success(data.value)
            } catch (error) {
                return R.faild(0, `Error:${error}`)
            }
        },
        async init({ key, value }) {
            try {
                const data = await db.system_config.get({ key })
                if (data) {
                    return R.success(data.value)
                } else {
                    const data = await db.system_config.add({ key, value })
                    return R.success(data.value)
                }
            } catch (error) {
                return R.faild(0, `Error:${error}`)
            }
        }
    }
})

export default self