import r from "./lib/request"


  ; (async () => {
    await r.request('/config/init', { key: 'theme', value: 'light' })

    r.request('/config/get', { key: 'theme' })
      .then(async (d) => {
        console.log(d)
      })
      .catch((e) => {
        console.error(e)
      })
  })()