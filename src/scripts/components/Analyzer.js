
/**
 *
 * Analyzer app consists of 2 major components:
 *
 *   1. AnalyzerPicker (industry grid picker)
 *   2. AnalyzerResults (send selections and email to server)
 *
 * Each component has separate state.
 * Data from the AnalyzerPicker is "shared" with AnalyzerResults via localStorage.
 * This is probably not the most "React Way" of doing thigs but for MVP it'll work.
 *
 * Both components live in this file for now. Refactoring could allow them to live in separate
 * files, lowering the cognitive overhead of this code ...
 *
 */

// CSS deps
require('styles/analyzer.scss');
require('styles/analyzer-buttons.scss');
require('styles/analyzer-forms.scss');

const h = require('../helpers');

// React deps
const React = require('react');
const ReactDOM = require('react-dom');

// React router concerns; we'll use the Router to manage which components to display (screens)
const
  ReactRouter = require('react-router'),
  Router = ReactRouter.Router,
  Route = ReactRouter.Route,
  History = ReactRouter.History;

// support pushState in IE9
const createBrowserHistory = require('history/lib/createBrowserHistory');

// other components that our major components make use of
const PageHeader = require('./PageHeader');
const IndustryGrid = require('./IndustryGrid');

// localStorage namespace to share selected industries between screens
const lsns = 'analyzer.app';

// first screen: AnalyzerPicker
const AnalyzerPicker = React.createClass({
  mixins: [History],
  getDefaultProps() {
    return {
      allIndustries: require('../helpers/industries')
    }
  },
  getInitialState() {
    // in case of user going back in her browser to change selections, remove previously stored data
    this.clearSelections();
    return {
      selectedIndustries: []
    }
  },
  clearSelections() {
    localStorage.removeItem(lsns);
  },
  storeSelections() {
    localStorage.setItem(lsns, JSON.stringify(this.state.selectedIndustries));
  },
  addIndustry(industry) {
    this.state.selectedIndustries.push(industry);
    this.setState({
      selectedIndustries: this.state.selectedIndustries
    });
    // any time an industry is added, update localstorage
    this.storeSelections();
  },
  removeIndustry(id) {
    // find the {object} with id:id in our array of selectedIndustries and remove
    this.state.selectedIndustries.splice([].findIndex((el) => {
      return el.id === id;
    }), 1);
    this.setState({
      selectedIndustries: this.state.selectedIndustries
    });
    this.storeSelections();
  },
  submitChoices(evt) {
    evt.preventDefault();
    if (!this.state.selectedIndustries.length) {
      return;
    }
    // render the next screen
    this.history.pushState(null, '/thanks');
  },
  render() {
    let props = {
      selectedIndustries: this.state.selectedIndustries,
      allIndustries: this.props.allIndustries,
      addIndustry: this.addIndustry,
      removeIndustry: this.removeIndustry,
      submitChoices: this.submitChoices
    };
    let brief = 'Select up to 4 industries to compare <em class="page-brief__instruction">(you can change these at any time)</em>';
    return (
      <div>
        <PageHeader title="Industry Analyzer" brief={brief} />
        <IndustryGrid {...props} />
      </div>
    )
  }
});

// second screen: AnalyzerResults
const AnalyzerResults = React.createClass({
  mixins: [History],
  handleClick(evt) {
    evt.preventDefault();
    this.history.pushState(null, '/');
  },
  handleSubmit(evt) {
    evt.preventDefault();
    let email = this.refs.email.value;
    if (!this.isValidEmailAddress(email)) {
      return;
    }
    this.state.email = email;
    this.setState({
      email: this.state.email
    });
    this.postToAPIEndpoint();
  },
  isValidEmailAddress(email) {
    // as simple as possible for now
    return email === '' ? false : true;
  },
  postToAPIEndpoint() {
    const data = h.serialize(this.state);
    console.info('This is where I would issue an HTTP POST to an API endpoint with the following serialized data:');
    console.info(data);
    return true;
  },
  getInitialState() {
    return {
      email: null,
      selections: JSON.parse(localStorage.getItem(lsns))
    }
  },
  componentDidMount() {
    this.refs.email.focus();
  },
  displaySelections() {
    const lastIndex = this.state.selections.length;
    const penultimateIndex = lastIndex - 1;
    const choices = this.state.selections.map((selection, i) => {
      let str = '';
      if (i === penultimateIndex && penultimateIndex > 0) {
        str += ' and ';
      } else if (i !== 0 && i !== lastIndex) {
        str += ', ';
      }
      str += `<span class="page-brief__selection">${selection.name}</span>`;
      return str;
    }).join('');
    return `Thanks for your choices. You chose ${choices}.<br>Want more information? Enter your email address below.`
  },
  render() {
    return (
      <div>
        <PageHeader title="Industry Analyzer" brief={this.displaySelections()} />
        <form className="analyzer-form" onSubmit={this.handleSubmit}>
          <input type="email" className="analyzer-form__input-email" ref="email" placeholder="Email Address" />
          <input type="submit" className="analyzer-form__input-submit" value="Submit" />
        </form>
        <button className="analyzer-btn-discardchoices" onClick={this.handleClick}>Change Selection Options</button>
      </div>
    )
  }
});

// create app routes
const routes = (
  <Router history={createBrowserHistory()}>
    <Route path='/' component={AnalyzerPicker}/>
    <Route path='/thanks' component={AnalyzerResults}/>
  </Router>
)

// render the app!
exports.render = () => {
  ReactDOM.render(routes, document.querySelector('main'));
}
