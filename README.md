# SimpleFlux
A way to organise simple vanilla javascript components inspired by the Flux architecture.

## Getting Started
- If you aim to have a zero dependency project the best way to get started is to copy and paste the code in the `simpleflux.js` file.
- If you prefer to use npm, you can install SimpleFlux by running:
```
npm install simpleflux
```

## SimpleFlux
- SimpleFlux is a nice way to organise a simple vanilla JS project into class components with local and global states.
- It does not use a virtual DOM and is still mutative, using inbuilt DOM manipulation methods.

### Creating Components
```js
import { Component } from 'simpleflux'

export default MyComponent extends Component {
  constructor() {
    super()
  }

  mount() {
    // Assemble DOM elements
    return this;
  }

  render() {
    // Manipulate elements based on state or prop changes 
    return this.element;
  }

  // Other custom methods
}
```
- The `mount()` method is where all of the component's DOM elements can be assembled and event handlers can be attached to these elements.
- `mount()` runs once when the component's element is first added to the DOM.
- `mount()` method must `return` the component instance so that the method can be called and chained by SimpleFlux when adding the elements to the DOM.
- The `render()` method fires on receiving new props from `Store` or on local state change.
- `render()` method must return `this.element`, which is the component DOM element to be rendered and rerendered to the DOM.
- All other custom functionality within the component can be added by defining new methods within the component.

Components can receive props as parameters which are accessible within the component via `this.props`:
```js
export default MyComponent extends Component {
  constructor(props) {
    super(props)
  }
}
```
Components can create local state with `this.state`:
```js
export default MyComponent extends Component {
  constructor() {
    this.state = {
      // local component state
    }
  }
}
```
If you want to inject some static CSS when the component mounts, you can use `this.injectStaticCSS()` and pass it your CSS as a template string:
```js
export default MyComponent extends Component {
  constructor() {
    this.injectStaticCss(`
      div.my-component {
        position: absolute;
      }
    `)
  }
}
```

### Shared Stores
SimpleFlux `Store`s can be created to manage shared component state within your application and trigger component rerenders when state updates:
```js
import { Store } from 'simpleflux'

export const sharedStore = new Store({ /* initial state */ })
```
- In this app, I demonstrate the use of a single `globalStore` that the necessary components subscribe to, but multiple stores can be created and combined for more complex applications.

Components can connect to a shared store with `this.subscribe()` to be rerendered when the store's state changes, receiving the shared state as props:
```js
import { sharedStore } from './index.js'

export default MyComponent extends Component {
  constructor() {
    this.subscribe(sharedStore)    
  }
}
```
Any component can read a shared store's state without being subscribed with the `.getState()` method:
```js
import { sharedStore } from './index.js'

/* Inside Your Component */
const sharedState = sharedStore.getState()
```

### Dispatchers
You can register a `Dispatcher` to be able to update a shared store:
```js
import { Store, Dispatcher } from 'simpleflux'

export const sharedStore = new Store({ /* initial state */ })
export const sharedDispatcher = new Dispatcher().register(sharedStore)
```
Changes to store state can be made through the dispatching of Actions:
```js
import { sharedDispatcher } from './index.js'

/* Inside Your Component */
// Dispatching an Action without a payload
sharedDispatcher.dispatch(actionFunction)

// Dispatching an Action with a payload
sharedDispatcher.dispatch(actionFunction({ /* props to update */ }))
```

### Actions
`Action`s are callback functions that receive state and return new state with the option of receiving a "payload" parameter

You can create a new Action by creating a new instance of `Action` and passing it your action callback function:
```js
import { Action } from 'simpleflux'

const actionFunction = new Action((state) => {
  return {
    ...state,
    /* update state props */
  })

const actionFunctionWithPayload = (data) => new Action((state) => {
  return {
    ...state,
    /* update state props with new data */
  }, data)
```

### Nesting Components

To render a component within another component, you can use the `renderDOM()` function and pass it the child component you want to render and the element you want to append the component to:
```js
import { renderDOM, Component } from 'simpleflux'
import ChildComponent from 'ChildComponent.js'

export default MyComponent extends Component {
  mount() {
    // Rendering a nested component without props
    renderDOM(ChildComponent, this.element)
    
    // Rendering a nested component with props
    renderDOM(new ChildComponent({ /* props */ }), this.element)
    
    return this
  }
}
```
This is also the same way that our main `App` component is mounted to our `root` div element found in our HTML:
```js
renderDOM(App, document.getElementById('root'))
```

## Improvements
[ ] Support For Older Browsers

[ ] Build Component Elements Using HTML String Parsing

[ ] Immutable Virtual DOM Functionality

[ ] Better Component Nesting Using `props.children`

[ ] Automatically Scoped CSS Styles

[ ] Inject CSS Styles Dynamically
