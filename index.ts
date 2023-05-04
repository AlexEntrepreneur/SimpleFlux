export class Store {
  private state: object;
  private subscribers: Component[] = []
  
  constructor(initialState: object) {
    this.state = initialState
  }

  readonly subscribe = (subscriber: Component): void => {
    this.subscribers.push(subscriber)
  }

  readonly getState = (): object => {
    return structuredClone(this.state)
  }

  readonly setState = (newState: object): void => {
    this.state = newState
    this.subscribers.forEach((subscriber: Component): void => {
      subscriber.props = { ...subscriber.props, ...this.state }
      subscriber.render()
    })
  }
}

export class Dispatcher {
  private store: Store | null = null

  register(store: Store): this  {
    this.store = store
    return this
  }

  dispatch(action: Action): Dispatcher {
    if (this.store) {
      const newState = action.execute(this.store.getState())
      this.store.setState(newState)
    }
    return this
  }
}

type ActionFunction = (oldState: object, payload: object) => object

export class Action {
  actionFunction: ActionFunction
  payload: object
  
  constructor(actionFunction: ActionFunction, payload: object) {
    this.actionFunction = actionFunction
    this.payload = payload
  }

  execute(oldState: object): object {
    return this.actionFunction(oldState, this.payload)
  }
}

class Component {
  state = {}
  protected element = document.createElement("fragment")
  props: object
  
  constructor(props?: object) {
    this.props = { ...props } || {}
  }

  readonly subscribe = (store: Store): void => {
    store.subscribe(this)
  }

  readonly setState = (setter: (oldState: object) => object): void => {
    const newState = setter(this.state)
    this.state = newState
    this.render()
  }

  readonly injectStaticCSS = (css: string): void => {
    let styleElement = document.getElementById("app-styles-elem")
    if (styleElement) {
      const styles = styleElement.textContent || ''
      if (!styles.match(css)) {
        styleElement.textContent = styles + css
      }
    } else {
      styleElement = document.createElement('style')
      styleElement.id = 'app-styles-elem'
      styleElement.textContent = css
      css && document.head.appendChild(styleElement)
    }
  }

  mount(): Component {
    return this
  }

  render():HTMLElement {
    return this.element
  }
}

export function renderDOM(component: Component | typeof Component | (typeof Component | Component)[], rootElement: HTMLElement) {
  function handMountRenderErrors(C: Component) {
    const mountedComponent = C.mount()
    try {
      if (mountedComponent instanceof Component === false) {
        throw new Error(
          `${C.constructor['name']} component mount() method must return instance of component`
        )
      } else if (mountedComponent.render() instanceof HTMLElement === false) {
        throw new Error(
          `${C.constructor['name']} component render() method must return HTML element`
        )
      }

      rootElement.appendChild(mountedComponent.render())
    } catch (e) {
      console.error(e)
    }
  }

  function renderInstance(C: Component): void {
    return handMountRenderErrors(C)
  }
  function createInstanceAndRender(C: typeof Component): void {
    return handMountRenderErrors(new C())
  }

  if (Array.isArray(component)) {
    const reversed = [...component].reverse()
    reversed.forEach((C) => {
      if (C instanceof Component) {
        renderInstance(C)
      } else {
        createInstanceAndRender(C)
      }
    })
  } else {
    if (component instanceof Component) {
      renderInstance(component)
    } else {
      createInstanceAndRender(component)
    }
  }
}
