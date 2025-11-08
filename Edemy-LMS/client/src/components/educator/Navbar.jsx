import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButtonSafe, useUserSafe } from "../../utils/clerkSafe.jsx";
import { Link } from "react-router-dom";
import Logger from "../Logger";
const Navbar = () => {
	const educatorData = dummyEducatorData;
	const { user } = useUserSafe();
	return (
		<div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
			<Link to="/">
				<div className="text-2xl md:text-3xl font-bold text-blue-600">
					NANDANI's SCHOOL
				</div>
			</Link>

			<div className="flex items-center gap-5 text-gray-500 relative">
				<div className="hidden md:block">
					<Logger />
				</div>
				<p>Hi! {user ? user.fullName : "Developers"} </p>
				{user ? (
					<UserButtonSafe />
				) : (
					<img className="max-w-8" src={assets.profile_img} alt="profile_img" />
				)}
			</div>
		</div>
	);
};

export default Navbar;
