import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Header extends Component
{
    render() {
      return(
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to={'/'}>
                &nbsp; PEP
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>
        )
    }
}
export default Header