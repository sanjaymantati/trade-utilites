// import node module libraries
import { useState } from 'react';

// import sub components

const DefaultDashboardLayout = (props) => {
	const [showMenu, setShowMenu] = useState(true);
	return (
		<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
			{props.children}
		</div>
	);
};
export default DefaultDashboardLayout;
