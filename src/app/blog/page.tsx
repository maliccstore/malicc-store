"use client"
import { Flex, Text, Button } from "@radix-ui/themes";
import { useAtom,getDefaultStore } from 'jotai';
import { countAtom } from '../store/countAtom';
import { themeColor } from "../store/store";

export default  function Page() {
    const [count, setCount] = useAtom(countAtom);
    const [theme, setTheme] = useAtom(themeColor)
    const defaultStore = getDefaultStore()
    return (
    <Flex direction="column" gap="2">
        <Text>Hello from Blog, so lets count:  {count}</Text>
        <Button onClick={()=>{setCount(count + 1)}}>Increment</Button>
        <Button onClick={() => {setCount(count - 1)}}>Decrement</Button>
        <Button onClick={()=>{if(theme == "light"){setTheme("dark");} else{setTheme("light")}console.log(theme)}}>Change Theme</Button>
    </Flex>)
    
}