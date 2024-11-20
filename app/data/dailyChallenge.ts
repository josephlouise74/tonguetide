import { Challenge } from "../types/challenge";

// Helper function to get tomorrow's date at midnight
const getTomorrowDate = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

// Vocabulary challenges pool
const vocabularyChallenges = [
    {
        title: 'Word Master',
        description: 'Learn and memorize 5 new vocabulary words',
        requirements: { total: 5, completed: 0 }
    },
    {
        title: 'Synonym Challenge',
        description: 'Match 10 words with their synonyms',
        requirements: { total: 10, completed: 0 }
    },
    {
        title: 'Vocabulary Quiz',
        description: 'Complete a vocabulary quiz with 15 questions',
        requirements: { total: 15, completed: 0 }
    }
];

// Grammar challenges pool
const grammarChallenges = [
    {
        title: 'Tense Perfect',
        description: 'Practice verb tenses with 10 exercises',
        requirements: { total: 10, completed: 0 }
    },
    {
        title: 'Article Master',
        description: 'Complete exercises about articles (a, an, the)',
        requirements: { total: 8, completed: 0 }
    },
    {
        title: 'Preposition Pro',
        description: 'Master prepositions with practical exercises',
        requirements: { total: 12, completed: 0 }
    }
];

// Speaking challenges pool
const speakingChallenges = [
    {
        title: 'Pronunciation Practice',
        description: 'Record yourself pronouncing difficult words',
        requirements: { total: 5, completed: 0 }
    },
    {
        title: 'Conversation Simulation',
        description: 'Complete a simulated conversation exercise',
        requirements: { total: 1, completed: 0 }
    },
    {
        title: 'Tongue Twisters',
        description: 'Practice pronunciation with tongue twisters',
        requirements: { total: 3, completed: 0 }
    }
];

// Function to randomly select challenges for the day
const getRandomChallenge = (pool: any[], difficulty: Challenge['difficulty']): Partial<Challenge> => {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const baseChallenge = pool[randomIndex];

    const pointsMap = {
        easy: 10,
        medium: 15,
        hard: 20
    };

    const xpRewardMap = {
        easy: 50,
        medium: 75,
        hard: 100
    };

    const streakBonusMap = {
        easy: 5,
        medium: 10,
        hard: 15
    };

    return {
        ...baseChallenge,
        difficulty,
        points: pointsMap[difficulty],
        xpReward: xpRewardMap[difficulty],
        streakBonus: streakBonusMap[difficulty]
    };
};

export const generateDailyChallenges = (): Challenge[] => {
    const deadline = getTomorrowDate();

    // Generate one challenge of each difficulty
    const dailyChallenges: Challenge[] = [
        {
            id: '1',
            ...getRandomChallenge(vocabularyChallenges, 'easy'),
            type: 'vocabulary',
            completed: false,
            deadline
        },
        {
            id: '2',
            ...getRandomChallenge(grammarChallenges, 'medium'),
            type: 'grammar',
            completed: false,
            deadline
        },
        {
            id: '3',
            ...getRandomChallenge(speakingChallenges, 'hard'),
            type: 'speaking',
            completed: false,
            deadline
        }
    ] as Challenge[];

    return dailyChallenges;
};

// Helper function to check if challenges need to be reset
export const shouldResetChallenges = (lastUpdateTime: Date): boolean => {
    const now = new Date();
    const lastMidnight = new Date(now);
    lastMidnight.setHours(0, 0, 0, 0);

    return lastUpdateTime < lastMidnight;
};

// Function to calculate streak based on completion
export const calculateStreak = (
    currentStreak: number,
    challengesCompleted: boolean,
    lastCompletionDate: Date
): number => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // If all challenges were completed today, maintain or increment streak
    if (challengesCompleted) {
        return currentStreak + 1;
    }

    // If last completion was yesterday, maintain streak
    if (lastCompletionDate.toDateString() === yesterday.toDateString()) {
        return currentStreak;
    }

    // Otherwise, reset streak
    return 0;
};

// Function to calculate bonus points based on streak
export const calculateStreakBonus = (streak: number): number => {
    return Math.floor(streak / 5) * 10; // Extra 10 points for every 5 days of streak
};

// Function to check if all daily challenges are completed
export const areAllChallengesCompleted = (challenges: Challenge[]): boolean => {
    return challenges.every(challenge => challenge.completed);
};

// Function to get total possible points for the day
export const getTotalPossiblePoints = (challenges: Challenge[]): number => {
    return challenges.reduce((total, challenge) => {
        return total + challenge.points + challenge.streakBonus;
    }, 0);
};
