import React from 'react'
import {connect} from 'react-redux'
import {fetchQueryVis} from '../store/query'
import {fetchResult} from '../store/result'
import {getCurrentSearch, getLastSearches} from '../store/searches'

export class QueryInput extends React.Component {
  constructor() {
    super()
    this.state = {
      query: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.setState({query: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.getQueryVis(this.state.query)
    this.props.getResult(this.state.query)
    this.props.setCurrentSearch(this.state.query)
    this.props.setLastSearches(this.state.query)
    this.setState({...this.state, query: ''})
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-field">
            <textarea
              value={this.state.query}
              type="text"
              onChange={this.handleChange}
              placeholder="Query"
              id="textarea1"
              className="materialize-textarea"
            />
            <button
              className="btn waves-effect waves-light"
              type="submit"
              name="action"
            >
              Submit
              <i className="material-icons right">send</i>
            </button>
            {this.props.error.parser || this.props.error.database ? (
              <p>
                {this.props.error.parser.error ||
                  this.props.error.database.error}
              </p>
            ) : (
              <p />
            )}
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  queryVis: state.queryVis,
  result: state.result,
  error: state.error,
  searches: state.searches
})

const mapDispatchToProps = dispatch => ({
  getQueryVis: queryStr => {
    dispatch(fetchQueryVis(queryStr))
  },
  getResult: queryStr => {
    dispatch(fetchResult(queryStr))
  },
  setCurrentSearch: currentSearch => {
    dispatch(getCurrentSearch(currentSearch))
  },
  setLastSearches: lastSearch => {
    dispatch(getLastSearches(lastSearch))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(QueryInput)
