import {
    Checkbox,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Input,
    Select,
    Spacer,
    VStack,
    Text,
    Button,
    useToast
} from "@chakra-ui/react"
import Head from "../components/Head"
import ColorToggle from "../components/ColorToggle"
import { useState } from "react"

const array = [
    {
        query: "SELECT * FROM orders WHERE order_date >= '$start_date' AND order_total < $max_total AND order_status = $status AND order_id IN ($order_ids) AND order_amount BETWEEN :min_amount AND $max_amount AND customer_id = $customer_id AND order_is_active = $is_active",
        vul: "Maybe vulnerable"
    },
    {
        query: "INSERT INTO MyGuests (firstname, lastname, email) VALUES ('John', 'Doe', 'john@example.com')",
        vul: "Not vulnerable directly"
    },
    {
        query: "INSERT INTO tablename (firstname, lastname) VALUES ('John', 'Doe')",
        vul: "Not vulnerable directly"
    },
    {
        query: "SELECT * FROM mytable WHERE name like '$name'",
        vul: "Maybe vulnerable"
    },
    {
        query: "UPDATE mytable SET age = $age, isLogin = TRUE WHERE id = '$sessionId'",
        vul: "Maybe vulnerable"
    }
]

const Dashboard = () => {
    const yes = true
    const toast = useToast()
    return (
        <VStack px={8} py={4} spacing={8} w="100%">
            <Head />
            <HStack justifyContent="center" alignItems="center" w="100%">
                <Heading size="lg">SQLi Fix for PHP</Heading>
                <Spacer />
                <ColorToggle />
            </HStack>
            <Select placeholder="Select a vulnerable part">
                {array.map((a, i) => {
                    return (
                        <option key={a.query} value={i}>
                            {a.query}
                        </option>
                    )
                })}
            </Select>
            {!yes && <Heading size="md">-- Not vulnerable directly --</Heading>}
            {yes && <Heading size="md">-- Maybe vulnerable --</Heading>}

            <HStack w="100%" align="start" spacing={4}>
                <VStack w="67%" borderWidth={2} rounded="md" p={4} spacing={4}>
                    {yes && (
                        <FormControl>
                            <FormLabel>age</FormLabel>
                            <Input
                                name="regno"
                                id="regno"
                                placeholder="age"
                                size="md"
                            />
                        </FormControl>
                    )}
                    {yes && (
                        <FormControl>
                            <FormLabel>sessionId</FormLabel>
                            <Input
                                name="regno"
                                id="regno"
                                placeholder="sessionId"
                                size="md"
                            />
                        </FormControl>
                    )}
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
                <VStack w="33%" spacing={4}>
                    <VStack
                        w="100%"
                        borderWidth={2}
                        rounded="md"
                        px={8}
                        py={4}
                        align="start">
                        <Heading size="md">Attack types</Heading>
                        <Checkbox defaultChecked>SQL Injection</Checkbox>
                        <Checkbox>XSS Attack</Checkbox>
                        <Checkbox>Command Line Injection</Checkbox>
                        <Checkbox>XML Injection</Checkbox>
                    </VStack>
                    {yes && (
                        <VStack
                            w="100%"
                            borderWidth={2}
                            rounded="md"
                            px={8}
                            py={4}
                            align="start">
                            <Heading size="md">You can correct it</Heading>
                            <Text fontSize="md">
                                Statement type UPDATE <br />
                                UPDATE mytable SET age = ?, isLogin = TRUE WHERE
                                id = '?' <br />
                                bind($age, 0) <br />
                                bind($sessionId, 1)
                            </Text>
                        </VStack>
                    )}
                </VStack>
            </HStack>
        </VStack>
    )
}

export default Dashboard
