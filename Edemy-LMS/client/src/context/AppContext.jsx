import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import axios from 'axios'
import {  toast } from 'react-toastify';
export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    // For demo mode: use mock values instead of Clerk hooks
    // These will be set when Clerk is not available
    const [getToken] = useState(() => () => Promise.resolve('demo-token'));
    const [user] = useState(null);

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    // fetch all courses 
    const fetchAllCourses = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/course/all');
            if(data.success && data.courses && data.courses.length > 0)
            {
                setAllCourses(data.courses)
            } else {
                // Use dummy courses for demo
                console.log('Using dummy courses for demo');
                setAllCourses(dummyCourses);
            }
            
        } catch (error) {
            // Use dummy courses when API fails
            console.log('API failed, using dummy courses:', error.message);
            setAllCourses(dummyCourses);
        }
    }

    // fetch user data
    const fetchUserData = async ()=>{
        if (!user) {
            // Demo mode - set dummy user data
            setUserData({
                user_id: 'demo-user',
                name: 'Demo User',
                email: 'demo@example.com',
                role: 'student'
            });
            return;
        }

        if(user.publicMetadata?.role === 'educator'){
            setIsEducator(true);
        }

        try {
            const token = await getToken();

            const {data} = await axios.get(backendUrl + '/api/user/data' , {headers: {Authorization: `Bearer ${token}`}})
        
            if(data.success){
                setUserData(data.user)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            // In demo mode, just set dummy data
            setUserData({
                user_id: 'demo-user',
                name: 'Demo User',
                email: 'demo@example.com',
                role: 'student'
            });
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating;
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    // Function to calculate course Duratuion
    const calculateCourseDuration = (course)=>{
        let time = 0 ;
        course.courseContent.map((chapter)=> chapter.chapterContent.map(
            (lecture)=> time += lecture.lectureDuration 
        ))

        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]}) 
    }

    // Function to calculate to no. of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // Fetch user enrolled courses

    // const fetchUserEnrolledCourses = async()=>{
    //     // setEnrolledCourses(dummyCourses)
    //    try {
    //     const token = await getToken();

    //     const data = await axios.get(backendUrl + '/api/user/enrolled-courses', {headers: {Authorization: `Bearer ${token}`}})
        
    //     console.log("Data",data);
    //     if(data){
    //         setEnrolledCourses(data.enrolledCourses.reverse());
    //         // console.log("enroll", enrolledCourses);
    //         // console.log("setenroll", enrolledCourses);
            
    //     }else{
    //         toast.error(data.message)
    //     }
    //    } catch (error) {
    //     toast.error(error.message)
    //    }
    // }


    const fetchUserEnrolledCourses = async () => {
        if (!user) {
            // Demo mode - return empty array
            setEnrolledCourses([]);
            return;
        }
        
        try {
            const token = await getToken();
            const response = await axios.get(backendUrl + "/api/user/enrolled-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // console.log("Response:", response); // Debugging: Log full response
    
            if (response.data && response.data.enrolledCourses) {
                setEnrolledCourses(response.data.enrolledCourses.reverse());
            } else {
                setEnrolledCourses([]); // Return empty array instead of error in demo
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setEnrolledCourses([]); // Return empty array in demo mode
        }
    };
    
    useEffect(()=>{
        fetchAllCourses()
    },[])

    useEffect(()=>{

    },[])


    // const logToken = async ()=>{
    //     console.log(await getToken());
        
    // }

    useEffect(()=>{
        if(user){
            fetchUserData()
            // logToken()
            fetchUserEnrolledCourses()
        }
    },[user])

    const value = {
        currency,allCourses, navigate, isEducator, setIsEducator,
        calculateRating,calculateChapterTime,calculateCourseDuration,calculateNoOfLectures
        ,fetchUserEnrolledCourses, setEnrolledCourses,enrolledCourses,backendUrl, userData, setUserData, getToken, fetchAllCourses

    }


    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )

    

}