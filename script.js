const API_KEY = "<API Key>";

const inputForm = document.getElementById("input-form");
const inputField = document.getElementById("input");
const outputDiv = document.getElementById("output");
const saveSessionBtn = document.getElementById("save-session");
const clearConversationBtn = document.getElementById("clear-conversation");
const systemMessageInput = document.getElementById("system-message");
const sendSystemMessageBtn = document.getElementById("send-system-message");

let messages = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

inputForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userInput = inputField.value.trim();
  if (userInput === "") return;

  addMessageToOutput("user", userInput);
  inputField.value = "";

  const assistantResponse = await getAssistantResponse(userInput);
  addMessageToOutput("assistant", assistantResponse);
});

saveSessionBtn.addEventListener("click", () => {
  const outputContent = outputDiv.innerText;
  const blob = new Blob([outputContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "ChatGPT_Session.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

clearConversationBtn.addEventListener("click", () => {
  messages = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ];
  outputDiv.innerHTML = "";
});

sendSystemMessageBtn.addEventListener("click", () => {
  const systemMessageContent = systemMessageInput.value.trim();
  if (systemMessageContent) {
    messages = [
      {
        role: "system",
        content: systemMessageContent,
      },
    ];
    alert("System message sent!");
  } else {
    alert("Please enter a system message.");
  }
  });
  
  function addMessageToOutput(role, content) {
    const messageWrapper = document.createElement("div");
    messageWrapper.className = `${role}-message`;
  
    const roleSpan = document.createElement("span");
    roleSpan.className = `${role}-label`;
    roleSpan.innerHTML = `<strong>${role === "user" ? "You: " : "Assistant: "}</strong>`;
    messageWrapper.appendChild(roleSpan);
  
    const contentSpan = document.createElement("span");
    contentSpan.className = `${role}-content`;
    contentSpan.innerHTML = content.replace(/\n/g, "<br>");
    messageWrapper.appendChild(contentSpan);
  
    outputDiv.appendChild(messageWrapper);
  
    if (role === "user") {
      const lineBreak = document.createElement("div");
      lineBreak.style.lineHeight = "1.5";
      outputDiv.appendChild(lineBreak);
    }
    outputDiv.scrollTop = outputDiv.scrollHeight;
  }
  
  async function getAssistantResponse(userInput) {
    messages.push({ role: "user", content: userInput });
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
    });
  
    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;
  
    messages.push({ role: "assistant", content: assistantResponse });
  
    return assistantResponse;
  }
  
