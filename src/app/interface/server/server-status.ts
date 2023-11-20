export interface ServerStatusReport {
    status: string
    online: boolean
    motd: string
    motd_json: MotdJson
    favicon: string
    error: any
    players: Players
    server: Server
    last_updated: string
    duration: string
  }
  
  export interface MotdJson {
    extra: Extra[]
    text: string
  }
  
  export interface Extra {
    color: string
    text: string
  }
  
  export interface Players {
    max: number
    now: number
    sample: Sample[]
  }
  
  export interface Sample {
    name: string
    id: string
  }
  
  export interface Server {
    name: string
    protocol: number
  }
  