export type Num = number | ''

export interface Task { id: string; month: string; category: string; name: string; priority: string; status: string; due: string; notes: string }
export interface WeddingItem { id: string; name: string; budget: Num; quote: Num; deposit: Num; balance: Num; due: string; status: string; notes: string }
export interface VenueItem { id: string; name: string; unit: Num; qty: Num; amount: Num; status: string; notes: string }
export interface HomeItem { id: string; name: string; budget: Num; actual: Num; due: string; status: string; notes: string }
export interface Vendor { id: string; category: string; name: string; contact: string; quote: Num; deposit: Num; balance: Num; due: string; status: string; notes: string }
export interface TripTask { id: string; name: string; notes: string; done: boolean }

export interface PlannerData {
  target: number
  tasks: Task[]
  wedding: WeddingItem[]
  venue: VenueItem[]
  home: HomeItem[]
  vendors: Vendor[]
  safety: string[]
  checks: string[]
  safeDone: (boolean | null)[]
  checkDone: (boolean | null)[]
  tripTasks: TripTask[]
}

export type ViewKey = 'overview' | 'monthly' | 'wedding' | 'honeymoon' | 'home' | 'vendors'
