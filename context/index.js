import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
const initialRootState = {
    user: null,
};
const Context = createContext();
const rootReducer = (state, action) => {
    switch (action.type) {
        case "INITIAL_LOGIN_STATE":
            return { user: action.payload };

        case "SETTINGS_CHANGE":
            return {
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };

        case "COURSE_ADDITION":
            return {
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };

        case "LOGOUT":
            return { user: null };

        default:
            return state;
    }
};

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialRootState);
    const router = useRouter();

    useEffect(() => {
        dispatch({
            type: "INITIAL_LOGIN_STATE",
            payload: JSON.parse(localStorage.getItem("user")),
        });

        // const getCsrfToken = async () => {
        //     const { data } = await axios.get("/api/csrf-token");
        //     if (data.success === true)
        //         axios.defaults.headers.common["CSRF-TOKEN"] = data.csrfToken;
        // };

        // getCsrfToken();
    }, []);

    useEffect(() => {
        onbeforeunload = () => {
            localStorage.setItem("user", JSON.stringify(state.user));
        };
    }, [state]);

    // // Add a request interceptor
    // axios.interceptors.request.use(
    //     (config) => {
    //         // Do something before request is sent
    //         return config;
    //     },
    //     (error) => {
    //         // Do something with request error
    //         return Promise.reject(error);
    //     }
    // );

    // Add a response interceptor
    axios.interceptors.response.use(
        (response) => {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        },
        async (error) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            let res = error.response;
            if (
                res.status === 401 &&
                res.config &&
                !res.config.__isRetryRequest
            ) {
                try {
                    await axios.post("/api/auth/logout");
                    dispatch({ type: "LOGOUT" });
                    localStorage.removeItem("user");
                    router.push("/user/login");
                } catch (err) {
                    // console.error(`Error: ${err}`);
                    toast.error("Error");
                    return;
                }
            }
            return Promise.reject(error);
        }
    );

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export { Context, Provider };
