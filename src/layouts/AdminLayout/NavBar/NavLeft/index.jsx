import React, { useContext } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';
import { ConfigContext } from '../../../../contexts/ConfigContext';
import * as actionType from '../../../../store/actions';

const NavLeft = () => {
  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const { dispatch } = configContext;

  let navItemClass = ['nav-item waves-effect-1'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }

  // Toggle classes based on collapseMenu state
  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass.push('on');
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <Link to="#!" className={toggleClass.join(' ')} id="mobile-collapse" onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>
            <span />
          </Link>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
        {/* <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align={'start'} className="position-static">
            <Dropdown.Toggle variant={'link'} id="dropdown-basic" className="waves-effect dropdown-basic">
              Dropdown
            </Dropdown.Toggle>
            <Dropdown.Menu className='w-100  p-5 py-3'>
                            <div className="d-flex">
                                <ul>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li> <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                        Action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                        Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                        Something else here
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                    <Link to="#" className="dropdown-item">
                                        Something else here
                                    </Link>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                        Action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                        Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                        Something else here
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Something else here
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="dropdown-item">
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                    <Link to="#" className="dropdown-item">
                                        Something else here
                                    </Link>
                                    </li>
                                </ul>
                            </div>
                        </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item> */}
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
