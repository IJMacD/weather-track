import React from 'react'
import { render } from 'react-dom'
import App from './components/app'

require('offline-plugin/runtime').install();

render(<App/>, document.getElementById('main'))