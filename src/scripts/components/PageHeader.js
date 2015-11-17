
require('../../styles/page');

const React = require('react');

const PageHeader = React.createClass({
  render() {
    const title = this.props.title;
    const brief = this.props.brief;
    return (
      <header className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-brief" dangerouslySetInnerHTML={{__html: brief}}></p>
      </header>
    )
  }
});

module.exports = PageHeader;