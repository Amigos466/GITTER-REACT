import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Import Actions
import { toggleAddPost, login_to, get_messages_to, search_rooms } from './AppActions';
import { getUserInfo } from './AppReducer';
import { switchLanguage } from '../../modules/Intl/IntlActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false, queryroom: '' };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
    this.login_toSection();
  }

  toggleAddPostSection = () => {
    this.props.dispatch(toggleAddPost());
  };

  login_toSection = () => {
    this.props.dispatch(login_to());
  };
  
  search_roomsSection = (e) => {
   this.props.dispatch(search_rooms(e));
  }

  render() {
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="LITS"
            titleTemplate="%s - GITTER"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <Header
            searchf={this.search_roomsSection} 
            user={this.props.user}
            switchLanguage={lang => this.props.dispatch(switchLanguage(lang))}
            intl={this.props.intl}
            login={this.login_toSection}
            toggleAddPost={this.toggleAddPostSection}
          />
          <div className={styles.container}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
    user: getUserInfo(store),
  };
}

export default connect(mapStateToProps)(App);
