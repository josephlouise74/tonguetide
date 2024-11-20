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
    { id: '25', word: 'Well done', definition: 'Expression of praise for achievement' },
    { id: '26', word: 'Nevertheless', definition: 'In spite of what was just mentioned' },
    { id: '27', word: 'Furthermore', definition: 'In addition to what has been said' },
    { id: '28', word: 'Consequently', definition: 'As a result of what was mentioned' },
    { id: '29', word: 'In essence', definition: 'Fundamentally or basically speaking' },
    { id: '30', word: 'Subsequently', definition: 'Following after something in time' },
    { id: '31', word: 'Presumably', definition: 'Used to convey that something is probable' },
    { id: '32', word: 'Albeit', definition: 'Although or even though' },
    { id: '33', word: 'Thereof', definition: 'Of the thing just mentioned' },
    { id: '34', word: 'Henceforth', definition: 'From this time forward' },
    { id: '35', word: 'Invariably', definition: 'In every case or on every occasion' },
    { id: '36', word: 'Quintessential', definition: 'Representing the most perfect example of a quality' },
    { id: '37', word: 'Paradigm', definition: 'A typical example or pattern of something' },
    { id: '38', word: 'Ephemeral', definition: 'Lasting for a very short time' },
    { id: '39', word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere' },
    { id: '40', word: 'Surreptitious', definition: 'Kept secret, especially because improper' },
    { id: '41', word: 'Perfunctory', definition: 'Carried out with minimal effort or reflection' },
    { id: '42', word: 'Fastidious', definition: 'Very attentive to accuracy and detail' },
    { id: '43', word: 'Circumlocution', definition: 'Using many words where fewer would do' },
    { id: '44', word: 'Perspicacious', definition: 'Having a ready insight into things' },
    { id: '45', word: 'Inexorable', definition: 'Impossible to stop or prevent' },
    { id: '46', word: 'Methodology', definition: 'A system of methods used in a particular field' },
    { id: '47', word: 'Empirical', definition: 'Based on observation or experience rather than theory' },
    { id: '48', word: 'Cognizant', definition: 'Having knowledge or awareness' },
    { id: '49', word: 'Paradigmatic', definition: 'Serving as a typical example' },
    { id: '50', word: 'Ameliorate', definition: 'Make something bad or unsatisfactory better' }
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
