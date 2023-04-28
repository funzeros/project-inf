import { Dexie } from "dexie"

const VERSION = 1

export const db = new Dexie('OVER_WORD')

db.version(VERSION).stores({
  system_config: `
  key,
  value
  `
})