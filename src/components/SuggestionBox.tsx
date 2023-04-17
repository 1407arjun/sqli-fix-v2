import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack
} from "@chakra-ui/react"
import { Heading, Text } from "@chakra-ui/react"

const SuggestionBox = ({ text }: { text: string[] }) => {
    return (
        <Accordion
            w="100%"
            borderWidth={2}
            rounded="md"
            allowToggle
            overflowY="auto"
            h="calc(36vh - 0.5rem)">
            <AccordionItem>
                <AccordionButton>
                    <Heading size="md" w="100%" textAlign="start">
                        You can correct it
                    </Heading>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} as={VStack} alignItems="start">
                    {text.map((t) => {
                        return <Text key={t}>{t}</Text>
                    })}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default SuggestionBox
