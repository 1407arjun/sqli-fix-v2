import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast
} from "@chakra-ui/react"
import { useState } from "react"
import predict from "../utils/predict"

const InputGroup = ({ vars }: { vars: string[] }) => {
    const toast = useToast()
    const [ips, setIps] = useState(vars.map(() => ""))

    return (
        <VStack
            w="100%"
            borderWidth={2}
            rounded="md"
            p={4}
            spacing={4}
            overflowY="auto"
            h="calc(36vh - 0.5rem)">
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
                    if (await predict(vars, ips))
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
