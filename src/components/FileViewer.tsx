import { VStack, Text, HStack } from "@chakra-ui/react"
import { Dispatch, SetStateAction } from "react"

const FileViewer = ({
    file,
    selected,
    setSelected
}: {
    file: string
    selected: number | null
    setSelected: Dispatch<SetStateAction<number | null>>
}) => {
    const lines = file.split("\n")
    return (
        <VStack
            w="50%"
            align="start"
            spacing={0}
            overflowY="auto"
            h="72vh"
            borderWidth={2}
            rounded="md">
            {lines.map((l, i) => {
                return (
                    <HStack
                        key={l}
                        w="100%"
                        alignItems="stretch"
                        cursor="pointer"
                        bgColor={selected === i ? "gray.700" : "initial"}
                        _hover={{ bgColor: "gray.700" }}
                        onClick={() => setSelected(i)}>
                        <Text
                            w={10}
                            flexShrink={0}
                            borderEndWidth={2}
                            py={1}
                            px={2}
                            textAlign="end">
                            {i + 1}
                        </Text>
                        <Text pl={2} alignSelf="center">
                            {l}
                        </Text>
                    </HStack>
                )
            })}
        </VStack>
    )
}

export default FileViewer
