import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Signin() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "black" }}>
      <h1>
        <Link href="/" style={{ color: "white" }}>
          Home
        </Link>
      </h1>
      <SignIn />
    </div>
  );
}
