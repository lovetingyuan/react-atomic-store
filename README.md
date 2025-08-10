## react-atomic-store

### Install

```bash
npm install react-atomic-store
```

### Usage

```tsx
import { createStore } from 'react-atomic-store'

const useStore = createStore({ foo: 1, bar: true })

function Bar() {
  const { bar, setBar } = useStore()
  return (
    <>
      <p>bar: {bar.toString()}</p>
      <button
        onClick={() => {
          setBar(v => !v)
        }}
      >
        change bar
      </button>
    </>
  )
}

function App() {
  const { foo, setFoo, bar } = useStore()
  return (
    <div>
      foo: {foo}
      <button
        onClick={() => {
          setFoo(foo + 1)
        }}
      >
        add foo
      </button>
      <Foo />
    </div>
  )
}
```
