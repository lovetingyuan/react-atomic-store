## react-atomic-store

### Usage

```tsx
import { createStore } from 'react-atomic-store'

const useStore = createStore({ foo: 1, bar: true })

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
    </div>
  )
}
```
