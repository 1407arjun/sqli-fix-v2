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

const InputGroup = ({ vars, attack }: { vars: string[]; attack: string }) => {
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
            h="calc(35vh - 1.5rem)">
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
                flexShrink={0}
                onClick={async () => {
                    const { prediction, title, description } = await predict(
                        ips,
                        attack
                    )
                    if (prediction)
                        toast({
                            title,
                            description,
                            status: "error",
                            duration: 9000,
                            isClosable: true
                        })
                    else
                        toast({
                            title,
                            description,
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
