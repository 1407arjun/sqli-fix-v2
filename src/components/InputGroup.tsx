import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast
} from "@chakra-ui/react"

const InputGroup = ({ vars }: { vars: string[] }) => {
    const toast = useToast()
    return (
        <VStack w="67%" borderWidth={2} rounded="md" p={4} spacing={4}>
            {vars.map((v) => {
                return (
                    <FormControl key={v}>
                        <FormLabel>{v}</FormLabel>
                        <Input name={v} id={v} placeholder={v} size="md" />
                    </FormControl>
                )
            })}
            <Button
                onClick={() =>
                    toast({
                        title: "Corrected",
                        description:
                            "Here is the corrected query to be replaced",
                        status: "info",
                        duration: 9000,
                        isClosable: true
                    })
                }>
                Test an attack
            </Button>
        </VStack>
    )
}

export default InputGroup
