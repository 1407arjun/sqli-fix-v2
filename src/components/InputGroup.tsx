import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import predict from "../utils/predict"

const InputGroup = ({ query, vars }: { query: string; vars: string[] }) => {
    const toast = useToast()
    const [ips, setIps] = useState(vars.map(() => ""))

    useEffect(() => {
        console.log(ips)
    }, [ips])
    return (
        <VStack w="67%" borderWidth={2} rounded="md" p={4} spacing={4}>
            {vars.map((v, i) => {
                return (
                    <FormControl key={v}>
                        <FormLabel>{v}</FormLabel>
                        <Input
                            name={v}
                            id={v}
                            placeholder={v}
                            size="md"
                            onChange={(e) => {
                                setIps((prev) => {
                                    prev[i] = e.target.value
                                    return [...prev]
                                })
                            }}
                        />
                    </FormControl>
                )
            })}
            <Button
                onClick={async () => {
                    if (await predict(query, vars, ips))
                        toast({
                            title: "SQLi detected",
                            description: "Possible SQL injection attack",
                            status: "error",
                            duration: 9000,
                            isClosable: true
                        })
                    else
                        toast({
                            title: "All clear",
                            description: "Not an attack",
                            status: "success",
                            duration: 9000,
                            isClosable: true
                        })
                }}>
                Test an attack
            </Button>
        </VStack>
    )
}

export default InputGroup
