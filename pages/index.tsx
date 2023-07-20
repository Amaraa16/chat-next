import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { useEffect, useState } from "react";
import { Types } from "ably";
import axios from "axios";

configureAbly({
  key: "mSCvcw.rQwSHg:wDsQ15hdJAq4bqbSVm0ON3O4_l5wKtPl-mCUyYGQqw0",
  clientId: "someid",
});

const Baseurl = "http://localhost:3000/api";

export default function Home() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<(string | Types.Message)[]>([]);

  const [channel] = useChannel("public-chat", (message) => {
    setMessages((prev: (string | Types.Message)[]) => [...prev, { title: message.data.text, id: message.data.date }]);
  });

  console.log({ messages });

  function AddPostAndgetMessages() {
    channel.publish("message", { text, date: Date.now() });

    setText("");

    if (text) {
      axios
        .post(Baseurl + "/messages", {
          title: text,
        })
        .then((res) => {
          getMessages();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const Delete = (id) => {
    axios.delete(Baseurl + `/messages/${id}`).then((res) => {
      getMessages();
    });
  };

  function getMessages() {
    axios
      .get(Baseurl + "/messages")
      .then((res) => {
        setMessages(res.data.documents);
        console.log(res.data.documents);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <main>
      {messages.map((el, i) => (
        <div className="chat chat-start" key={i} style={{ width: "100px", height: "50px", backgroundColor: "black", display: "flex", justifyContent: "space-around", borderRadius: "10px", alignItems: "center" }}>
          <div className="chat-bubble" style={{ color: "white" }}>
            {el.title}
          </div>
          <div style={{ color: "white", border: "1px solid red" }} onClick={() => Delete(el._id)}>
            Dlt
          </div>
        </div>
      ))}

      <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} />

      <button className="btn btn-neutral" onClick={() => AddPostAndgetMessages()}>
        Send
      </button>
    </main>
  );
}
