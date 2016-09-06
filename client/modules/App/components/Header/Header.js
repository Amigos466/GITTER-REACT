import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './Header.css';



export function Header(props, context) {

  function get_log_butt() {
    if (props.user.user_info.user.displayName != 'login') {
      return (<div>{props.user.user_info.user.displayName}<a href="/logout"><button type="button" className="btn btn-primary login_butt_bs">Logout</button></a></div>)
    }
    else{
      return <a href="/login"><button type="button" className="btn btn-primary login_butt_bs">Login</button></a>
   }
  }

  function findrooms(e) {
    const field = document.getElementById('search_field');
    console.log(field.value);
    props.searchf(field.value);
  }

  return (
    <header>
      <nav className="navbar navbar-default" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand padd_pl_title" href="#">LITS-GITTER</a>
          </div>
          <div className="collapse navbar-collapse navbar-ex1-collapse">
            <div className="navbar-form navbar-left padd_pl" role="search">
              <div className="form-group">
                <input id="search_field" type="text" className="form-control main_srch" placeholder="Search for room"/>
              </div>
              <button onClick={()=> findrooms()} className="btn btn-default"><span className="glyphicon glyphicon-search" aria-hidden="true"></span></button>
            </div>
            <form className="navbar-form navbar-right" role="search">
              { get_log_butt() }
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
  user: PropTypes.object.isRequired,
  toggleAddPost: PropTypes.func.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default Header;
