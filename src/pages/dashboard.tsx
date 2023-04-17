import {
    Center,
    Checkbox,
    HStack,
    Heading,
    Radio,
    RadioGroup,
    Select,
    Spacer,
    VStack
} from "@chakra-ui/react"
import Head from "../components/Head"
import ColorToggle from "../components/ColorToggle"
import { useEffect, useState } from "react"
import InputGroup from "../components/InputGroup"
import SuggestionBox from "../components/SuggestionBox"
import identify from "../utils/identify"
import UploadButton from "../components/UploadButton"
import FileViewer from "../components/FileViewer"
import { InfoIcon } from "@chakra-ui/icons"

const Dashboard = () => {
    const [attack, setAttack] = useState("sqli")
    const [selected, setSelected] = useState<number | null>(null)
    const [file, setFile] = useState("")

    const [msg, setMsg] = useState<string | null>(null)
    const [vars, setVars] = useState<string[]>([])
    const [correction, setCorrection] = useState<string[]>([])

    async function update(file: string, selected: number | null) {
        if (file !== "" && selected != null) {
            const lines = file.split("\n")
            const res = await identify(lines[selected], attack)
            setMsg(res.msg)
            setVars(res.vars)
            setCorrection(res.correction)
        }
    }

    useEffect(() => {
        setMsg(null)
        setVars([])
        setCorrection([])
        update(file, selected)
    }, [file, selected])

    return (
        <Center minH="100vh">
            <VStack
                px={8}
                py={4}
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
                        <RadioGroup
                            w="100%"
                            onChange={setAttack}
                            value={attack}
                            name="method"
                            id="method"
                            defaultValue="sqli">
                            <HStack
                                w="100%"
                                spacing={8}
                                borderWidth={2}
                                rounded="md"
                                p={4}
                                align="start">
                                <Heading size="md">Attack types</Heading>
                                <Radio value="sqli">SQL Injection</Radio>
                                <Radio value="xss">
                                    Cross Site Scripting (XSS)
                                </Radio>
                                <Radio value="cmdi">
                                    Command Line Injection
                                </Radio>
                                <Radio value="xmli">XML Injection</Radio>
                            </HStack>
                        </RadioGroup>
                        <HStack w="100%" align="start" spacing={4}>
                            <FileViewer
                                file={file}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <VStack w="50%" spacing={4}>
                                <HStack w="100%" py={2}>
                                    <InfoIcon alignSelf="start" fontSize="lg" />
                                    <Heading size="sm">
                                        {msg ? msg : "Select a line"}
                                    </Heading>
                                </HStack>
                                {vars.length > 0 && <InputGroup vars={vars} />}
                                {correction.length > 0 && (
                                    <SuggestionBox text={correction} />
                                )}
                            </VStack>
                        </HStack>
                    </VStack>
                )}
            </VStack>
        </Center>
    )
}

export default Dashboard
