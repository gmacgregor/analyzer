
const React = require('react');
const classnames = require('classnames');

const maxSelectable = 4;

const IndustryGridItem = React.createClass({
  getInitialState() {
    return {
      isSelected: false
    }
  },
  handleClick(evt) {
    evt.preventDefault();
    const maxdOut = this.props.selectedIndustries.length === maxSelectable;
    if (maxdOut) {
      if (this.state.isSelected) {
        this.props.removeIndustry(this.props.id);
      } else {
        return;
      }
    } else {
      if (this.state.isSelected) {
        this.props.removeIndustry(this.props.id);
      } else {
        let industry = { id: this.props.id, name: this.props.name };
        this.props.addIndustry(industry);
      }
    }
    this.setState({
      isSelected: !this.state.isSelected
    });
  },
  render() {
    let id = 'industry-item-' + this.props.id;
    let className = classnames(id, 'industry-item', 'no-select', {
      'industry-item--active': this.state.isSelected
      }
    );
    return (
      <div key={this.props.id} className={className} onClick={this.handleClick}>
        <p className='industry-item__title'>{this.props.name}</p>
      </div>      
    )
  }
});

module.exports = IndustryGridItem;