// Mock ClerkProvider for demo mode - provides context without real Clerk
import { createContext, useContext } from 'react';

const DemoClerkContext = createContext({
    user: null,
    openSignIn: () => console.warn('Sign in not available in demo mode')
});

export const DemoClerkProvider = ({ children }) => {
    return (
        <DemoClerkContext.Provider value={{
            user: null,
            openSignIn: () => console.warn('Sign in not available in demo mode')
        }}>
            {children}
        </DemoClerkContext.Provider>
    );
};

export const useDemoUser = () => {
    const context = useContext(DemoClerkContext);
    return { user: context.user };
};

export const useDemoClerk = () => {
    const context = useContext(DemoClerkContext);
    return { openSignIn: context.openSignIn };
};

