export const vocabulary = [
    { id: '1', word: 'Hello', definition: 'A greeting' },
    { id: '2', word: 'Goodbye', definition: 'A farewell' },
    { id: '3', word: 'Thank you', definition: 'Expression of gratitude' },
    { id: '4', word: 'Please', definition: 'Polite request' },
    { id: '5', word: 'Excuse me', definition: 'Polite phrase used to get attention or apologize' },
    { id: '6', word: 'Good morning', definition: 'Morning greeting' },
    { id: '7', word: 'Good evening', definition: 'Evening greeting' },
    { id: '8', word: 'Nice to meet you', definition: 'Polite phrase when meeting someone new' },
    { id: '9', word: 'How are you?', definition: 'Common greeting asking about wellbeing' },
    { id: '10', word: 'You\'re welcome', definition: 'Polite response to thank you' },
    { id: '11', word: 'Sorry', definition: 'Expression of apology or regret' },
    { id: '12', word: 'Congratulations', definition: 'Expression of praise for achievement' },
    { id: '13', word: 'Take care', definition: 'Friendly farewell expressing concern' },
    { id: '14', word: 'See you later', definition: 'Casual farewell indicating future meeting' },
    { id: '15', word: 'Have a nice day', definition: 'Friendly farewell wishing well' },
    { id: '16', word: 'Good night', definition: 'Evening farewell before sleeping' },
    { id: '17', word: 'Welcome', definition: 'Greeting to receive someone' },
    { id: '18', word: 'Best wishes', definition: 'Expression of hope for someone\'s success or happiness' },
    { id: '19', word: 'Get well soon', definition: 'Phrase expressing hope for recovery' },
    { id: '20', word: 'Happy birthday', definition: 'Celebration greeting for someone\'s birthday' },
    { id: '21', word: 'Good luck', definition: 'Wishing someone success' },
    { id: '22', word: 'Cheers', definition: 'Casual greeting or toast' },
    { id: '23', word: 'Have fun', definition: 'Wishing someone enjoyment' },
    { id: '24', word: 'Safe travels', definition: 'Wishing someone a safe journey' },
    { id: '25', word: 'Well done', definition: 'Expression of praise for achievement' }
];

/* export const vocabulary = [
    { id: '1', word: 'Hello', definition: 'A greeting', audioUrl: '/frontend/assets/hello.mp3' },
    { id: '2', word: 'Goodbye', definition: 'A farewell', audioUrl: '/frontend/assets//goodbye.mp3' },
    // Add audio URLs for other words...
];
 */

type Option = 'Apple' | 'Carrot' | 'Banana' | 'Lazy' | 'Active' | 'Playful' |
    'Leap' | 'Jump' | 'Step' | 'Seeker' | 'Beholder' | 'Viewer' |
    'Soon' | 'Early' | 'Never' | 'Words' | 'Promises' | 'Shouts' |
    'Bag' | 'Basket' | 'Box' | 'Gold' | 'Silver' | 'Bronze' |
    'Eat' | 'Sleep' | 'Do' | 'Bug' | 'Fly' | 'Worm';

type MatchKey = 'Fruit' | 'Vegetable' | 'Color' | 'Animal' | 'Distance' |
    'Start' | 'Subject' | 'Phrase' | 'Comparison' | 'Alternative' |
    'Expression' | 'Effect' | 'Items' | 'Container' | 'Object' |
    'City' | 'Action' | 'Time' | 'Reward';

type MatchValue = 'Apple' | 'Carrot' | 'Brown' | 'Fox' | 'Thousand Miles' |
    'Single Step' | 'Beauty' | 'Eye of the Beholder' | 'Late' |
    'Never' | 'Words' | 'Actions' | 'Eggs' | 'Basket' | 'Cloud' |
    'Silver Lining' | 'Rome' | 'Do as the Romans' | 'Early' | 'Worm';

interface PracticeData {
    id: number;
    fillInSentence: string;
    correctFillInAnswer: string;
    options: Option[];
    correctOption: Option;
    matchPairs: { key: MatchKey; value: MatchValue }[];
}



// Insert your practice data array here
