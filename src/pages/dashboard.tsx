import {
    Center,
    Checkbox,
    HStack,
    Heading,
    Select,
    Spacer,
    VStack
} from "@chakra-ui/react"
import Head from "../components/Head"
import ColorToggle from "../components/ColorToggle"
import { useEffect, useState } from "react"
import InputGroup from "../components/InputGroup"
import SuggestionBox from "../components/SuggestionBox"
import getQueries from "../utils/getQueries"
import UploadButton from "../components/UploadButton"

const Dashboard = () => {
    const [queries, setQueries] = useState<string[][]>([])
    const [corrections, setCorrections] = useState<string[][]>([])
    const [selected, setSelected] = useState(0)
    const [file, setFile] = useState("")

    async function update(file: string) {
        if (file !== "") {
            const q = await getQueries(file)
            setQueries(q.vulnerable)
            setCorrections(q.corrections)
        }
    }

    useEffect(() => {
        update(file)
        console.log(queries)
    }, [file])

    return (
        <Center minH="100vh">
            <VStack
                px={8}
                py={4}
                spacing={8}
                w={file === "" ? "inherit" : "100%"}
                minH={file === "" ? "inherit" : "100vh"}>
                <Head />
                <HStack justifyContent="center" alignItems="center" w="100%">
                    <Heading size="lg">SQLi Fix for PHP</Heading>
                    <Spacer />
                    {file !== "" && <UploadButton setFile={setFile} />}
                    <ColorToggle />
                </HStack>
                {file === "" && <UploadButton setFile={setFile} />}
                {file !== "" && (
                    <VStack w="100%" spacing={4}>
                        <HStack
                            w="100%"
                            spacing={8}
                            borderWidth={2}
                            rounded="md"
                            p={4}
                            align="start">
                            <Heading size="md">Attack types</Heading>
                            <Checkbox defaultChecked>SQL Injection</Checkbox>
                            <Checkbox>XSS Attack</Checkbox>
                            <Checkbox>Command Line Injection</Checkbox>
                            <Checkbox>XML Injection</Checkbox>
                        </HStack>
                        <VStack spacing={4} w="100%">
                            <Select placeholder="Select a vulnerable part">
                                {queries.map((q, i) => {
                                    return (
                                        <option
                                            key={q[0]}
                                            value={i}
                                            selected={i == 0}>
                                            {q[0]}
                                        </option>
                                    )
                                })}
                            </Select>
                            <Heading size="md">
                                --{" "}
                                {queries.length > 0 &&
                                queries[selected][1].length > 0
                                    ? "Maybe vulnerable"
                                    : "Not vulnerable directly"}{" "}
                                --
                            </Heading>
                        </VStack>
                        {queries.length > 0 &&
                            queries[selected][1].length > 0 && (
                                <HStack w="100%" align="start" spacing={4}>
                                    <InputGroup
                                        //@ts-ignore
                                        vars={
                                            queries.length > 0
                                                ? queries[selected][1]
                                                : []
                                        }
                                    />
                                    <SuggestionBox
                                        query={corrections[selected]}
                                    />
                                </HStack>
                            )}
                    </VStack>
                )}
            </VStack>
        </Center>
    )
}

export default Dashboard
