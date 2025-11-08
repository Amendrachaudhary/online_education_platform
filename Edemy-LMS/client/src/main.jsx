import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { DemoClerkProvider } from "./utils/DemoClerkProvider.jsx";

// DEMO MODE: Always use DemoClerkProvider (no Clerk needed)
console.log('⚠️ Running in DEMO MODE - no authentication required');

const AppWrapper = () => {
	return (
		<DemoClerkProvider>
			<AppContextProvider>
				<App />
			</AppContextProvider>
		</DemoClerkProvider>
	);
};

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<AppWrapper />
	</BrowserRouter>
);
