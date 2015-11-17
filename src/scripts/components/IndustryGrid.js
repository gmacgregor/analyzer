
const React = require('react');
const IndustryGridItem = require('./IndustryGridItem');

const IndustryGrid = React.createClass({
  renderIndustry(key) {
    let industry = this.props.allIndustries[key];
    return (
      <IndustryGridItem
        key={industry.id}
        name={industry.name}
        id={industry.id}
        addIndustry={this.props.addIndustry}
        removeIndustry={this.props.removeIndustry}
        selectedIndustries={this.props.selectedIndustries}
      />
    )
  },
  render() {
    let industries = Object.keys(this.props.allIndustries);
    return (
      <div>
        <div className='industry-grid'>
          {industries.map(this.renderIndustry)}
        </div>
        <button className="analyzer-btn-makechoices" onClick={this.props.submitChoices}>Submit Choices</button>
      </div>
    )
  }
});

module.exports = IndustryGrid;