import React, { createContext, useState } from "react";

interface Props {
	children: any;
}

interface ContextType{
    promptMode:boolean;
	setPromptMode:any;
}
// create context api values are prompt values 
export const AppContext = createContext<ContextType>({promptMode:false,setPromptMode:()=>{}});

/**
 * To provoider values of context api
 * @param param0
 * @returns 
 */
const AppProvider: React.FC<Props> = ({ children }) => {
	const [promptMode, setPromptMode] = useState(false);
	const value = { promptMode, setPromptMode};
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
