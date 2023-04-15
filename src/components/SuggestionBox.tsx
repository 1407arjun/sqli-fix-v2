import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack
} from "@chakra-ui/react"
import { Heading, Text } from "@chakra-ui/react"

const SuggestionBox = ({ query }: { query: string[] }) => {
    return (
        <Accordion w="33%" borderWidth={2} rounded="md" allowToggle>
            <AccordionItem>
                <AccordionButton>
                    <Heading size="md" w="100%" textAlign="start">
                        You can correct it
                    </Heading>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} as={VStack} alignItems="start">
                    {query.map((q) => {
                        return <Text key={q}>{q}</Text>
                    })}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default SuggestionBox
