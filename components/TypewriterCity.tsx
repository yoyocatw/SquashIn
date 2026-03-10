"use client";
import Typewriter from "typewriter-effect";

export default function TypewriterCity() {
  return (
    <h1 className="text-5xl font-bold ml-1 text-primary">
      <Typewriter
        options={{
          strings: [
            "Paris",
            "Vancouver",
            "New York",
            "London"
          ],
          autoStart: true,
          loop: true,
        }}
      />
    </h1>
  );
}
