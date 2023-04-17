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
        <Accordion w="100%" allowToggle>
            <AccordionItem
                borderWidth={2}
                rounded="md"
                overflowY="auto"
                maxH="calc(34vh - 1rem)">
                <AccordionButton>
                    <Heading size="md" w="100%" textAlign="start">
                        Here&apos;s how you can correct it
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
