// import node module libraries
import { useState } from 'react';

// import sub components
import NavbarVertical from './navbars/NavbarVertical';
import NavbarTop from './navbars/NavbarTop';
import { Row, Col } from 'react-bootstrap';
import SessionHeader from "./SessionHeader";

const DefaultDashboardLayout = (props) => {
	const [showMenu, setShowMenu] = useState(true);
	return (
		<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
			{props.children}
		</div>
	);
};
export default DefaultDashboardLayout;
