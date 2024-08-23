export default function ChatBox({ messages }) {
    return (
      <section>
        <h2>Debate Chat</h2>
        <div className="chat-box">
          {messages.map((message, index) => (
            <p key={index}>{message.content}</p>
          ))}
        </div>
      </section>
    );
  }