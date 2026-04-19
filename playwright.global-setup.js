import fs from 'fs'

export default async function globalSetup() {
  const today = new Date().toISOString().split('T')[0]
  const state = {
    cookies: [],
    origins: [
      {
        origin: 'http://localhost:5173',
        localStorage: [
          { name: 'backupReminderLastShown', value: today }
        ]
      }
    ]
  }
  fs.writeFileSync('playwright-storage-state.json', JSON.stringify(state))
}
