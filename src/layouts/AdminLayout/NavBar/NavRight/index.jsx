import React, { useState } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: '2 days'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: '2 days'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: '2 days'
    }
  ];

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" " className="waves-effect-1">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic" className="waves-effect">
              <i className="feather icon-bell icon" />
              <span class="noti-dot"></span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  {/* <Link to="#" className="me-2">
										mark as read
									</Link> */}
                  <Link to="#">clear all</Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  {/* <ListGroup.Item as="li" bsPrefix=" " className="n-title">
										<p className="m-b-0">NEW</p>
									</ListGroup.Item> */}
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Card className="d-flex  shadow-none mb-0 p-0" style={{ flexDirection: 'row', backgroundColor: 'unset' }}>
                      <img className="img-radius" src={avatar1} alt="Generic placeholder" />
                      <Card.Body className="p-0">
                        <p>
                          <strong>John Doe</strong>
                        </p>
                        <p>If several languages coalesce the grammar</p>
                        <p>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock me-2" />
                            30 min ago
                          </span>
                        </p>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                  {/* <ListGroup.Item as="li" bsPrefix=" " className="n-title">
										<p className="m-b-0">EARLIER</p>
									</ListGroup.Item> */}
                  {notiData.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card className="d-flex  shadow-none mb-0 p-0" style={{ flexDirection: 'row', backgroundColor: 'unset' }}>
                          <img className="img-radius" src={data.image} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.name}</strong>
                            </p>
                            <p>{data.details}</p>
                            <p>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {data.activity} ago
                              </span>
                            </p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="waves-effect-1">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox waves-effect" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>

        <ListGroup.Item as="li" bsPrefix=" " className="waves-effect-1">
          <Dropdown align={'end'} className="drp-user menu-drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic" className="profile-notification-1 waves-effect">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span className="ms-1">John Doe</span>
                <i className="icon feather icon-chevron-down" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification ">
              {/* <div className="pro-head">
								<img src={avatar1} className="img-radius" alt="User Profile" />
								<span>John Doe</span>
								<Link to="#" className="dud-logout" title="Logout">
								<i className="feather icon-log-out" />
								</Link>
							</div> */}
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>

                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item>
              </ListGroup>
              <div className="dropdown-divider"></div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body log-out">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="logout" className="dropdown-item">
                    <i className="feather icon-log-out" /> LogOut
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {/* <ListGroup.Item as="li" bsPrefix=" " className="waves-effect-1">
				<Dropdown align={'end'} className="drp-user waves-effect">
					<Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
					<i className="icon feather icon-settings" />
					</Dropdown.Toggle>
				</Dropdown>
				</ListGroup.Item> */}
      </ListGroup>
    </React.Fragment>
  );
};

export default NavRight;
