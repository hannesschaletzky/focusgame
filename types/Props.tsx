import { Store } from 'redux'

export interface WrapperProps {
  store: Store<any, any>
}

export interface GameProps {
  store: Store<any, any>
  counter: number
}
