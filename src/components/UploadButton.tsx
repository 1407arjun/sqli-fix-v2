import { AttachmentIcon } from "@chakra-ui/icons"
import { Box, Button } from "@chakra-ui/react"
import { Dispatch, FormEvent, SetStateAction, useRef } from "react"

const UploadButton = ({
    setFile
}: {
    setFile: Dispatch<SetStateAction<string>>
}) => {
    let fileRef = useRef<HTMLInputElement>()

    const readFile = (event: FormEvent<HTMLInputElement>) => {
        const fileReader = new FileReader()
        //@ts-ignore
        const { files } = event.target

        fileReader.readAsText(files[0], "UTF-8")
        fileReader.onload = (e) => {
            const content = e.target!.result?.toString().replace(/\r\n/g, "\n")
            if (content) setFile(content)
        }
    }

    return (
        <Box alignSelf="center">
            <input
                //@ts-ignore
                ref={fileRef}
                type="file"
                accept=".php"
                onChange={readFile}
                style={{ display: "none" }}></input>
            <Button
                type="submit"
                onClick={() => {
                    fileRef.current!.click()
                }}
                leftIcon={<AttachmentIcon />}>
                Upload PHP file
            </Button>
        </Box>
    )
}

export default UploadButton
