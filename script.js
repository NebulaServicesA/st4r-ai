// Initialize LlamaAI with the provided API token
import LlamaAI from 'llamaai';

const apiToken = 'LA-4d5190aefe174d2f8bcdd3e6c01f1e6f42f2c06eccfa4a94a4f1f2f753341e5b';
const llamaAPI = new LlamaAI(apiToken);

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const inputBox = document.getElementById("userInput");
  const userMessage = inputBox.value.trim();
  if (!userMessage) return;

  displayMessage(userMessage, 'user-message');
  inputBox.value = '';
  
  const apiRequestJson = {
    messages: [{ role: "user", content: userMessage }],
    functions: [
      {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string", description: "The city and state, e.g. San Francisco, CA" },
            days: { type: "number", description: "for how many days ahead you wants the forecast" },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] }
          }
        },
        required: ["location", "days"]
      }
    ],
    stream: false,
    function_call: "get_current_weather"
  };

  llamaAPI.run(apiRequestJson)
    .then(response => {
      const botMessage = response.messages ? response.messages[0].content : 'No response';
      displayMessage(botMessage, 'response-message');
    })
    .catch(error => {
      displayMessage("Error: " + error.message, 'response-message');
    });
}

function displayMessage(text, className) {
  const chatBox = document.getElementById("chatBox");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", className);
  messageDiv.innerText = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
