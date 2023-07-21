import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { useEffect, useState } from "react";
import { Types } from "ably";
import axios from "axios";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

configureAbly({
  key: "mSCvcw.rQwSHg:wDsQ15hdJAq4bqbSVm0ON3O4_l5wKtPl-mCUyYGQqw0",
  clientId: "someid",
});

const Baseurl = "http://localhost:3000/api";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [text, setText] = useState("");
  const [texted, setTexted] = useState("");
  const [messages, setMessages] = useState<(string | Types.Message)[]>([]);
  const [channalCode, setChannalCode] = useState(false);

  console.log("messages" + messages);
  console.log("profile" + user?.profileImageUrl);

  const [channel] = useChannel("12", (message) => {
    setMessages((prev: (string | Types.Message)[]) => [...prev, { title: message.data.text, id: message.data.date }]);
  });

  function AddPostAndgetMessages() {
    channel.publish("message", { text, date: Date.now(), pfp: user?.profileImageUrl });

    setText("");

    if (text) {
      axios
        .post(Baseurl + "/messages", {
          title: text,
          pfp: user?.profileImageUrl,
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
      <SignedIn>
        <div>
          <input value={texted} onChange={(e) => setTexted(e.target.value)}></input>
          <button onClick={() => setChannalCode(true)}>enter</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <h1> hi {user?.fullName}</h1>
          <UserButton />
        </div>

        {channalCode && (
          <div>
            {messages.map((el, i) => (
              <div className="chat chat-start" key={i} style={{ width: "100px", height: "50px", display: "flex", justifyContent: "space-around", borderRadius: "10px", alignItems: "center" }}>
                <img src={el?.pfp} style={{ width: "35px", height: "30px", borderRadius: "50%" }}></img>
                <div className="chat-bubble" style={{ color: "black" }}>
                  {el?.title}
                </div>
                {/* <div style={{ color: "black", border: "1px solid red" }} onClick={() => Delete(el._id)}>
              Dlt
            </div> */}
              </div>
            ))}

            <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} />

            <button className="btn btn-neutral" onClick={() => AddPostAndgetMessages()}>
              Send
            </button>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/sign-up">Signup</Link>
          <Link href="/sign-in">Signin</Link>
        </div>
      </SignedOut>
    </main>
  );
}
