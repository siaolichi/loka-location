/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TweenMax } from 'gsap';

import PrivateRoute from './routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Alert from './components/layout/Alert';
import Dashboard from './components/layout/Dashboard';
import Three from './components/elements/Three';
import MapPage from './components/layout/MapPage';
import ProfileModal from './components/layout/ProfileModal';
import Spinner from './components/layout/Spinner';
import { connect } from 'react-redux';
import { loadUser, setLoading } from './actions/auth';

import './style/App.scss';
import '@material/react-button/dist/button.css';
import '@material/react-dialog/dist/dialog.css';
import '@material/react-list/dist/list.css';
import '@material/react-checkbox/dist/checkbox.css';
import '@material/react-card/dist/card.css';
import '@material/react-select/dist/select.css';
// import '@material/react-list/dist/menu.css';
// import '@material/react-menu-surface/dist/menu.css';
import '@material/react-menu/dist/menu.css';

function App({ loadUser, setLoading, loading, isAuthenticated }) {
	const [openAccount, setOpenAccount] = useState(false);

	useEffect(() => {
		if (window.location.href.includes('login?code=')) {
			setLoading();
		} else {
			loadUser();
		}
	}, []);
	useEffect(() => {
		if (isAuthenticated) {
			TweenMax.to('.container', 2, {
				background: 'linear-gradient(to bottom, rgb(23, 1, 58) 0%, rgb(0, 158, 139) 100%)'
			});
		} else {
			TweenMax.to('.container', 2, {
				background: 'linear-gradient(to bottom, rgb(251,121,187) 0%, rgb(93,255,250) 100%)'
			});
		}
	}, [isAuthenticated]);
	return (
		<div className='container app' data-test='component-app'>
			{/* <div className="dark-overlay" /> */}
			<Three />
			{loading && <Spinner />}
			<Navbar setOpenAccount={setOpenAccount} />
			<Alert />
			<ProfileModal openAccount={openAccount} setOpenAccount={setOpenAccount} />
			<Routes>
				<Route exact path='/' element={<Landing />} />
				<Route exact path='/login' element={<Login />} />
				<Route exact path='/signup' element={<Signup />} />
				<Route exact path='/map' element={<MapPage />} />
				<Route exact path='/map/:group_id' element={<MapPage />} />
				<Route exact path='/dashboard' element={<PrivateRoute />}>
					<Route exact path='/dashboard' element={<Dashboard />} />
				</Route>
			</Routes>
			<footer>
				<small>&copy; Copyright 2020, Hsiao Li-Chi</small>
			</footer>
		</div>
	);
}
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading
});
export default connect(mapStateToProps, { loadUser, setLoading })(App);
