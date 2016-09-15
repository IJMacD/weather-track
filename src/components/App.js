import React from 'react'

import styles from '../styles/App.css';


export default class App extends React.Component {
  constructor () {
    super();
    
    this.state = {
      isLoading: true
    };

    setTimeout(() => {
      this.setState({isLoading: false})
    }, 3000);
  }

  render () {
    const { isLoading } = this.state;

    return (
      <div>
        <div className={styles.jumbotron}>
          <h1>
            Blank Project
          </h1>
          { isLoading ? 
            <p className={styles.loading2}>Loading</p> :
            <p>Welcome to the project</p>
          }
        </div>
        <div className={styles.container}>
          <h1>Project Template</h1>
          <p>There's more going on down here.</p>
        </div>
      </div>
    )
  }
}