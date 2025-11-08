// Safe wrapper for Clerk hooks - DEMO MODE ONLY
// Always uses demo hooks - no Clerk dependencies
import { useDemoUser, useDemoClerk } from './DemoClerkProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Safe useUser hook - always uses demo
export const useUserSafe = () => {
    return useDemoUser();
};

// Safe useClerk hook - always uses demo with functional sign in
export const useClerkSafe = () => {
    const navigate = useNavigate();
    const demoClerk = useDemoClerk();
    
    // Override openSignIn to actually do something in demo mode
    return {
        openSignIn: () => {
            // In demo mode, just show a message and navigate to course list
            toast.info('Demo Mode: You can browse courses without signing in!', {
                position: "top-center",
                autoClose: 3000,
            });
            navigate('/course-list');
        }
    };
};

// Safe UserButton component - always shows demo user
export const UserButtonSafe = () => {
    return (
        <div className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer hover:bg-gray-300">
            Demo User
        </div>
    );
};

