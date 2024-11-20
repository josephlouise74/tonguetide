// Challenge difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Challenge categories/types
export type ChallengeType =
    | 'vocabulary'
    | 'grammar'
    | 'speaking'
    | 'listening'
    | 'writing'
    | 'reading';

// Challenge requirements interface
export interface ChallengeRequirements {
    total: number;
    completed: number;
}

// Challenge interface
export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: ChallengeType;
    difficulty: Difficulty;
    requirements: ChallengeRequirements;
    points: number;
    xpReward: number;
    streakBonus: number;
    completed: boolean;
    deadline: Date;
}
    