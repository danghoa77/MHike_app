//db/models/Hike.ts
export interface Hike {
    id?: number
    name: string
    location: string
    date: string
    parkingAvailable: boolean
    length: number
    difficulty: HikeDifficulty
    description: string
    images: string[]
}
export enum HikeDifficulty {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}