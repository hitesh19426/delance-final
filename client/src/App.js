import React, { Component } from "react";
import DalanceContract from "./contracts/Delance.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Navigation, Footer, Home, Requests, Details} from "./components";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DalanceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        DalanceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router >
          <Navigation />
          
          <div className="address">
            Current Address: {this.state.web3.currentProvider.selectedAddress}
          </div>

          <Switch>
            <Route exact path="/" exact component={() => <Home contract={this.state.contract} web3={this.state.web3}/>} />
            <Route exact path="/requests" exact component={() => <Requests contract={this.state.contract} web3={this.state.web3} />} />
            <Route exact path="/details" exact component={() => <Details contract={this.state.contract} web3={this.state.web3} />} />
          </Switch>

          {/* <Footer /> */}

        </Router>
      </div>
    );
  }
}

export default App;
