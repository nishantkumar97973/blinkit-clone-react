import { useState } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 Welcome to Grocery Store. How can I help you?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    const userMessage = {
      text: input,
      sender: "user",
    };

    let botReply = "Sorry, I didn't understand.";

    if (
      input.toLowerCase().includes("delivery")
    ) {
      botReply =
        "🚚 Delivery usually takes 15-30 minutes.";
    } else if (
      input.toLowerCase().includes("payment")
    ) {
      botReply =
        "💳 We accept UPI, Cards and Cash on Delivery.";
    } else if (
      input.toLowerCase().includes("order")
    ) {
      botReply =
        "📦 You can check your orders in My Orders page.";
    } else if (
      input.toLowerCase().includes("contact")
    ) {
      botReply =
        "☎️ Contact us at +91 9334485592";
    }

    setMessages([
      ...messages,
      userMessage,
      {
        text: botReply,
        sender: "bot",
      },
    ]);

    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="chat-header">
        Grocery Assistant 🤖
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Ask something..."
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;