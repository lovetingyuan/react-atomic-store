import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useStore } from "./store";
import { FooBar2 } from "./components/FooBar";
import { Suspense, use, useState } from "react";
import Test from "./components/Test";
import { useAddCount } from "./components/FooBar/a";

function AsyncTest(props: { promise: Promise<string> }) {
  const value = use(props.promise);
  return <div>async: {value}</div>;
}

function App() {
  const { count, setFoo, foo } = useStore();
  const addCount = useAddCount();
  const [showFooBar, setShowFooBar] = useState(false);
  const promise = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("promise value" + count);
    }, 2000);
  });

  return (
    <>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AsyncTest promise={promise} />
        </Suspense>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => addCount((c) => c + 1)}>count is {count}</button>
        <button
          onClick={() => {
            setFoo((v) => {
              return {
                ...v,
                foo1: Date.now(),
              };
            });
          }}
        >
          change foo1 {foo.foo1}
        </button>
        <Test />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button
          onClick={() => {
            setShowFooBar((v) => !v);
          }}
        >
          show foobar
        </button>
        {showFooBar && <FooBar2 />}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
