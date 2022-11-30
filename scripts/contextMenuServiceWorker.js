const getKey = () => {
return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
        if (result['openai-key']){
const decodedkey = atob(result['openai-key']);
resolve(decodedkey);
        }
    });
})
}

const generate = async (prompt) => {
const key = await getKey();
const url = 'https://api.openai.com/v1/completions';


const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
    
},
body:JSON.stringify({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 1250,
    temperature: 0.7,
}),
});

const completion = await completionResponse.json();
return completion.choices.pop();
}

const generateCompletionAction = async (info) => {
    try {
        const { selectionText } = info;
        const basePromptPrefix =
        `
With the body part given,
 Give a suitable timed warm up
 generate a gym based workout plan which has individual detailed 
 exercises for that body part with reps and sets, each exercise on a separate line.
 Suggest a suitable cool-down
 Do not list these

 and then generate a meal plan for 3 healthy protein based meals and 
 3 snacks in between the meals


`;

const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);
console.log(baseCompletion.text); 
} catch (error) {
        console.log(error);
    }
 };

chrome.contextMenus.create({
    id: 'context-run',
    title: 'Generate a fresh gym workout',
    contexts: ['selection'],
}),

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
