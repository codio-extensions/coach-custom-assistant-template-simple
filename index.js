window.codioIDE.coachBot.register({
  id: 'changeButtonNameHere',
  
  // Name of the custom button that will be displayed in Coach
  text: 'Help me with <task>', 
  
  // steps: list of objects that describe the order of things done by your assistant
  steps: [
  
    // Step 1: Display text when assistant button is clicked in Coach
    // {
    // type: window.codioIDE.coachBot.ACTIONS_TYPES.INPUT,
    // key: 'userMessage',
    // text: 'What can I help you with?'
    // },
    // Step 2: Collect question and context (Opened guidesPage, Opened Files, Current Error Message) and "ask" Claude (Anthropic's LLM)
    {
      type: window.codioIDE.coachBot.ACTIONS_TYPES.CALLBACK,
      callback: async function (data) {
        
        // Function that automatically collects all available context 
        // returns the following object: {guidesPage, assignmentData, files, error}
        const context = await window.codioIDE.coachBot.getContext()
        console.log('bot context', context)

        // Write a custom loading message while query is sent and response is generated
        window.codioIDE.coachBot.write('Please wait. I will provide info shortly...')

        const onDone = () => {
          console.log('bot on done callback')
        }

        // Define your assistant's systemPrompt
        // Refer to Anthropic's guide on system prompts: https://docs.anthropic.com/claude/docs/system-prompts
        const assistantSystemPrompt = 'You are a helpful assistant. Your job is to help with <task>.'

        //Define your assistant's userPrompt - this is where you will provide all the context you collected along with the task you want the LLM to generate text for.
        const userPrompt = 'Here is the programming assignment \n<programming_assignment>\n' + context.guidesPage.content + '\n</programming_assignment>\n\
          Here is the student file \n<student_code>\n' + context.files[0].content + '\n</student_code>\n\
          Task Description'
        
        const messagesArray = [
          {"role": "user", "content": userPrompt + ' Respond with summary'},   
        ]
        
        const llm_response = window.codioIDE.coachBot.ask({
          systemPrompt: assistantSystemPrompt,
          userPrompt: userPrompt + ' Respond with summary'
          // messages: messagesArray,
        }, onDone)

        console.log('bot response', llm_response)
        
      }
    }
  ]
})
